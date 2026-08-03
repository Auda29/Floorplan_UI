"""Content-addressed image storage for Floorplan UI."""

from __future__ import annotations

import asyncio
import base64
import binascii
import hashlib
import logging
import os
import re
import tempfile
import time
import warnings
from dataclasses import dataclass
from io import BytesIO
from pathlib import Path
from typing import Any, Final, TypeGuard

from homeassistant.core import HomeAssistant
from PIL import Image, UnidentifiedImageError

from .const import (
    ASSET_GC_GRACE_SECONDS,
    ASSET_STORAGE_DIRECTORY,
    MAX_IMAGE_FILE_BYTES,
    MAX_IMAGE_HEIGHT,
    MAX_IMAGE_PIXELS,
    MAX_IMAGE_WIDTH,
)

_ASSET_ID_PATTERN: Final = re.compile(r"^[0-9a-f]{64}$")
_ASSET_FILE_PATTERN: Final = re.compile(r"^([0-9a-f]{64})\.(?:png|jpg)$")
_DATA_URL_PATTERN: Final = re.compile(r"^data:(image/(?:png|jpeg));base64,([A-Za-z0-9+/]*={0,2})$")
_PNG_SIGNATURE: Final = b"\x89PNG\r\n\x1a\n"
_JPEG_SIGNATURE: Final = b"\xff\xd8\xff"

_CONTENT_TYPE_EXTENSION: Final = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
}
_CONTENT_TYPE_FORMAT: Final = {
    "image/png": "PNG",
    "image/jpeg": "JPEG",
}

_LOGGER = logging.getLogger(__name__)


class AssetValidationError(ValueError):
    """Raised when image data is unsafe or unsupported."""


@dataclass(frozen=True, slots=True)
class AssetReference:
    """Reference to one persisted image asset."""

    asset_id: str
    content_type: str

    def as_dict(self) -> dict[str, str]:
        """Return the persisted JSON representation."""
        return {
            "asset_id": self.asset_id,
            "content_type": self.content_type,
        }


def validate_image_bytes(data: bytes, content_type: str) -> None:
    """Fully decode an image and enforce format, size, and dimension limits."""
    if not data:
        raise AssetValidationError("The image is empty")
    if len(data) > MAX_IMAGE_FILE_BYTES:
        raise AssetValidationError(
            f"The image exceeds the {MAX_IMAGE_FILE_BYTES // 1_000_000} MB limit"
        )
    expected_format = _CONTENT_TYPE_FORMAT.get(content_type)
    if expected_format is None:
        raise AssetValidationError("Only PNG and JPEG images are supported")

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
    """Decode and validate a PNG/JPEG data URL."""
    match = _DATA_URL_PATTERN.fullmatch(data_url)
    if match is None:
        raise AssetValidationError("The embedded image is not a valid PNG/JPEG data URL")

    content_type, encoded = match.groups()
    maximum_encoded_length = ((MAX_IMAGE_FILE_BYTES + 2) // 3) * 4
    if len(encoded) > maximum_encoded_length:
        raise AssetValidationError(
            f"The image exceeds the {MAX_IMAGE_FILE_BYTES // 1_000_000} MB limit"
        )
    try:
        data = base64.b64decode(encoded, validate=True)
    except (binascii.Error, ValueError) as err:
        raise AssetValidationError("The embedded image contains invalid base64 data") from err
    validate_image_bytes(data, content_type)
    return data, content_type


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
    """Persist validated floorplan images outside the JSON configuration."""

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
        """Validate and atomically persist an image."""
        validate_image_bytes(data, content_type)
        asset_id = hashlib.sha256(data).hexdigest()
        reference = AssetReference(asset_id, content_type)
        path = self.path_for(reference.asset_id, reference.content_type)

        async with self._write_lock:
            if not await self._hass.async_add_executor_job(path.is_file):
                await self._hass.async_add_executor_job(self._atomic_write, path, data)
        return reference

    async def async_store_data_url(self, data_url: str) -> AssetReference:
        """Decode and persist a legacy embedded image."""
        data, content_type = decode_image_data_url(data_url)
        return await self.async_store(data, content_type)

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
        return await self._hass.async_add_executor_job(
            self._collect_garbage,
            safe_references,
            max(0, grace_seconds),
            dry_run,
        )

    def _collect_garbage(
        self,
        referenced_asset_ids: set[str],
        grace_seconds: int,
        dry_run: bool,
    ) -> list[str]:
        """Collect garbage synchronously on Home Assistant's executor."""
        if not self._directory.is_dir():
            return []
        cutoff = time.time() - grace_seconds
        removed: list[str] = []
        for path in sorted(self._directory.iterdir()):
            match = _ASSET_FILE_PATTERN.fullmatch(path.name)
            if match is None or path.is_symlink():
                continue
            asset_id = match.group(1)
            if asset_id in referenced_asset_ids:
                continue
            try:
                if not path.is_file() or path.stat().st_mtime > cutoff:
                    continue
                if not dry_run:
                    path.unlink(missing_ok=True)
                removed.append(asset_id)
            except OSError as err:
                _LOGGER.warning("Could not remove orphaned floorplan asset %s: %s", path.name, err)
        return removed

    def path_for(self, asset_id: str, content_type: str) -> Path:
        """Resolve a validated asset reference."""
        if not is_asset_id(asset_id):
            raise AssetValidationError("Invalid image asset ID")
        try:
            extension = _CONTENT_TYPE_EXTENSION[content_type]
        except KeyError as err:
            raise AssetValidationError("Invalid image content type") from err
        return self._directory / f"{asset_id}{extension}"

    @staticmethod
    def _atomic_write(path: Path, data: bytes) -> None:
        """Write one image atomically on the executor."""
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
