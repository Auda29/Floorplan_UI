"""Versioned Floorplan UI configuration model and validation."""

from __future__ import annotations

import copy
import json
import logging
import math
from typing import Any, TypeGuard

from .asset_store import AssetValidationError, decode_image_data_url, is_asset_id
from .const import CONFIG_VERSION, MAX_CONFIG_SIZE_BYTES

_LOGGER = logging.getLogger(__name__)


def default_config() -> dict[str, Any]:
    """Return default configuration."""
    return {
        "version": CONFIG_VERSION,
        "revision": 0,
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


class ConfigModel:
    """Validate, migrate, and normalize versioned floorplan configuration."""

    @classmethod
    def validate_and_normalize(
        cls,
        config: dict[str, Any],
        *,
        allow_embedded_images: bool = False,
    ) -> dict[str, Any]:
        """Validate and normalize a configuration without persisting it."""
        serialized_size = len(
            json.dumps(config, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
        )
        if serialized_size > MAX_CONFIG_SIZE_BYTES:
            raise ValueError(f"Config exceeds the {MAX_CONFIG_SIZE_BYTES // 1_000_000} MB limit")

        migrated = cls._migrate_config(config)
        valid, error = cls._validate_config_structure(
            migrated,
            allow_embedded_images=allow_embedded_images,
        )
        if not valid:
            raise ValueError(error or "Invalid floorplan configuration")
        return cls._normalize_config(migrated)

    @staticmethod
    def _validate_config_structure(
        config: dict[str, Any],
        *,
        allow_embedded_images: bool = False,
    ) -> tuple[bool, str | None]:
        """Validate persisted data before it reaches the frontend."""
        if not isinstance(config, dict):
            return False, "Config must be a dictionary"

        version = config.get("version")
        if version is not None:
            if isinstance(version, bool) or not isinstance(version, int):
                return False, "Config.version must be an integer"
            if version > CONFIG_VERSION:
                return False, "Config was created by a newer Floorplan UI version"

        revision = config.get("revision", 0)
        if isinstance(revision, bool) or not isinstance(revision, int) or revision < 0:
            return False, "Config.revision must be a non-negative integer"

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
            if background.get("type", "image") != "image":
                return False, f"Plan {plan_index}.background.type is invalid"

            asset_id = background.get("asset_id")
            content_type = background.get("content_type")
            url = background.get("url", "")
            if asset_id is not None:
                if not is_asset_id(asset_id):
                    return False, f"Plan {plan_index} has an invalid image asset ID"
                if content_type not in {"image/png", "image/jpeg"}:
                    return False, f"Plan {plan_index} has an invalid image content type"
                if url is not None and not isinstance(url, str):
                    return False, f"Plan {plan_index}.background.url must be a string"
            elif url:
                if not isinstance(url, str):
                    return False, f"Plan {plan_index}.background.url must be a string"
                if not allow_embedded_images:
                    return False, f"Plan {plan_index} must reference a local image asset"
                try:
                    decode_image_data_url(url)
                except AssetValidationError as err:
                    return False, f"Plan {plan_index}: {err}"
            elif content_type is not None:
                return False, f"Plan {plan_index} has image metadata without an asset"

            for dimension in ("width", "height"):
                value = background.get(dimension)
                if not ConfigModel._is_finite_number(value) or not 0 < float(value) <= 50_000:
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
                        or not all(ConfigModel._is_finite_number(point) for point in points)
                    ):
                        return False, f"Plan {plan_index} area {area_index} points are invalid"
                    for coordinate in ("x", "y"):
                        if coordinate in shape and not ConfigModel._is_finite_number(
                            shape.get(coordinate)
                        ):
                            return False, (
                                f"Plan {plan_index} area {area_index} {coordinate} is invalid"
                            )
                else:
                    for coordinate in ("x", "y", "width", "height"):
                        value = shape.get(coordinate)
                        if not ConfigModel._is_finite_number(value):
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
                    not isinstance(tags, list) or not all(isinstance(tag, str) for tag in tags)
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
                        if number in style and not ConfigModel._is_finite_number(style.get(number)):
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
                    ConfigModel._is_finite_number(pos.get(axis)) for axis in ("x", "y")
                ):
                    return False, f"Plan {plan_index} marker {marker_index} position is invalid"
                if marker.get("label_mode") not in {"off", "short", "full", "auto"}:
                    return False, f"Plan {plan_index} marker {marker_index} label mode is invalid"
                tags = marker.get("tags")
                if not isinstance(tags, list) or not all(isinstance(tag, str) for tag in tags):
                    return False, f"Plan {plan_index} marker {marker_index} tags are invalid"
                binding = marker.get("bind")
                if not isinstance(binding, dict) or not ConfigModel._valid_binding(
                    binding.get("primary")
                ):
                    return False, f"Plan {plan_index} marker {marker_index} binding is invalid"
                if "secondary" in binding and not ConfigModel._valid_binding(
                    binding.get("secondary")
                ):
                    return (
                        False,
                        f"Plan {plan_index} marker {marker_index} secondary binding is invalid",
                    )

            view_config = plan.get("view", {})
            if not isinstance(view_config, dict):
                return False, f"Plan {plan_index}.view must be an object"
            min_zoom = view_config.get("minZoom", 0.1)
            max_zoom = view_config.get("maxZoom", 5)
            if (
                not ConfigModel._is_finite_number(min_zoom)
                or not ConfigModel._is_finite_number(max_zoom)
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
                    if value_name in overlay and not ConfigModel._valid_value_spec(
                        overlay.get(value_name)
                    ):
                        return False, f"View {view_index}.{overlay_name}.{value_name} is invalid"
                badges = overlay.get("badges")
                if badges is not None and (
                    not isinstance(badges, list)
                    or len(badges) > 20
                    or not all(ConfigModel._valid_badge(badge) for badge in badges)
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
            and (binding.get("source") != "attr" or bool(binding.get("attr")))
        )

    @staticmethod
    def _valid_value_spec(spec: Any) -> bool:
        """Validate a view overlay value specification."""
        return (
            isinstance(spec, dict)
            and spec.get("mode") == "entity"
            and isinstance(spec.get("entity_id"), str)
            and bool(spec.get("entity_id"))
            and ConfigModel._valid_binding(spec)
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
    def _is_finite_number(value: object) -> TypeGuard[int | float]:
        """Return whether a value is a finite non-boolean number."""
        return (
            not isinstance(value, bool)
            and isinstance(value, int | float)
            and math.isfinite(float(value))
        )

    @staticmethod
    def _migrate_config(config: dict[str, Any]) -> dict[str, Any]:
        """Migrate older config schemas without mutating the stored object."""
        migrated = copy.deepcopy(config)
        raw_version = migrated.get("version", 1)
        if isinstance(raw_version, bool) or not isinstance(raw_version, int | str):
            return migrated
        try:
            version = int(raw_version)
        except (TypeError, ValueError):
            return migrated

        plans = migrated.get("plans", [])
        migration_plans = plans if isinstance(plans, list) else []

        if version < 2:
            for plan in migration_plans:
                if not isinstance(plan, dict):
                    continue
                markers = plan.get("markers", [])
                if not isinstance(markers, list):
                    continue
                for marker in markers:
                    if isinstance(marker, dict):
                        marker.setdefault("area_id", None)
                        marker.setdefault("icon", "mdi:circle")
                        marker.setdefault("label_mode", "auto")
                        marker.setdefault("tags", [])
                        marker.setdefault("bind", {"primary": {"source": "state"}})
            version = 2

        if version < 3:
            for plan in migration_plans:
                if not isinstance(plan, dict):
                    continue
                background = plan.get("background")
                if not isinstance(background, dict):
                    continue
                legacy_url = background.get("url")
                if (
                    isinstance(legacy_url, str)
                    and legacy_url
                    and not legacy_url.startswith("data:")
                ):
                    _LOGGER.warning(
                        "Removed non-local background URL while migrating plan %s",
                        plan.get("plan_id", "<unknown>"),
                    )
                    background["url"] = ""
            version = 3

        migrated["version"] = version
        migrated.setdefault("revision", 0)
        return migrated

    @staticmethod
    def _normalize_config(config: dict[str, Any]) -> dict[str, Any]:
        """Normalize config, filling in reasonable defaults for missing fields."""
        normalized: dict[str, Any] = {}

        normalized["version"] = CONFIG_VERSION
        revision = config.get("revision", 0)
        normalized["revision"] = (
            revision
            if isinstance(revision, int) and not isinstance(revision, bool) and revision >= 0
            else 0
        )

        default_view = config.get("default_view")
        normalized["default_view"] = default_view if isinstance(default_view, str) else "all"

        # views
        views = config.get("views")
        if not isinstance(views, list) or not views:
            # fall back to default views
            normalized["views"] = default_config()["views"]
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
            asset_id = background.get("asset_id")
            content_type = background.get("content_type")
            raw_url = background.get("url")
            url: str = raw_url if isinstance(raw_url, str) else ""
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
            normalized_background: dict[str, Any] = {
                "type": bg_type,
                "width": width,
                "height": height,
            }
            if is_asset_id(asset_id) and content_type in {"image/png", "image/jpeg"}:
                normalized_background["asset_id"] = asset_id
                normalized_background["content_type"] = content_type
            elif url.startswith("data:"):
                normalized_background["url"] = url
            plan["background"] = normalized_background

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
