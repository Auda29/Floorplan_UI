"""Content-addressed image storage for Floorplan UI."""

from __future__ import annotations

import asyncio
import base64
import binascii
from dataclasses import dataclass
import hashlib
import os
from pathlib import Path
import re
import tempfile
from typing import Final

from homeassistant.core import HomeAssistant

from .const import ASSET_STORAGE_DIRECTORY, MAX_IMAGE_FILE_BYTES

_ASSET_ID_PATTERN: Final = re.compile(r"^[0-9a-f]{64}$")
_DATA_URL_PATTERN: Final = re.compile(
    r"^data:(image/(?:png|jpeg));base64,([A-Za-z0-9+/]*={0,2})$"
)
_PNG_SIGNATURE: Final = b"\x89PNG\r\n\x1a\n"
_JPEG_SIGNATURE: Final = b"\xff\xd8\xff"

_CONTENT_TYPE_EXTENSION: Final = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
}


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
    """Validate an image using size and file signatures."""
    if not data:
        raise AssetValidationError("The image is empty")
    if len(data) > MAX_IMAGE_FILE_BYTES:
        raise AssetValidationError(
            f"The image exceeds the {MAX_IMAGE_FILE_BYTES // 1_000_000} MB limit"
        )
    if content_type == "image/png":
        if not data.startswith(_PNG_SIGNATURE):
            raise AssetValidationError("The file content is not a PNG image")
        return
    if content_type == "image/jpeg":
        if not data.startswith(_JPEG_SIGNATURE) or not data.endswith(b"\xff\xd9"):
            raise AssetValidationError("The file content is not a JPEG image")
        return
    raise AssetValidationError("Only PNG and JPEG images are supported")


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


def is_asset_id(value: object) -> bool:
    """Return whether a value is a safe content-addressed asset ID."""
    return isinstance(value, str) and _ASSET_ID_PATTERN.fullmatch(value) is not None


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
