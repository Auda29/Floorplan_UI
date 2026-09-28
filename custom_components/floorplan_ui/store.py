"""Storage handling for Floorplan UI."""

from __future__ import annotations

import asyncio
import copy
import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .asset_store import AssetValidationError, FloorplanAssetStore, collect_referenced_asset_ids
from .config_model import ConfigModel, default_config
from .const import STORAGE_KEY, STORAGE_VERSION

_LOGGER = logging.getLogger(__name__)


class ConfigConflictError(ValueError):
    """Raised when a client attempts to overwrite a newer configuration."""

    def __init__(self, current_revision: int) -> None:
        """Initialize the conflict."""
        self.current_revision = current_revision
        super().__init__(
            f"Configuration changed in another session (current revision: {current_revision})"
        )


class FloorplanStore(ConfigModel):
    """Manage floorplan configuration storage."""

    def __init__(self, hass: HomeAssistant, asset_store: FloorplanAssetStore) -> None:
        """Initialize the store."""
        self._hass = hass
        self._asset_store = asset_store
        self._store: Store = Store(
            hass,
            STORAGE_VERSION,
            STORAGE_KEY,
            atomic_writes=True,
        )
        self._data: dict[str, Any] | None = None
        self._load_lock = asyncio.Lock()
        self._update_lock = asyncio.Lock()

    async def async_load(self) -> dict[str, Any]:
        """Load the configuration from storage."""
        if self._data is not None:
            return self._data

        async with self._load_lock:
            if self._data is not None:
                return self._data
            data = await self._store.async_load()
            if data is None:
                self._data = default_config()
            else:
                if not isinstance(data, dict):
                    _LOGGER.warning("Invalid floorplan config in storage, resetting to default")
                    self._data = default_config()
                else:
                    migrated = self._migrate_config(data)
                    # Validate plan metadata first. Broken legacy image payloads
                    # are recovered individually, rather than dropping every plan.
                    metadata = copy.deepcopy(migrated)
                    plans = metadata.get("plans", [])
                    for plan in plans if isinstance(plans, list) else []:
                        background = plan.get("background") if isinstance(plan, dict) else None
                        if not isinstance(background, dict):
                            continue
                        url = background.get("url")
                        if isinstance(url, str) and url.startswith("data:"):
                            background.pop("url")
                            if not background.get("asset_id"):
                                background.pop("content_type", None)
                    valid, error = self._validate_config_structure(
                        metadata,
                        allow_embedded_images=True,
                    )
                    if not valid:
                        _LOGGER.warning(
                            "Invalid floorplan config in storage (%s), resetting to default",
                            error,
                        )
                        self._data = default_config()
                    else:
                        invalid_images: list[str] = []
                        materialized = await self._async_materialize_embedded_images(
                            migrated, invalid_images=invalid_images
                        )
                        if invalid_images:
                            recovery_store: Store = Store(
                                self._hass,
                                STORAGE_VERSION,
                                f"{STORAGE_KEY}.recovery",
                                atomic_writes=True,
                            )
                            # Preserve the original before writing the recovered configuration.
                            await recovery_store.async_save(data)
                            _LOGGER.warning(
                                "Recovered plans with invalid backgrounds (%s); original config "
                                "saved to %s.recovery",
                                ", ".join(invalid_images),
                                STORAGE_KEY,
                            )
                        self._data = self._normalize_config(materialized)
                        if self._data != data:
                            await self._store.async_save(self._data)
        return self._data

    async def async_save(self, data: dict[str, Any]) -> None:
        """Save the configuration to storage."""
        persisted = copy.deepcopy(data)
        await self._store.async_save(persisted)
        self._data = persisted
        _LOGGER.debug("Floorplan UI config saved")

    async def async_get_config(self) -> dict[str, Any]:
        """Get the current configuration."""
        return copy.deepcopy(await self.async_load())

    async def async_update_config(
        self,
        config: dict[str, Any],
        base_revision: int,
    ) -> dict[str, Any]:
        """Atomically update the configuration if its revision is current."""
        async with self._update_lock:
            current = await self.async_load()
            current_revision = int(current.get("revision", 0))
            if base_revision != current_revision:
                raise ConfigConflictError(current_revision)

            normalized = self.validate_and_normalize(config)
            await self._async_validate_asset_references(normalized)
            normalized["revision"] = current_revision + 1
            await self.async_save(normalized)
            try:
                await self._asset_store.async_collect_garbage(
                    collect_referenced_asset_ids(normalized)
                )
            except Exception as err:  # Garbage collection must never roll back a valid save.
                _LOGGER.warning("Floorplan asset garbage collection failed: %s", err)
            return copy.deepcopy(normalized)

    async def async_validate_config(
        self,
        config: dict[str, Any],
        *,
        allow_embedded_images: bool = False,
    ) -> dict[str, Any]:
        """Validate a config and confirm that all asset references exist."""
        normalized = self.validate_and_normalize(
            config,
            allow_embedded_images=allow_embedded_images,
        )
        await self._async_validate_asset_references(
            normalized,
            allow_embedded_images=allow_embedded_images,
        )
        return normalized

    async def _async_materialize_embedded_images(
        self,
        config: dict[str, Any],
        *,
        invalid_images: list[str] | None = None,
    ) -> dict[str, Any]:
        """Move legacy data URLs into content-addressed files."""
        materialized = copy.deepcopy(config)
        for plan in materialized.get("plans", []):
            if not isinstance(plan, dict):
                continue
            background = plan.get("background")
            if not isinstance(background, dict):
                continue
            url = background.get("url")
            if not isinstance(url, str) or not url.startswith("data:"):
                continue
            try:
                reference = await self._asset_store.async_store_data_url(url)
            except AssetValidationError:
                if invalid_images is None:
                    raise
                invalid_images.append(plan["plan_id"])
                background.pop("url", None)
                if not background.get("asset_id"):
                    background.pop("content_type", None)
                continue
            background.pop("url", None)
            background.update(reference.as_dict())
        return materialized

    async def _async_validate_asset_references(
        self,
        config: dict[str, Any],
        *,
        allow_embedded_images: bool = False,
    ) -> None:
        """Ensure every persisted image reference resolves to a local file."""
        for plan_index, plan in enumerate(config.get("plans", [])):
            background = plan.get("background", {})
            if allow_embedded_images and background.get("url"):
                await self._asset_store.async_validate_data_url(background["url"])
                continue
            asset_id = background.get("asset_id")
            content_type = background.get("content_type")
            if asset_id is None:
                continue
            if not await self._asset_store.async_exists(asset_id, content_type):
                raise ValueError(f"Plan {plan_index} references a missing image asset")
