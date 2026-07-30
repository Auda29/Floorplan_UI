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
        "default_view": "all",
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
            {
                "id": "entertainment",
                "name": "Entertainment",
                "filters": {"domains": ["media_player"]},
            },
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
        normalized = self.validate_and_normalize(config)
        await self.async_save(normalized)

    @classmethod
    def validate_and_normalize(cls, config: dict[str, Any]) -> dict[str, Any]:
        """Validate and normalize a configuration without persisting it."""
        serialized_size = len(
            json.dumps(config, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
        )
        if serialized_size > MAX_CONFIG_SIZE_BYTES:
            raise ValueError(
                f"Config exceeds the {MAX_CONFIG_SIZE_BYTES // 1_000_000} MB limit"
            )

        migrated = cls._migrate_config(config)
        valid, error = cls._validate_config_structure(migrated)
        if not valid:
            raise ValueError(error or "Invalid floorplan configuration")
        return cls._normalize_config(migrated)

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

        default_view = config.get("default_view")
        if default_view is not None and not isinstance(default_view, str):
            return False, "Config.default_view must be a string"

        view_ids = [view.get("id") for view in (views or []) if isinstance(view, dict)]
        if len(view_ids) != len(set(view_ids)):
            return False, "Config view IDs must be unique"
        if default_view and views and default_view not in view_ids:
            return False, "Config.default_view must reference an existing view"

        plan_ids = [plan.get("plan_id") for plan in (plans or []) if isinstance(plan, dict)]
        if len(plan_ids) != len(set(plan_ids)):
            return False, "Config plan IDs must be unique"

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

            area_ids = [area.get("id") for area in areas if isinstance(area, dict)]
            if len(area_ids) != len(set(area_ids)):
                return False, f"Plan {plan_index} area IDs must be unique"
            marker_ids = [marker.get("id") for marker in markers if isinstance(marker, dict)]
            if len(marker_ids) != len(set(marker_ids)):
                return False, f"Plan {plan_index} marker IDs must be unique"

            for area_index, area in enumerate(areas):
                if (
                    not isinstance(area, dict)
                    or not isinstance(area.get("id"), str)
                    or not area["id"]
                ):
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
                    for coordinate in ("x", "y"):
                        if coordinate in shape and not FloorplanStore._is_finite_number(
                            shape.get(coordinate)
                        ):
                            return False, (
                                f"Plan {plan_index} area {area_index} {coordinate} is invalid"
                            )
                else:
                    for coordinate in ("x", "y", "width", "height"):
                        value = shape.get(coordinate)
                        if not FloorplanStore._is_finite_number(value):
                            return False, (
                                f"Plan {plan_index} area {area_index} {coordinate} is invalid"
                            )
                    if float(shape["width"]) <= 0 or float(shape["height"]) <= 0:
                        return False, f"Plan {plan_index} area {area_index} size is invalid"

                area_id = area.get("area_id")
                if area_id is not None and not isinstance(area_id, str):
                    return False, f"Plan {plan_index} area {area_index} area_id is invalid"
                tags = area.get("tags")
                if tags is not None and (
                    not isinstance(tags, list)
                    or not all(isinstance(tag, str) for tag in tags)
                ):
                    return False, f"Plan {plan_index} area {area_index} tags are invalid"
                style = area.get("style")
                if style is not None:
                    if not isinstance(style, dict):
                        return False, f"Plan {plan_index} area {area_index} style is invalid"
                    for color in ("fill", "stroke"):
                        if color in style and not isinstance(style.get(color), str):
                            return False, (
                                f"Plan {plan_index} area {area_index} style.{color} is invalid"
                            )
                    for number in ("fillOpacity", "strokeWidth"):
                        if number in style and not FloorplanStore._is_finite_number(
                            style.get(number)
                        ):
                            return False, (
                                f"Plan {plan_index} area {area_index} style.{number} is invalid"
                            )
                    if "fillOpacity" in style and not 0 <= float(style["fillOpacity"]) <= 1:
                        return False, (
                            f"Plan {plan_index} area {area_index} style.fillOpacity is invalid"
                        )
                    if "strokeWidth" in style and not 0 <= float(style["strokeWidth"]) <= 50:
                        return False, (
                            f"Plan {plan_index} area {area_index} style.strokeWidth is invalid"
                        )

            for marker_index, marker in enumerate(markers):
                if not isinstance(marker, dict):
                    return False, f"Plan {plan_index} marker {marker_index} is invalid"
                if (
                    not isinstance(marker.get("id"), str)
                    or not marker["id"]
                    or not isinstance(marker.get("entity_id"), str)
                    or not marker["entity_id"]
                ):
                    return False, f"Plan {plan_index} marker {marker_index} needs IDs"
                pos = marker.get("pos")
                if not isinstance(pos, dict) or not all(
                    FloorplanStore._is_finite_number(pos.get(axis)) for axis in ("x", "y")
                ):
                    return False, f"Plan {plan_index} marker {marker_index} position is invalid"
                if marker.get("label_mode") not in {"off", "short", "full", "auto"}:
                    return False, f"Plan {plan_index} marker {marker_index} label mode is invalid"
                tags = marker.get("tags")
                if not isinstance(tags, list) or not all(isinstance(tag, str) for tag in tags):
                    return False, f"Plan {plan_index} marker {marker_index} tags are invalid"
                binding = marker.get("bind")
                if not isinstance(binding, dict) or not FloorplanStore._valid_binding(
                    binding.get("primary")
                ):
                    return False, f"Plan {plan_index} marker {marker_index} binding is invalid"
                if "secondary" in binding and not FloorplanStore._valid_binding(
                    binding.get("secondary")
                ):
                    return False, f"Plan {plan_index} marker {marker_index} secondary binding is invalid"

            view_config = plan.get("view", {})
            if not isinstance(view_config, dict):
                return False, f"Plan {plan_index}.view must be an object"
            min_zoom = view_config.get("minZoom", 0.1)
            max_zoom = view_config.get("maxZoom", 5)
            if (
                not FloorplanStore._is_finite_number(min_zoom)
                or not FloorplanStore._is_finite_number(max_zoom)
                or float(min_zoom) <= 0
                or float(max_zoom) < float(min_zoom)
            ):
                return False, f"Plan {plan_index}.view zoom range is invalid"

        for view_index, view in enumerate(views or []):
            if not isinstance(view, dict):
                return False, f"View {view_index} must be an object"
            if (
                not isinstance(view.get("id"), str)
                or not view["id"]
                or not isinstance(view.get("name"), str)
                or not view["name"].strip()
            ):
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

            for overlay_name in ("area_overlay", "marker_overlay"):
                overlay = view.get(overlay_name)
                if overlay is None:
                    continue
                if not isinstance(overlay, dict):
                    return False, f"View {view_index}.{overlay_name} must be an object"
                for value_name in ("primary", "secondary"):
                    if value_name in overlay and not FloorplanStore._valid_value_spec(
                        overlay.get(value_name)
                    ):
                        return False, f"View {view_index}.{overlay_name}.{value_name} is invalid"
                badges = overlay.get("badges")
                if badges is not None and (
                    not isinstance(badges, list)
                    or len(badges) > 20
                    or not all(FloorplanStore._valid_badge(badge) for badge in badges)
                ):
                    return False, f"View {view_index}.{overlay_name}.badges is invalid"

        return True, None

    @staticmethod
    def _valid_binding(binding: Any) -> bool:
        """Validate a marker value binding."""
        return (
            isinstance(binding, dict)
            and binding.get("source") in {"state", "attr"}
            and ("attr" not in binding or isinstance(binding.get("attr"), str))
            and ("format" not in binding or isinstance(binding.get("format"), str))
            and (
                binding.get("source") != "attr"
                or bool(binding.get("attr"))
            )
        )

    @staticmethod
    def _valid_value_spec(spec: Any) -> bool:
        """Validate a view overlay value specification."""
        return (
            isinstance(spec, dict)
            and spec.get("mode") == "entity"
            and isinstance(spec.get("entity_id"), str)
            and bool(spec.get("entity_id"))
            and FloorplanStore._valid_binding(spec)
        )

    @staticmethod
    def _valid_badge(badge: Any) -> bool:
        """Validate a state badge specification."""
        return (
            isinstance(badge, dict)
            and isinstance(badge.get("entity_id"), str)
            and bool(badge.get("entity_id"))
            and isinstance(badge.get("when"), dict)
            and isinstance(badge["when"].get("state_is"), str)
            and bool(badge["when"].get("state_is"))
            and ("icon" not in badge or isinstance(badge.get("icon"), str))
            and ("label" not in badge or isinstance(badge.get("label"), str))
        )

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
                        marker.setdefault("icon", "mdi:circle")
                        marker.setdefault("label_mode", "auto")
                        marker.setdefault("tags", [])
                        marker.setdefault("bind", {"primary": {"source": "state"}})
            version = 2

        migrated["version"] = version
        return migrated

    @staticmethod
    def _normalize_config(config: dict[str, Any]) -> dict[str, Any]:
        """Normalize config, filling in reasonable defaults for missing fields."""
        normalized: dict[str, Any] = {}

        normalized["version"] = CONFIG_VERSION

        default_view = config.get("default_view")
        normalized["default_view"] = default_view if isinstance(default_view, str) else "all"

        # views
        views = config.get("views")
        if not isinstance(views, list) or not views:
            # fall back to default views
            normalized["views"] = _default_config()["views"]
        else:
            normalized["views"] = views

        available_view_ids = {view["id"] for view in normalized["views"]}
        if normalized["default_view"] not in available_view_ids:
            normalized["default_view"] = normalized["views"][0]["id"]

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
            normalized_areas: list[dict[str, Any]] = []
            for area in areas:
                normalized_area = dict(area)
                normalized_area.setdefault("area_id", "")
                normalized_area.setdefault("tags", [])
                style = normalized_area.get("style")
                if not isinstance(style, dict):
                    style = {}
                normalized_area["style"] = {
                    "fillOpacity": style.get("fillOpacity", 0.4),
                    "strokeWidth": style.get("strokeWidth", 2),
                    "fill": style.get("fill", "#2196f3"),
                    "stroke": style.get("stroke", "#1976d2"),
                }
                normalized_areas.append(normalized_area)
            plan["areas"] = normalized_areas
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
