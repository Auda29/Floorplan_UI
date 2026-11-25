"""Content-addressed image and model storage for Floorplan UI."""

from __future__ import annotations

import asyncio
import base64
import binascii
import hashlib
import json
import logging
import math
import os
import re
import struct
import tempfile
import time
import warnings
from dataclasses import dataclass
from io import BytesIO
from pathlib import Path
from typing import Any, Final, Never, TypeGuard
from xml.etree import ElementTree

from homeassistant.core import HomeAssistant
from PIL import Image, UnidentifiedImageError

from .const import (
    ASSET_GC_GRACE_SECONDS,
    ASSET_STORAGE_DIRECTORY,
    IMAGE_CONTENT_TYPES,
    MAX_GLB_JSON_CHUNK_BYTES,
    MAX_IMAGE_FILE_BYTES,
    MAX_IMAGE_HEIGHT,
    MAX_IMAGE_PIXELS,
    MAX_IMAGE_WIDTH,
    MAX_MODEL_FILE_BYTES,
    MODEL_CONTENT_TYPE,
)

_ASSET_ID_PATTERN: Final = re.compile(r"^[0-9a-f]{64}$")
_ASSET_FILE_PATTERN: Final = re.compile(r"^([0-9a-f]{64})\.(?:png|jpg|svg|glb)$")
_BASE64_PATTERN: Final = re.compile(r"[A-Za-z0-9+/]*={0,2}")
_RASTER_DATA_URL_TYPES: Final = ("image/png", "image/jpeg")
GLB_MAGIC: Final = b"glTF"
_GLB_HEADER: Final = struct.Struct("<4sII")
_GLB_CHUNK_HEADER: Final = struct.Struct("<II")
_GLB_JSON_CHUNK: Final = 0x4E4F534A
_GLB_BIN_CHUNK: Final = 0x004E4942

_SVG_DECLARATION: Final = re.compile(r"<!\s*(?:DOCTYPE|ENTITY|ELEMENT|ATTLIST)\b", re.I)
_SVG_ENCODING: Final = re.compile(r"""^\ufeff?<\?xml\s+[^?]*?encoding\s*=\s*(['"])([^'"]+)\1""")
_SVG_UNSAFE_ELEMENTS: Final = frozenset(
    """
    script foreignobject iframe object embed applet audio video canvas meta link base
    animate set animatetransform animatemotion animatecolor handler discard
    """.split()
)
_SVG_CSS_COMMENT: Final = re.compile(r"/\*[^*]*\*+(?:[^/*][^*]*\*+)*/")
_SVG_UNSAFE_CSS: Final = re.compile(
    r"@import|javascript:|expression\s*\(|\b(?:image-set|image|src)\s*\(", re.I
)
_SVG_CSS_URL: Final = re.compile(r"\burl\s*\(", re.I)

_CONTENT_TYPE_EXTENSION: Final = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/svg+xml": ".svg",
    MODEL_CONTENT_TYPE: ".glb",
}
_CONTENT_TYPE_FORMAT: Final = {
    "image/png": "PNG",
    "image/jpeg": "JPEG",
}

_LOGGER = logging.getLogger(__name__)


class AssetValidationError(ValueError):
    """Raised when asset data is unsafe or unsupported."""


class _SVGTreeBuilder(ElementTree.TreeBuilder):
    """Build an SVG tree without processing instructions."""

    def pi(self, target: str, text: str | None = None) -> Never:
        """Reject processing instructions, including external stylesheets."""
        raise AssetValidationError("SVG processing instructions are unsupported")


@dataclass(frozen=True, slots=True)
class AssetReference:
    """Reference to one persisted asset."""

    asset_id: str
    content_type: str

    def as_dict(self) -> dict[str, str]:
        """Return the persisted JSON representation."""
        return {
            "asset_id": self.asset_id,
            "content_type": self.content_type,
        }


def _decode_allowed_image_data_url(
    uri: str, *, content_types: tuple[str, ...]
) -> tuple[bytes, str]:
    """Decode a bounded base64 image data URL with an allowed MIME type."""
    prefix, separator, encoded = uri.partition(",")
    if not separator or not prefix.startswith("data:") or not prefix.endswith(";base64"):
        raise AssetValidationError("The embedded image must be a base64 image data URL")
    content_type = prefix[len("data:") : -len(";base64")]
    if content_type not in content_types:
        raise AssetValidationError("The embedded image has an unsupported content type")
    if len(encoded) > ((MAX_IMAGE_FILE_BYTES + 2) // 3) * 4:
        raise AssetValidationError("The embedded image exceeds the file size limit")
    if not encoded or not _BASE64_PATTERN.fullmatch(encoded):
        raise AssetValidationError("The embedded image contains invalid base64 data")
    try:
        data = base64.b64decode(encoded, validate=True)
    except (binascii.Error, ValueError) as err:
        raise AssetValidationError("The embedded image contains invalid base64 data") from err
    if len(data) > MAX_IMAGE_FILE_BYTES:
        raise AssetValidationError("The embedded image exceeds the file size limit")
    return data, content_type


def _validate_svg_reference(reference: str) -> None:
    """Allow only document fragments and embedded raster images."""
    if reference.startswith("#"):
        return
    if reference.startswith("data:"):
        _decode_allowed_image_data_url(reference, content_types=_RASTER_DATA_URL_TYPES)
        return
    raise AssetValidationError("SVG references must be local fragments or embedded PNG/JPEG data")


def _validate_svg_css(css: str) -> None:
    """Reject unsafe CSS and validate every CSS URL, including presentation attributes."""
    css = _SVG_CSS_COMMENT.sub("", css)
    if "\\" in css or _SVG_UNSAFE_CSS.search(css):
        raise AssetValidationError("SVG contains unsupported CSS")
    end = 0
    while match := _SVG_CSS_URL.search(css, end):
        end = css.find(")", match.end()) + 1
        if not end:
            raise AssetValidationError("SVG contains a malformed CSS URL")
        reference = css[match.end() : end - 1].strip()
        if reference[:1] in ("'", '"') and reference[-1:] == reference[0]:
            reference = reference[1:-1]
        _validate_svg_reference(reference)


def _validate_svg(data: bytes) -> None:
    """Validate an SVG as inert, self-contained XML."""
    try:
        source = data.decode("utf-8")
        if "\0" in source:
            raise AssetValidationError("The SVG is not valid UTF-8 XML")
        if _SVG_DECLARATION.search(source):
            raise AssetValidationError("SVG document type and entity declarations are forbidden")
        encoding = _SVG_ENCODING.match(source)
        if encoding and encoding[2].lower() not in ("utf-8", "utf8"):
            raise AssetValidationError("SVG must declare UTF-8 encoding")
        root = ElementTree.fromstring(
            source, parser=ElementTree.XMLParser(target=_SVGTreeBuilder())
        )
    except (UnicodeDecodeError, ElementTree.ParseError) as err:
        raise AssetValidationError("The SVG is not valid UTF-8 XML") from err

    if root.tag not in ("svg", "{http://www.w3.org/2000/svg}svg"):
        raise AssetValidationError("The SVG must have an svg root element")
    for element in root.iter():
        tag = element.tag.rsplit("}", 1)[-1].lower()
        if tag in _SVG_UNSAFE_ELEMENTS:
            raise AssetValidationError(f"SVG contains a forbidden {tag} element")
        if tag == "style":
            if len(element):
                raise AssetValidationError("SVG style elements must contain only CSS text")
            _validate_svg_css(element.text or "")
        for attribute, value in element.attrib.items():
            name = attribute.rsplit("}", 1)[-1].lower()
            if name.startswith("on") or attribute == "{http://www.w3.org/XML/1998/namespace}base":
                raise AssetValidationError(f"SVG contains a forbidden {name} attribute")
            if name in ("href", "src"):
                _validate_svg_reference(value.strip())
            else:
                _validate_svg_css(value)


def validate_image_bytes(data: bytes, content_type: str) -> None:
    """Validate SVG or fully decode a raster image within the configured limits."""
    if not data:
        raise AssetValidationError("The image is empty")
    if len(data) > MAX_IMAGE_FILE_BYTES:
        raise AssetValidationError(
            f"The image exceeds the {MAX_IMAGE_FILE_BYTES // 1_000_000} MB limit"
        )
    if content_type == "image/svg+xml":
        _validate_svg(data)
        return
    expected_format = _CONTENT_TYPE_FORMAT.get(content_type)
    if expected_format is None:
        raise AssetValidationError("Only PNG, JPEG and SVG images are supported")

    try:
        with warnings.catch_warnings():
            warnings.simplefilter("error", Image.DecompressionBombWarning)
            with Image.open(BytesIO(data)) as image:
                actual_format = image.format
                width, height = image.size
                if actual_format != expected_format:
                    raise AssetValidationError(
                        "The decoded image format does not match the declared content type"
                    )
                if width > MAX_IMAGE_WIDTH or height > MAX_IMAGE_HEIGHT:
                    raise AssetValidationError(
                        f"The image dimensions exceed {MAX_IMAGE_WIDTH} x {MAX_IMAGE_HEIGHT} pixels"
                    )
                if width * height > MAX_IMAGE_PIXELS:
                    raise AssetValidationError(
                        f"The image exceeds the {MAX_IMAGE_PIXELS:,} pixel limit"
                    )
                image.verify()
            with Image.open(BytesIO(data)) as image:
                image.load()
    except AssetValidationError:
        raise
    except (Image.DecompressionBombError, Image.DecompressionBombWarning) as err:
        raise AssetValidationError("The image dimensions are unsafe") from err
    except (UnidentifiedImageError, OSError, SyntaxError, ValueError) as err:
        raise AssetValidationError("The image could not be fully decoded") from err


def decode_image_data_url(data_url: str) -> tuple[bytes, str]:
    """Decode and validate a PNG, JPEG or SVG data URL."""
    data, content_type = decode_image_data_url_payload(data_url)
    validate_image_bytes(data, content_type)
    return data, content_type


def decode_image_data_url_payload(data_url: str) -> tuple[bytes, str]:
    """Decode a structurally valid image data URL without opening the image."""
    return _decode_allowed_image_data_url(data_url, content_types=IMAGE_CONTENT_TYPES)


def _reject_json_constant(value: str) -> None:
    raise ValueError(f"Invalid JSON constant: {value}")


def _json_float(value: str) -> float:
    number = float(value)
    if not math.isfinite(number):
        raise ValueError("GLB JSON contains a non-finite number")
    return number


def _json_object(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            raise ValueError("GLB JSON contains a duplicate key")
        result[key] = value
    return result


def _read_glb_chunk(data: bytes, offset: int, expected_type: int, size_limit: int) -> int:
    """Return the end offset of a complete chunk of the expected type."""
    if len(data) - offset < _GLB_CHUNK_HEADER.size:
        raise AssetValidationError("The GLB contains a truncated chunk header")
    length, chunk_type = _GLB_CHUNK_HEADER.unpack_from(data, offset)
    end = offset + _GLB_CHUNK_HEADER.size + length
    if chunk_type != expected_type or length % 4 or length > size_limit or end > len(data):
        raise AssetValidationError("The GLB contains an invalid chunk type or length")
    return end


_GLB_UNSUPPORTED_REQUIRED_EXTENSIONS: Final = frozenset(
    {
        "KHR_draco_mesh_compression",
        "EXT_meshopt_compression",
        "KHR_texture_basisu",
    }
)
_MAX_GLB_ACCESSOR_COUNT: Final = 2_000_000
_MAX_GLB_TOTAL_ACCESSOR_ELEMENTS: Final = 10_000_000
_MAX_GLB_IMAGES: Final = 128
_MAX_GLB_TOTAL_TEXTURE_PIXELS: Final = MAX_IMAGE_PIXELS * 4


def _validate_glb_raster_dimensions(image_bytes: bytes) -> int:
    """Validate embedded GLB raster texture dimensions without decompressing full pixel buffers."""
    if not image_bytes:
        raise AssetValidationError("GLB contains an empty embedded texture")
    try:
        with warnings.catch_warnings():
            warnings.simplefilter("error", Image.DecompressionBombWarning)
            with Image.open(BytesIO(image_bytes)) as image:
                if image.format not in {"PNG", "JPEG", "WEBP"}:
                    raise AssetValidationError("GLB embedded textures must be PNG, JPEG, or WebP")
                width, height = image.size
                if width <= 0 or height <= 0:
                    raise AssetValidationError("GLB embedded texture has invalid dimensions")
                if width > MAX_IMAGE_WIDTH or height > MAX_IMAGE_HEIGHT:
                    raise AssetValidationError(
                        f"GLB texture dimensions exceed {MAX_IMAGE_WIDTH} x {MAX_IMAGE_HEIGHT}"
                    )
                pixels = width * height
                if pixels > MAX_IMAGE_PIXELS:
                    raise AssetValidationError(
                        f"GLB texture exceeds the {MAX_IMAGE_PIXELS:,} pixel limit"
                    )
                return pixels
    except AssetValidationError:
        raise
    except (Image.DecompressionBombError, Image.DecompressionBombWarning) as err:
        raise AssetValidationError("GLB embedded texture dimensions are unsafe") from err
    except (UnidentifiedImageError, OSError, SyntaxError, ValueError) as err:
        raise AssetValidationError("GLB embedded texture could not be read") from err


def validate_glb_bytes(data: bytes) -> None:
    """Validate a self-contained binary glTF 2.0 container."""
    if len(data) > MAX_MODEL_FILE_BYTES:
        raise AssetValidationError(
            f"The model exceeds the {MAX_MODEL_FILE_BYTES // 1_000_000} MB limit"
        )
    if len(data) < 28 or _GLB_HEADER.unpack_from(data) != (GLB_MAGIC, 2, len(data)):
        raise AssetValidationError("The file does not have a valid GLB 2.0 header")
    json_end = _read_glb_chunk(data, _GLB_HEADER.size, _GLB_JSON_CHUNK, MAX_GLB_JSON_CHUNK_BYTES)
    bin_offset = 0
    bin_length = 0
    if json_end < len(data):
        bin_end = _read_glb_chunk(data, json_end, _GLB_BIN_CHUNK, MAX_MODEL_FILE_BYTES)
        if bin_end != len(data):
            raise AssetValidationError("The GLB contains unexpected trailing data")
        bin_offset = json_end + _GLB_CHUNK_HEADER.size
        bin_length = bin_end - bin_offset
    try:
        document = json.loads(
            data[_GLB_HEADER.size + _GLB_CHUNK_HEADER.size : json_end].decode("utf-8"),
            parse_constant=_reject_json_constant,
            parse_float=_json_float,
            object_pairs_hook=_json_object,
        )
    except (ValueError, RecursionError) as err:
        raise AssetValidationError("The GLB JSON chunk is invalid") from err
    asset = document.get("asset") if isinstance(document, dict) else None
    version = asset.get("version") if isinstance(asset, dict) else None
    if not isinstance(version, str) or not version.startswith("2."):
        raise AssetValidationError("The GLB JSON must declare a glTF 2.x asset")

    extensions_required = document.get("extensionsRequired", [])
    if not isinstance(extensions_required, list) or not all(
        isinstance(ext, str) for ext in extensions_required
    ):
        raise AssetValidationError("GLB extensionsRequired must be a list of strings")
    unsupported = sorted(_GLB_UNSUPPORTED_REQUIRED_EXTENSIONS.intersection(extensions_required))
    if unsupported:
        raise AssetValidationError(
            f"GLB requires unsupported compression extension(s): {', '.join(unsupported)}"
        )

    buffers = document.get("buffers", [])
    if not isinstance(buffers, list):
        raise AssetValidationError("GLB buffers must be a list")
    for buffer in buffers:
        if not isinstance(buffer, dict) or "uri" in buffer:
            raise AssetValidationError("GLB buffers must use the BIN chunk without a URI")
        length = buffer.get("byteLength", 0)
        if type(length) is not int or not 0 <= length <= bin_length:
            raise AssetValidationError("GLB buffer byteLength exceeds the BIN chunk or is invalid")

    buffer_views = document.get("bufferViews", [])
    if not isinstance(buffer_views, list):
        raise AssetValidationError("GLB bufferViews must be a list")
    for view in buffer_views:
        if not isinstance(view, dict):
            raise AssetValidationError("GLB bufferView entries must be objects")
        view_offset = view.get("byteOffset", 0)
        view_length = view.get("byteLength")
        if (
            type(view_offset) is not int
            or type(view_length) is not int
            or view_offset < 0
            or view_length < 0
            or view_offset + view_length > bin_length
        ):
            raise AssetValidationError("GLB bufferView exceeds the BIN chunk or is invalid")

    accessors = document.get("accessors", [])
    if not isinstance(accessors, list):
        raise AssetValidationError("GLB accessors must be a list")
    total_accessor_elements = 0
    for accessor in accessors:
        if not isinstance(accessor, dict):
            raise AssetValidationError("GLB accessor entries must be objects")
        count = accessor.get("count")
        if type(count) is not int or not 0 <= count <= _MAX_GLB_ACCESSOR_COUNT:
            raise AssetValidationError("GLB accessor count is invalid or exceeds safety limits")
        total_accessor_elements += count
        if total_accessor_elements > _MAX_GLB_TOTAL_ACCESSOR_ELEMENTS:
            raise AssetValidationError("GLB geometry exceeds total vertex/accessor safety limits")

    images = document.get("images", [])
    if not isinstance(images, list):
        raise AssetValidationError("GLB images must be a list")
    if len(images) > _MAX_GLB_IMAGES:
        raise AssetValidationError(f"GLB exceeds the {_MAX_GLB_IMAGES} embedded texture limit")
    total_texture_pixels = 0
    for image in images:
        if not isinstance(image, dict):
            raise AssetValidationError("GLB image entries must be objects")
        if "uri" in image:
            uri = image["uri"]
            if not isinstance(uri, str):
                raise AssetValidationError("GLB image URIs must be embedded raster data URLs")
            image_bytes, _ = _decode_allowed_image_data_url(
                uri, content_types=(*_RASTER_DATA_URL_TYPES, "image/webp")
            )
            total_texture_pixels += _validate_glb_raster_dimensions(image_bytes)
        else:
            buffer_view_index = image.get("bufferView")
            if type(buffer_view_index) is not int or not 0 <= buffer_view_index < len(buffer_views):
                raise AssetValidationError("GLB images must have a valid bufferView or data URI")
            view = buffer_views[buffer_view_index]
            start = bin_offset + view.get("byteOffset", 0)
            end = start + view["byteLength"]
            total_texture_pixels += _validate_glb_raster_dimensions(data[start:end])
        if total_texture_pixels > _MAX_GLB_TOTAL_TEXTURE_PIXELS:
            raise AssetValidationError("GLB embedded textures exceed total pixel safety limits")


def _validate_and_hash_asset(data: bytes, content_type: str) -> str:
    """Validate and hash asset bytes in one executor operation."""
    if content_type == MODEL_CONTENT_TYPE:
        validate_glb_bytes(data)
    else:
        validate_image_bytes(data, content_type)
    return hashlib.sha256(data).hexdigest()


def _decode_validate_and_hash_data_url(data_url: str) -> tuple[bytes, str, str]:
    """Decode, validate, and hash an embedded image exactly once."""
    data, content_type = decode_image_data_url(data_url)
    return data, content_type, hashlib.sha256(data).hexdigest()


def is_asset_id(value: object) -> TypeGuard[str]:
    """Return whether a value is a safe content-addressed asset ID."""
    return isinstance(value, str) and _ASSET_ID_PATTERN.fullmatch(value) is not None


def collect_referenced_asset_ids(config: dict[str, Any]) -> set[str]:
    """Collect valid asset IDs referenced by a floorplan configuration."""
    references: set[str] = set()
    plans = config.get("plans", [])
    if not isinstance(plans, list):
        return references
    for plan in plans:
        if not isinstance(plan, dict):
            continue
        background = plan.get("background")
        if not isinstance(background, dict):
            continue
        asset_id = background.get("asset_id")
        if is_asset_id(asset_id):
            references.add(asset_id)
    return references


class FloorplanAssetStore:
    """Persist validated floorplan assets outside the JSON configuration."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the asset store."""
        self._hass = hass
        self._directory = Path(hass.config.path(ASSET_STORAGE_DIRECTORY))
        self._write_lock = asyncio.Lock()

    @property
    def directory(self) -> Path:
        """Return the private asset directory."""
        return self._directory

    async def async_store(self, data: bytes, content_type: str) -> AssetReference:
        """Validate and atomically persist an asset."""
        asset_id = await self._hass.async_add_executor_job(
            _validate_and_hash_asset,
            data,
            content_type,
        )
        return await self._async_store_validated(data, content_type, asset_id)

    async def _async_store_validated(
        self,
        data: bytes,
        content_type: str,
        asset_id: str,
    ) -> AssetReference:
        """Persist bytes that were already fully decoded and validated."""
        reference = AssetReference(asset_id, content_type)
        path = self.path_for(reference.asset_id, reference.content_type)

        async with self._write_lock:
            if not await self._hass.async_add_executor_job(path.is_file):
                await self._hass.async_add_executor_job(self._atomic_write, path, data)
            # Re-uploading an existing orphan starts a new retention period.
            await self._hass.async_add_executor_job(self._clear_unreferenced, path)
        return reference

    async def async_store_data_url(self, data_url: str) -> AssetReference:
        """Decode and persist a legacy embedded image."""
        data, content_type, asset_id = await self._hass.async_add_executor_job(
            _decode_validate_and_hash_data_url,
            data_url,
        )
        return await self._async_store_validated(data, content_type, asset_id)

    async def async_validate_data_url(self, data_url: str) -> None:
        """Fully validate an embedded image without blocking the event loop."""
        await self._hass.async_add_executor_job(decode_image_data_url, data_url)

    async def async_exists(self, asset_id: str, content_type: str) -> bool:
        """Return whether an asset reference resolves to a file."""
        try:
            path = self.path_for(asset_id, content_type)
        except AssetValidationError:
            return False
        return await self._hass.async_add_executor_job(path.is_file)

    async def async_collect_garbage(
        self,
        referenced_asset_ids: set[str],
        *,
        grace_seconds: int = ASSET_GC_GRACE_SECONDS,
        dry_run: bool = False,
    ) -> list[str]:
        """Remove old, unreferenced assets without following unsafe paths."""
        safe_references = {asset_id for asset_id in referenced_asset_ids if is_asset_id(asset_id)}
        async with self._write_lock:
            return await self._hass.async_add_executor_job(
                self._collect_garbage,
                safe_references,
                max(0, grace_seconds),
                dry_run,
            )

    @staticmethod
    def _clear_unreferenced(path: Path) -> None:
        """Remove the persistent orphan timestamp when an asset is reused."""
        path.with_name(f".{path.name}.unreferenced").unlink(missing_ok=True)

    def _collect_garbage(
        self,
        referenced_asset_ids: set[str],
        grace_seconds: int,
        dry_run: bool,
    ) -> list[str]:
        """Collect garbage synchronously on Home Assistant's executor."""
        if self._directory.is_symlink() or not self._directory.is_dir():
            return []
        now = time.time()
        cutoff = now - grace_seconds
        removed: list[str] = []
        for path in sorted(self._directory.iterdir()):
            match = _ASSET_FILE_PATTERN.fullmatch(path.name)
            if match is None or path.is_symlink():
                continue
            asset_id = match.group(1)
            try:
                if not path.is_file():
                    continue
                marker = path.with_name(f".{path.name}.unreferenced")
                if asset_id in referenced_asset_ids:
                    if not dry_run:
                        self._clear_unreferenced(path)
                    continue
                if marker.is_symlink():
                    continue
                if marker.is_file():
                    unreferenced_since = marker.stat().st_mtime
                else:
                    # File age is unrelated to when the last plan stopped using it.
                    unreferenced_since = now
                    if not dry_run:
                        self._atomic_write(marker, b"")
                if unreferenced_since > cutoff:
                    continue
                if not dry_run:
                    path.unlink(missing_ok=True)
                    marker.unlink(missing_ok=True)
                removed.append(asset_id)
            except OSError as err:
                _LOGGER.warning("Could not remove orphaned floorplan asset %s: %s", path.name, err)
        return removed

    def path_for(self, asset_id: str, content_type: str) -> Path:
        """Resolve a validated asset reference."""
        if not is_asset_id(asset_id):
            raise AssetValidationError("Invalid asset ID")
        try:
            extension = _CONTENT_TYPE_EXTENSION[content_type]
        except KeyError as err:
            raise AssetValidationError("Invalid asset content type") from err
        return self._directory / f"{asset_id}{extension}"

    @staticmethod
    def _atomic_write(path: Path, data: bytes) -> None:
        """Write one asset atomically on the executor."""
        path.parent.mkdir(parents=True, exist_ok=True)
        descriptor, temporary_name = tempfile.mkstemp(
            dir=path.parent,
            prefix=f".{path.name}.",
            suffix=".tmp",
        )
        try:
            with os.fdopen(descriptor, "wb") as temporary_file:
                temporary_file.write(data)
                temporary_file.flush()
                os.fsync(temporary_file.fileno())
            os.replace(temporary_name, path)
        except BaseException:
            try:
                os.unlink(temporary_name)
            except FileNotFoundError:
                pass
            raise
