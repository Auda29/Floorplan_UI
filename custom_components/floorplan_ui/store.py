"""Storage handling for Floorplan UI."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import STORAGE_KEY, STORAGE_VERSION

_LOGGER = logging.getLogger(__name__)


def _default_config() -> dict[str, Any]:
    """Return default configuration."""
    return {
        "version": 1,
        "plans": [],
        "views": [
            {"id": "all", "name": "All", "filters": {}},
            {"id": "heating", "name": "Heating", "filters": {"tags": ["heating"]}},
            {
                "id": "lights",
                "name": "Lights",
                "filters": {"domains": ["light", "switch"]},
            },
            {"id": "network", "name": "Network", "filters": {"tags": ["network"]}},
        ],
    }


class FloorplanStore:
    """Manage floorplan configuration storage."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the store."""
        self._hass = hass
        self._store: Store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self._data: dict[str, Any] | None = None

    async def async_load(self) -> dict[str, Any]:
        """Load the configuration from storage."""
        if self._data is None:
            data = await self._store.async_load()
            if data is None:
                self._data = _default_config()
            else:
                self._data = data
        return self._data

    async def async_save(self, data: dict[str, Any]) -> None:
        """Save the configuration to storage."""
        self._data = data
        await self._store.async_save(data)
        _LOGGER.debug("Floorplan UI config saved")

    async def async_get_config(self) -> dict[str, Any]:
        """Get the current configuration."""
        return await self.async_load()

    async def async_update_config(self, config: dict[str, Any]) -> None:
        """Update the configuration."""
        await self.async_save(config)
