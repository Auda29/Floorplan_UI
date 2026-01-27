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
                if not isinstance(data, dict):
                    _LOGGER.warning("Invalid floorplan config in storage, resetting to default")
                    self._data = _default_config()
                else:
                    self._data = self._normalize_config(data)
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
        valid, error = self._validate_config_structure(config)
        if not valid:
            raise ValueError(error or "Invalid floorplan configuration")

        normalized = self._normalize_config(config)
        await self.async_save(normalized)

    @staticmethod
    def _validate_config_structure(config: dict[str, Any]) -> tuple[bool, str | None]:
        """Validate the high-level structure of the config.

        This is intentionally minimal — most issues are handled by normalization.
        """
        if not isinstance(config, dict):
            return False, "Config must be a dictionary"

        # version (if present) should be int-coercible
        version = config.get("version")
        if version is not None:
            try:
                int(version)
            except (TypeError, ValueError):
                return False, "Config.version must be an integer"

        # plans and views (if present) should be lists
        plans = config.get("plans")
        if plans is not None and not isinstance(plans, list):
            return False, "Config.plans must be a list"

        views = config.get("views")
        if views is not None and not isinstance(views, list):
            return False, "Config.views must be a list"

        return True, None

    @staticmethod
    def _normalize_config(config: dict[str, Any]) -> dict[str, Any]:
        """Normalize config, filling in reasonable defaults for missing fields."""
        normalized: dict[str, Any] = {}

        # version
        try:
            normalized["version"] = int(config.get("version", 1))
        except (TypeError, ValueError):
            _LOGGER.warning("Invalid version in config, defaulting to 1")
            normalized["version"] = 1

        # views
        views = config.get("views")
        if not isinstance(views, list):
            # fall back to default views
            normalized["views"] = _default_config()["views"]
        else:
            normalized["views"] = views

        # plans
        raw_plans = config.get("plans") or []
        if not isinstance(raw_plans, list):
            _LOGGER.warning("Config.plans is not a list, resetting to empty list")
            raw_plans = []

        plans: list[dict[str, Any]] = []
        seen_ids: set[str] = set()

        for idx, raw_plan in enumerate(raw_plans):
            if not isinstance(raw_plan, dict):
                _LOGGER.warning("Skipping non-dict plan at index %s", idx)
                continue

            plan: dict[str, Any] = {}

            # plan_id
            plan_id = raw_plan.get("plan_id")
            if not isinstance(plan_id, str) or not plan_id:
                plan_id = f"plan_{idx}"
                # ensure uniqueness in case of collisions
                counter = 1
                base_id = plan_id
                while plan_id in seen_ids:
                    plan_id = f"{base_id}_{counter}"
                    counter += 1
                _LOGGER.warning("Generated missing plan_id '%s' for plan index %s", plan_id, idx)
            plan["plan_id"] = plan_id
            seen_ids.add(plan_id)

            # name
            name = raw_plan.get("name")
            if not isinstance(name, str) or not name.strip():
                name = f"Plan {len(plans) + 1}"
            plan["name"] = name

            # background
            background = raw_plan.get("background")
            if not isinstance(background, dict):
                background = {}
            bg_type = background.get("type") or "image"
            url = background.get("url") if isinstance(background.get("url"), str) else ""
            width = background.get("width")
            height = background.get("height")
            try:
                width = int(width) if width is not None else 800
            except (TypeError, ValueError):
                width = 800
            try:
                height = int(height) if height is not None else 600
            except (TypeError, ValueError):
                height = 600
            plan["background"] = {
                "type": bg_type,
                "url": url,
                "width": width,
                "height": height,
            }

            # areas & markers
            areas = raw_plan.get("areas")
            if not isinstance(areas, list):
                areas = []
            markers = raw_plan.get("markers")
            if not isinstance(markers, list):
                markers = []
            plan["areas"] = areas
            plan["markers"] = markers

            # view (per-plan zoom configuration)
            view_cfg = raw_plan.get("view")
            if not isinstance(view_cfg, dict):
                view_cfg = {}
            min_zoom = view_cfg.get("minZoom")
            max_zoom = view_cfg.get("maxZoom")
            try:
                min_zoom = float(min_zoom) if min_zoom is not None else 0.1
            except (TypeError, ValueError):
                min_zoom = 0.1
            try:
                max_zoom = float(max_zoom) if max_zoom is not None else 5.0
            except (TypeError, ValueError):
                max_zoom = 5.0
            plan["view"] = {
                "minZoom": min_zoom,
                "maxZoom": max_zoom,
            }

            plans.append(plan)

        normalized["plans"] = plans
        return normalized
