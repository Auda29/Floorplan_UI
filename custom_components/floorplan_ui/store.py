"""Storage handling for Floorplan UI."""

from __future__ import annotations

import json
import logging
import math
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import (
    CONFIG_VERSION,
    MAX_CONFIG_SIZE_BYTES,
    STORAGE_KEY,
    STORAGE_VERSION,
)

_LOGGER = logging.getLogger(__name__)


def _default_config() -> dict[str, Any]:
    """Return default configuration."""
    return {
        "version": CONFIG_VERSION,
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
                    migrated = self._migrate_config(data)
                    valid, error = self._validate_config_structure(migrated)
                    if not valid:
                        _LOGGER.warning(
                            "Invalid floorplan config in storage (%s), resetting to default",
                            error,
                        )
                        self._data = _default_config()
                    else:
                        self._data = self._normalize_config(migrated)
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
        serialized_size = len(
            json.dumps(config, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
        )
        if serialized_size > MAX_CONFIG_SIZE_BYTES:
            raise ValueError(
                f"Config exceeds the {MAX_CONFIG_SIZE_BYTES // 1_000_000} MB limit"
            )

        valid, error = self._validate_config_structure(config)
        if not valid:
            raise ValueError(error or "Invalid floorplan configuration")

        normalized = self._normalize_config(config)
        await self.async_save(normalized)

    @staticmethod
    def _validate_config_structure(config: dict[str, Any]) -> tuple[bool, str | None]:
        """Validate persisted data before it reaches the frontend."""
        if not isinstance(config, dict):
            return False, "Config must be a dictionary"

        version = config.get("version")
        if version is not None:
            try:
                parsed_version = int(version)
            except (TypeError, ValueError):
                return False, "Config.version must be an integer"
            if parsed_version > CONFIG_VERSION:
                return False, "Config was created by a newer Floorplan UI version"

        plans = config.get("plans")
        if plans is not None and not isinstance(plans, list):
            return False, "Config.plans must be a list"
        if isinstance(plans, list) and len(plans) > 20:
            return False, "Config supports at most 20 plans"

        views = config.get("views")
        if views is not None and not isinstance(views, list):
            return False, "Config.views must be a list"
        if isinstance(views, list) and len(views) > 50:
            return False, "Config supports at most 50 views"

        for plan_index, plan in enumerate(plans or []):
            if not isinstance(plan, dict):
                return False, f"Plan {plan_index} must be an object"
            if not isinstance(plan.get("plan_id"), str) or not plan["plan_id"]:
                return False, f"Plan {plan_index} needs a plan_id"
            if not isinstance(plan.get("name"), str) or not plan["name"].strip():
                return False, f"Plan {plan_index} needs a name"

            background = plan.get("background")
            if not isinstance(background, dict):
                return False, f"Plan {plan_index}.background must be an object"
            url = background.get("url", "")
            if not isinstance(url, str):
                return False, f"Plan {plan_index}.background.url must be a string"
            if url.startswith("data:") and not url.startswith(
                ("data:image/png;base64,", "data:image/jpeg;base64,")
            ):
                return False, f"Plan {plan_index} has an unsupported embedded image"

            for dimension in ("width", "height"):
                value = background.get(dimension)
                if not FloorplanStore._is_finite_number(value) or not 0 < float(value) <= 50_000:
                    return False, f"Plan {plan_index}.background.{dimension} is invalid"

            areas = plan.get("areas", [])
            markers = plan.get("markers", [])
            if not isinstance(areas, list) or len(areas) > 500:
                return False, f"Plan {plan_index}.areas is invalid"
            if not isinstance(markers, list) or len(markers) > 1_000:
                return False, f"Plan {plan_index}.markers is invalid"

            for area_index, area in enumerate(areas):
                if not isinstance(area, dict) or not isinstance(area.get("id"), str):
                    return False, f"Plan {plan_index} area {area_index} is invalid"
                shape = area.get("shape")
                if not isinstance(shape, dict) or shape.get("type") not in {
                    "rect",
                    "polygon",
                }:
                    return False, f"Plan {plan_index} area {area_index} shape is invalid"
                if shape["type"] == "polygon":
                    points = shape.get("points")
                    if (
                        not isinstance(points, list)
                        or len(points) < 6
                        or len(points) % 2
                        or not all(FloorplanStore._is_finite_number(point) for point in points)
                    ):
                        return False, f"Plan {plan_index} area {area_index} points are invalid"

            for marker_index, marker in enumerate(markers):
                if not isinstance(marker, dict):
                    return False, f"Plan {plan_index} marker {marker_index} is invalid"
                if not isinstance(marker.get("id"), str) or not isinstance(
                    marker.get("entity_id"), str
                ):
                    return False, f"Plan {plan_index} marker {marker_index} needs IDs"
                pos = marker.get("pos")
                if not isinstance(pos, dict) or not all(
                    FloorplanStore._is_finite_number(pos.get(axis)) for axis in ("x", "y")
                ):
                    return False, f"Plan {plan_index} marker {marker_index} position is invalid"

        for view_index, view in enumerate(views or []):
            if not isinstance(view, dict):
                return False, f"View {view_index} must be an object"
            if not isinstance(view.get("id"), str) or not isinstance(view.get("name"), str):
                return False, f"View {view_index} needs an id and name"
            filters = view.get("filters", {})
            if not isinstance(filters, dict):
                return False, f"View {view_index}.filters must be an object"
            for filter_name in ("domains", "tags", "area_ids"):
                values = filters.get(filter_name)
                if values is not None and (
                    not isinstance(values, list)
                    or not all(isinstance(value, str) for value in values)
                ):
                    return False, f"View {view_index}.{filter_name} is invalid"

        return True, None

    @staticmethod
    def _is_finite_number(value: Any) -> bool:
        """Return whether a value is a finite non-boolean number."""
        return (
            not isinstance(value, bool)
            and isinstance(value, (int, float))
            and math.isfinite(float(value))
        )

    @staticmethod
    def _migrate_config(config: dict[str, Any]) -> dict[str, Any]:
        """Migrate older config schemas without mutating the stored object."""
        migrated = json.loads(json.dumps(config))
        try:
            version = int(migrated.get("version", 1))
        except (TypeError, ValueError):
            return migrated

        if version < 2:
            for plan in migrated.get("plans", []):
                if not isinstance(plan, dict):
                    continue
                for marker in plan.get("markers", []):
                    if isinstance(marker, dict):
                        marker.setdefault("area_id", None)
            version = 2

        migrated["version"] = version
        return migrated

    @staticmethod
    def _normalize_config(config: dict[str, Any]) -> dict[str, Any]:
        """Normalize config, filling in reasonable defaults for missing fields."""
        normalized: dict[str, Any] = {}

        normalized["version"] = CONFIG_VERSION

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
