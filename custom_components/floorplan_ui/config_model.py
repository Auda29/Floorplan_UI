"""Versioned Floorplan UI configuration model and validation."""

from __future__ import annotations

import copy
import json
import logging
import math
from typing import Any, TypeGuard

from .asset_store import AssetValidationError, decode_image_data_url_payload, is_asset_id
from .const import (
    CONFIG_VERSION,
    IMAGE_CONTENT_TYPES,
    MAX_CONFIG_SIZE_BYTES,
    MAX_POLYGON_COORDINATES,
    MODEL_CONTENT_TYPE,
)

_LOGGER = logging.getLogger(__name__)
_CAMERA_MODES = ("ortho", "perspective")
_CONFIG_KEYS = {"version", "revision", "default_view", "plans", "views"}
_PLAN_KEYS = {"plan_id", "name", "background", "areas", "markers", "view"}
_IMAGE_BACKGROUND_KEYS = {"type", "asset_id", "content_type", "url", "width", "height"}
_MODEL_BACKGROUND_KEYS = _IMAGE_BACKGROUND_KEYS | {"unit_scale"}
_V3_PLAN_VIEW_KEYS = {"minZoom", "maxZoom"}
_PLAN_VIEW_KEYS = _V3_PLAN_VIEW_KEYS | {"shadows", "lighting", "camera_mode", "camera_presets"}
_V3_VIEW_KEYS = {"id", "name", "filters", "area_overlay", "marker_overlay"}
_VIEW_KEYS = _V3_VIEW_KEYS | {"style", "camera_preset_id"}
_VIEW_FILTER_KEYS = {"domains", "tags", "area_ids"}
_AREA_STYLE_DEFAULTS = {
    "fillOpacity": 0.4,
    "strokeWidth": 2,
    "fill": "#2196f3",
    "stroke": "#1976d2",
}


def _strip_extra_keys(data: dict[str, Any], allowed: set[str]) -> None:
    for key in data.keys() - allowed:
        del data[key]


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
        if not isinstance(config, dict):
            raise ValueError("Config must be a dictionary")
        serialized_size = len(
            json.dumps(config, ensure_ascii=False, separators=(",", ":"), allow_nan=False).encode(
                "utf-8"
            )
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

        if config.keys() - _CONFIG_KEYS:
            return False, "Config contains unknown fields"
        version = config.get("version")
        if isinstance(version, bool) or not isinstance(version, int) or version < 1:
            return False, "Config.version must be an integer greater than or equal to 1"
        if version > CONFIG_VERSION:
            return False, "Config was created by a newer Floorplan UI version"

        revision = config.get("revision")
        if isinstance(revision, bool) or not isinstance(revision, int) or revision < 0:
            return False, "Config.revision must be a non-negative integer"

        plans = config.get("plans")
        if not isinstance(plans, list):
            return False, "Config.plans must be a list"
        if len(plans) > 20:
            return False, "Config supports at most 20 plans"

        views = config.get("views")
        if not isinstance(views, list):
            return False, "Config.views must be a list"
        if len(views) > 50:
            return False, "Config supports at most 50 views"

        default_view = config.get("default_view")
        if "default_view" in config and not isinstance(default_view, str):
            return False, "Config.default_view must be a string"

        view_ids = [view.get("id") for view in views if isinstance(view, dict)]
        if any(not isinstance(view_id, str) or not view_id for view_id in view_ids):
            return False, "Config view IDs must be non-empty strings"
        if len(view_ids) != len(set(view_ids)):
            return False, "Config view IDs must be unique"
        if default_view and views and default_view not in view_ids:
            return False, "Config.default_view must reference an existing view"

        plan_ids = [plan.get("plan_id") for plan in plans if isinstance(plan, dict)]
        if any(not isinstance(plan_id, str) or not plan_id for plan_id in plan_ids):
            return False, "Config plan IDs must be non-empty strings"
        if len(plan_ids) != len(set(plan_ids)):
            return False, "Config plan IDs must be unique"

        for plan_index, plan in enumerate(plans):
            if not isinstance(plan, dict) or plan.keys() - _PLAN_KEYS:
                return False, f"Plan {plan_index} must be an object"
            if not isinstance(plan.get("plan_id"), str) or not plan["plan_id"]:
                return False, f"Plan {plan_index} needs a plan_id"
            if not isinstance(plan.get("name"), str) or not plan["name"].strip():
                return False, f"Plan {plan_index} needs a name"

            background = plan.get("background")
            if not isinstance(background, dict):
                return False, f"Plan {plan_index}.background must be an object"
            background_type = background.get("type")
            if background_type not in ("image", "model"):
                return False, f"Plan {plan_index}.background.type is invalid"
            is_model = background_type == "model"
            background_keys = _MODEL_BACKGROUND_KEYS if is_model else _IMAGE_BACKGROUND_KEYS
            if background.keys() - background_keys:
                return False, f"Plan {plan_index}.background contains unknown fields"

            asset_id = background.get("asset_id")
            content_type = background.get("content_type")
            url = background.get("url", "")
            if not isinstance(url, str):
                return False, f"Plan {plan_index}.background.url must be a string"
            if is_model and url.lstrip().lower().startswith("data:"):
                return False, f"Plan {plan_index} must reference an uploaded model asset"
            if "asset_id" in background:
                if not is_asset_id(asset_id):
                    return False, f"Plan {plan_index} has an invalid asset ID"
                content_types = (MODEL_CONTENT_TYPE,) if is_model else IMAGE_CONTENT_TYPES
                if content_type not in content_types:
                    return False, f"Plan {plan_index} has an invalid asset content type"
            elif "content_type" in background:
                return False, f"Plan {plan_index} has content type metadata without an asset"
            elif url:
                if is_model:
                    return False, f"Plan {plan_index} must reference an uploaded model asset"
                if not allow_embedded_images:
                    return False, f"Plan {plan_index} must reference a local image asset"
                try:
                    decode_image_data_url_payload(url)
                except AssetValidationError as err:
                    return False, f"Plan {plan_index}: {err}"
            for dimension in ("width", "height"):
                if is_model and dimension not in background:
                    continue
                value = background.get(dimension)
                if not ConfigModel._is_finite_number(value) or not 0 < value <= 50_000:
                    return False, f"Plan {plan_index}.background.{dimension} is invalid"
            if "unit_scale" in background:
                unit_scale = background["unit_scale"]
                if not ConfigModel._is_finite_number(unit_scale) or not 0 < unit_scale <= 1000:
                    return False, f"Plan {plan_index}.background.unit_scale is invalid"

            areas = plan.get("areas")
            markers = plan.get("markers")
            if not isinstance(areas, list) or len(areas) > 500:
                return False, f"Plan {plan_index}.areas is invalid"
            if not isinstance(markers, list) or len(markers) > 1_000:
                return False, f"Plan {plan_index}.markers is invalid"

            area_ids = [area.get("id") for area in areas if isinstance(area, dict)]
            if any(not isinstance(area_id, str) or not area_id for area_id in area_ids):
                return False, f"Plan {plan_index} area IDs must be non-empty strings"
            if len(area_ids) != len(set(area_ids)):
                return False, f"Plan {plan_index} area IDs must be unique"
            marker_ids = [marker.get("id") for marker in markers if isinstance(marker, dict)]
            if any(not isinstance(marker_id, str) or not marker_id for marker_id in marker_ids):
                return False, f"Plan {plan_index} marker IDs must be non-empty strings"
            if len(marker_ids) != len(set(marker_ids)):
                return False, f"Plan {plan_index} marker IDs must be unique"

            shape_types = ("mesh", "anchor3d") if is_model else ("rect", "polygon")
            for area_index, area in enumerate(areas):
                if (
                    not isinstance(area, dict)
                    or not isinstance(area.get("id"), str)
                    or not area["id"]
                    or area.keys() - {"id", "area_id", "shape", "tags", "style"}
                ):
                    return False, f"Plan {plan_index} area {area_index} is invalid"
                shape = area.get("shape")
                if not isinstance(shape, dict) or shape.get("type") not in shape_types:
                    return False, (
                        f"Plan {plan_index} area {area_index} shape is invalid for "
                        f"a {background_type} background"
                    )
                if shape["type"] == "polygon":
                    if shape.keys() - {"type", "points", "x", "y"}:
                        return False, f"Plan {plan_index} area {area_index} shape is invalid"
                    points = shape.get("points")
                    if (
                        not isinstance(points, list)
                        or len(points) < 6
                        or len(points) > MAX_POLYGON_COORDINATES
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
                elif shape["type"] == "rect":
                    if shape.keys() - {"type", "x", "y", "width", "height"}:
                        return False, f"Plan {plan_index} area {area_index} shape is invalid"
                    for coordinate in ("x", "y", "width", "height"):
                        value = shape.get(coordinate)
                        if not ConfigModel._is_finite_number(value):
                            return False, (
                                f"Plan {plan_index} area {area_index} {coordinate} is invalid"
                            )
                    if shape["width"] <= 0 or shape["height"] <= 0:
                        return False, f"Plan {plan_index} area {area_index} size is invalid"
                elif shape["type"] == "mesh":
                    mesh_name = shape.get("mesh_name")
                    if (
                        shape.keys() - {"type", "mesh_name", "anchor"}
                        or not isinstance(mesh_name, str)
                        or not 1 <= len(mesh_name) <= 256
                        or ("anchor" in shape and not ConfigModel._valid_position(shape["anchor"]))
                    ):
                        return False, f"Plan {plan_index} area {area_index} mesh shape is invalid"
                elif not ConfigModel._valid_position(
                    {key: value for key, value in shape.items() if key != "type"}
                ):
                    return False, f"Plan {plan_index} area {area_index} anchor3d shape is invalid"

                area_id = area.get("area_id")
                if "area_id" not in area or (area_id is not None and not isinstance(area_id, str)):
                    return False, f"Plan {plan_index} area {area_index} area_id is invalid"
                tags = area.get("tags")
                if not isinstance(tags, list) or not all(isinstance(tag, str) for tag in tags):
                    return False, f"Plan {plan_index} area {area_index} tags are invalid"
                style = area.get("style")
                if (
                    not isinstance(style, dict)
                    or style.keys() - _AREA_STYLE_DEFAULTS.keys()
                    or not {"fillOpacity", "strokeWidth"} <= style.keys()
                ):
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
                if "icon" in marker and not isinstance(marker["icon"], str):
                    return False, f"Plan {plan_index} marker {marker_index} icon is invalid"
                if marker.get("area_id") is not None and not isinstance(marker["area_id"], str):
                    return False, f"Plan {plan_index} marker {marker_index} area_id is invalid"
                if "action" in marker:
                    action = marker["action"]
                    if not isinstance(action, dict) or (
                        "tap" in action and action["tap"] not in ("more-info", "toggle", "none")
                    ):
                        return False, f"Plan {plan_index} marker {marker_index} action is invalid"
                pos = marker.get("pos")
                if not ConfigModel._valid_position(pos, optional_z=True):
                    return False, f"Plan {plan_index} marker {marker_index} position is invalid"
                if marker.get("label_mode") not in ("off", "short", "full", "auto"):
                    return False, f"Plan {plan_index} marker {marker_index} label mode is invalid"
                tags = marker.get("tags")
                if not isinstance(tags, list) or not all(isinstance(tag, str) for tag in tags):
                    return False, f"Plan {plan_index} marker {marker_index} tags are invalid"
                binding = marker.get("bind")
                if (
                    not isinstance(binding, dict)
                    or binding.keys() - {"primary", "secondary"}
                    or not ConfigModel._valid_binding(binding.get("primary"))
                ):
                    return False, f"Plan {plan_index} marker {marker_index} binding is invalid"
                if "secondary" in binding and not ConfigModel._valid_binding(
                    binding.get("secondary")
                ):
                    return (
                        False,
                        f"Plan {plan_index} marker {marker_index} secondary binding is invalid",
                    )

            view_config = plan.get("view")
            if not isinstance(view_config, dict) or view_config.keys() - _PLAN_VIEW_KEYS:
                return False, f"Plan {plan_index}.view must be an object"
            min_zoom = view_config.get("minZoom")
            max_zoom = view_config.get("maxZoom")
            if (
                not ConfigModel._is_finite_number(min_zoom)
                or not ConfigModel._is_finite_number(max_zoom)
                or min_zoom <= 0
                or max_zoom < min_zoom
            ):
                return False, f"Plan {plan_index}.view zoom range is invalid"
            for flag in ("shadows", "lighting"):
                if flag in view_config and not isinstance(view_config[flag], bool):
                    return False, f"Plan {plan_index}.view.{flag} must be a boolean"
            if "camera_mode" in view_config and view_config["camera_mode"] not in _CAMERA_MODES:
                return False, f"Plan {plan_index}.view.camera_mode is invalid"
            if "camera_presets" in view_config:
                presets = view_config["camera_presets"]
                if (
                    not isinstance(presets, list)
                    or len(presets) > 20
                    or not all(ConfigModel._valid_camera_preset(preset) for preset in presets)
                ):
                    return False, f"Plan {plan_index}.view.camera_presets is invalid"

        for view_index, view in enumerate(views):
            if not isinstance(view, dict) or view.keys() - _VIEW_KEYS:
                return False, f"View {view_index} must be an object"
            if (
                not isinstance(view.get("id"), str)
                or not view["id"]
                or not isinstance(view.get("name"), str)
                or not view["name"].strip()
            ):
                return False, f"View {view_index} needs an id and name"
            filters = view.get("filters")
            if not isinstance(filters, dict) or filters.keys() - _VIEW_FILTER_KEYS:
                return False, f"View {view_index}.filters must be an object"
            for filter_name in ("domains", "tags", "area_ids"):
                values = filters.get(filter_name)
                if filter_name in filters and (
                    not isinstance(values, list)
                    or not all(isinstance(value, str) for value in values)
                ):
                    return False, f"View {view_index}.{filter_name} is invalid"

            if "style" in view and not ConfigModel._valid_view_style(view["style"]):
                return False, f"View {view_index}.style is invalid"
            if "camera_preset_id" in view and (
                not isinstance(view["camera_preset_id"], str) or not view["camera_preset_id"]
            ):
                return False, f"View {view_index}.camera_preset_id is invalid"

            for overlay_name in ("area_overlay", "marker_overlay"):
                overlay = view.get(overlay_name)
                if overlay_name not in view:
                    continue
                if not isinstance(overlay, dict) or overlay.keys() - {
                    "primary",
                    "secondary",
                    "badges",
                }:
                    return False, f"View {view_index}.{overlay_name} must be an object"
                for value_name in ("primary", "secondary"):
                    if value_name in overlay and not ConfigModel._valid_value_spec(
                        overlay.get(value_name)
                    ):
                        return False, f"View {view_index}.{overlay_name}.{value_name} is invalid"
                badges = overlay.get("badges")
                if "badges" in overlay and (
                    not isinstance(badges, list)
                    or len(badges) > 20
                    or not all(ConfigModel._valid_badge(badge) for badge in badges)
                ):
                    return False, f"View {view_index}.{overlay_name}.badges is invalid"

        return True, None

    @staticmethod
    def _valid_position(position: Any, *, optional_z: bool = False) -> bool:
        """Validate a vector with required x and y and a required or optional z."""
        return (
            isinstance(position, dict)
            and position.keys() <= {"x", "y", "z"}
            and all(ConfigModel._is_finite_number(position.get(axis)) for axis in ("x", "y"))
            and (
                (optional_z and "z" not in position)
                or ConfigModel._is_finite_number(position.get("z"))
            )
        )

    @staticmethod
    def _valid_camera_preset(preset: Any) -> bool:
        """Validate a named camera pose."""
        if not isinstance(preset, dict) or preset.keys() - {
            "id",
            "name",
            "mode",
            "position",
            "target",
            "zoom",
        }:
            return False
        zoom = preset.get("zoom")
        return (
            all(isinstance(preset.get(key), str) and preset[key] for key in ("id", "name"))
            and preset.get("mode") in _CAMERA_MODES
            and ConfigModel._valid_position(preset.get("position"))
            and ConfigModel._valid_position(preset.get("target"))
            and preset["position"] != preset["target"]
            and ("zoom" not in preset or (ConfigModel._is_finite_number(zoom) and zoom > 0))
        )

    @staticmethod
    def _valid_view_style(style: Any) -> bool:
        """Validate an optional set of area style overrides."""
        flags = {"dim_inactive_areas", "highlight_active_areas"}
        colors = {"active_area_fill", "active_area_stroke"}
        opacities = {"inactive_area_opacity", "active_area_opacity"}
        return (
            isinstance(style, dict)
            and style.keys() <= flags | colors | opacities
            and all(isinstance(style[key], bool) for key in flags & style.keys())
            and all(isinstance(style[key], str) for key in colors & style.keys())
            and all(
                ConfigModel._is_finite_number(value) and 0 <= value <= 1
                for value in (style[key] for key in opacities & style.keys())
            )
        )

    @staticmethod
    def _valid_binding(binding: Any, *, value_spec: bool = False) -> bool:
        """Validate a marker value binding."""
        return (
            isinstance(binding, dict)
            and binding.keys()
            <= (
                {"source", "attr", "format", "mode", "entity_id"}
                if value_spec
                else {"source", "attr", "format"}
            )
            and binding.get("source") in ("state", "attr")
            and ("attr" not in binding or isinstance(binding.get("attr"), str))
            and ("format" not in binding or isinstance(binding.get("format"), str))
            and (binding.get("source") != "attr" or bool(binding.get("attr")))
        )

    @staticmethod
    def _valid_value_spec(spec: Any) -> bool:
        """Validate a view overlay value specification."""
        if not isinstance(spec, dict):
            return False
        if spec.get("mode") == "aggregate":
            options = {"domain", "device_class", "attr", "format"}
            return (
                spec.keys() <= {"mode", "aggregation"} | options
                and spec.get("aggregation")
                in ("count_on", "count_open", "count", "avg", "min", "max", "sum")
                and all(isinstance(spec[key], str) for key in spec.keys() & options)
            )
        return (
            spec.get("mode") == "entity"
            and isinstance(spec.get("entity_id"), str)
            and bool(spec.get("entity_id"))
            and ConfigModel._valid_binding(spec, value_spec=True)
        )

    @staticmethod
    def _valid_badge(badge: Any) -> bool:
        """Validate a state badge specification."""
        return (
            isinstance(badge, dict)
            and badge.keys() <= {"entity_id", "when", "icon", "label"}
            and isinstance(badge.get("entity_id"), str)
            and bool(badge.get("entity_id"))
            and isinstance(badge.get("when"), dict)
            and badge["when"].keys() <= {"state_is"}
            and isinstance(badge["when"].get("state_is"), str)
            and bool(badge["when"].get("state_is"))
            and ("icon" not in badge or isinstance(badge.get("icon"), str))
            and ("label" not in badge or isinstance(badge.get("label"), str))
        )

    @staticmethod
    def _is_finite_number(value: object) -> TypeGuard[int | float]:
        """Return whether a value is a finite non-boolean number."""
        if isinstance(value, bool) or not isinstance(value, int | float):
            return False
        try:
            return math.isfinite(value)
        except OverflowError:
            return False

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
        if not 1 <= version < CONFIG_VERSION:
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

        if version == 3:
            ConfigModel._migrate_v3_defaults(migrated, migration_plans)
            version = 4

        migrated["version"] = version
        migrated.setdefault("revision", 0)
        return migrated

    @staticmethod
    def _migrate_v3_defaults(config: dict[str, Any], plans: list[Any]) -> None:
        """Materialize legacy defaults and discard fields outside the v4 contract."""
        _strip_extra_keys(config, _CONFIG_KEYS)
        for key in ("plans", "views"):
            if config.get(key) is None:
                config[key] = []
        if config.get("default_view") is None:
            config.pop("default_view", None)
        views = config["views"]
        if isinstance(views, list):
            for view in views:
                if isinstance(view, dict):
                    _strip_extra_keys(view, _V3_VIEW_KEYS)
                    filters = view.setdefault("filters", {})
                    if isinstance(filters, dict):
                        _strip_extra_keys(filters, _VIEW_FILTER_KEYS)
        for plan in plans:
            if not isinstance(plan, dict):
                continue
            _strip_extra_keys(plan, _PLAN_KEYS)
            background = plan.get("background")
            if isinstance(background, dict):
                background.setdefault("type", "image")
                _strip_extra_keys(background, _IMAGE_BACKGROUND_KEYS)
                for key in ("asset_id", "url"):
                    if background.get(key) is None:
                        background.pop(key, None)
                if "asset_id" not in background and background.get("content_type") is None:
                    background.pop("content_type", None)
            plan.setdefault("markers", [])
            view = plan.setdefault("view", {})
            if isinstance(view, dict):
                _strip_extra_keys(view, _V3_PLAN_VIEW_KEYS)
                view.setdefault("minZoom", 0.1)
                view.setdefault("maxZoom", 5)
            areas = plan.setdefault("areas", [])
            if not isinstance(areas, list):
                continue
            for area in areas:
                if not isinstance(area, dict):
                    continue
                for extra_key in list(area.keys() - {"id", "area_id", "shape", "tags", "style"}):
                    area.pop(extra_key, None)
                shape = area.get("shape")
                if isinstance(shape, dict):
                    if shape.get("type") == "rect":
                        for extra_key in list(shape.keys() - {"type", "x", "y", "width", "height"}):
                            shape.pop(extra_key, None)
                    elif shape.get("type") == "polygon":
                        for extra_key in list(shape.keys() - {"type", "x", "y", "points"}):
                            shape.pop(extra_key, None)
                area.setdefault("area_id", None)
                if area.get("tags") is None:
                    area["tags"] = []
                if area.get("style") is None:
                    area["style"] = {}
                style = area["style"]
                if isinstance(style, dict):
                    for extra_key in list(style.keys() - _AREA_STYLE_DEFAULTS.keys()):
                        style.pop(extra_key, None)
                    for key in ("fillOpacity", "strokeWidth"):
                        style.setdefault(key, _AREA_STYLE_DEFAULTS[key])

    @staticmethod
    def _normalize_config(config: dict[str, Any]) -> dict[str, Any]:
        """Normalize config, filling in reasonable defaults for missing fields."""
        views = config["views"] or default_config()["views"]
        default_view = config.get("default_view", "all")
        if default_view not in {view["id"] for view in views}:
            default_view = views[0]["id"]

        plans = []
        for raw_plan in config["plans"]:
            plan = dict(raw_plan)
            background = dict(plan["background"])
            url = background.get("url", "")
            # Signed URLs are generated on read. Preserve portable image data for import.
            if "asset_id" in background or not url.startswith("data:"):
                background.pop("url", None)
            plan["background"] = background
            plan["areas"] = [
                {
                    **area,
                    "area_id": area["area_id"] or "",
                    "style": {**_AREA_STYLE_DEFAULTS, **area["style"]},
                }
                for area in plan["areas"]
            ]
            plans.append(plan)

        return {
            "version": CONFIG_VERSION,
            "revision": config["revision"],
            "default_view": default_view,
            "plans": plans,
            "views": views,
        }
