"""Unit tests for Floorplan UI configuration storage."""

from __future__ import annotations

import importlib
import sys
import types
import unittest
from pathlib import Path


def _load_store_module():
    """Load the store module with minimal Home Assistant type stubs."""
    root = Path(__file__).resolve().parents[1]
    integration_path = root / "custom_components" / "floorplan_ui"

    homeassistant = types.ModuleType("homeassistant")
    core = types.ModuleType("homeassistant.core")
    helpers = types.ModuleType("homeassistant.helpers")
    storage = types.ModuleType("homeassistant.helpers.storage")

    core.HomeAssistant = object

    class Store:
        """Type-only replacement used while importing the module."""

    storage.Store = Store
    sys.modules.update(
        {
            "homeassistant": homeassistant,
            "homeassistant.core": core,
            "homeassistant.helpers": helpers,
            "homeassistant.helpers.storage": storage,
        }
    )

    package_name = "floorplan_ui_test"
    package = types.ModuleType(package_name)
    package.__path__ = [str(integration_path)]
    sys.modules[package_name] = package
    return importlib.import_module(f"{package_name}.store")


STORE_MODULE = _load_store_module()
FloorplanStore = STORE_MODULE.FloorplanStore


def valid_config() -> dict:
    """Return a minimal valid v2 configuration."""
    return {
        "version": 2,
        "plans": [
            {
                "plan_id": "ground-floor",
                "name": "Ground floor",
                "background": {
                    "type": "image",
                    "url": "data:image/png;base64,AA==",
                    "width": 1200,
                    "height": 800,
                },
                "areas": [],
                "markers": [
                    {
                        "id": "marker-1",
                        "entity_id": "light.kitchen",
                        "area_id": "kitchen",
                        "pos": {"x": 10, "y": 20},
                        "icon": "mdi:lightbulb",
                        "label_mode": "auto",
                        "tags": ["lights"],
                        "bind": {"primary": {"source": "state"}},
                    }
                ],
                "view": {"minZoom": 0.1, "maxZoom": 5},
            }
        ],
        "views": [{"id": "all", "name": "All", "filters": {}}],
    }


class FloorplanStoreTests(unittest.TestCase):
    """Exercise schema validation, normalization, and migration."""

    def test_valid_config_is_accepted(self) -> None:
        self.assertEqual((True, None), FloorplanStore._validate_config_structure(valid_config()))

    def test_v1_migration_adds_marker_area_and_does_not_mutate_input(self) -> None:
        original = valid_config()
        original["version"] = 1
        original_marker = original["plans"][0]["markers"][0]
        for field in ("area_id", "icon", "label_mode", "tags", "bind"):
            del original_marker[field]

        migrated = FloorplanStore._migrate_config(original)

        self.assertEqual(2, migrated["version"])
        migrated_marker = migrated["plans"][0]["markers"][0]
        self.assertIsNone(migrated_marker["area_id"])
        self.assertEqual("mdi:circle", migrated_marker["icon"])
        self.assertEqual("auto", migrated_marker["label_mode"])
        self.assertEqual([], migrated_marker["tags"])
        self.assertEqual({"primary": {"source": "state"}}, migrated_marker["bind"])
        self.assertNotIn("area_id", original_marker)

    def test_future_schema_is_rejected(self) -> None:
        config = valid_config()
        config["version"] = 999
        migrated = FloorplanStore._migrate_config(config)
        valid, error = FloorplanStore._validate_config_structure(migrated)
        self.assertEqual(999, migrated["version"])
        self.assertFalse(valid)
        self.assertIn("newer", error or "")

    def test_invalid_version_survives_migration_for_validation(self) -> None:
        config = valid_config()
        config["version"] = "not-a-version"
        migrated = FloorplanStore._migrate_config(config)
        valid, error = FloorplanStore._validate_config_structure(migrated)
        self.assertFalse(valid)
        self.assertIn("integer", error or "")

    def test_invalid_polygon_is_rejected(self) -> None:
        config = valid_config()
        config["plans"][0]["areas"] = [
            {"id": "area-1", "area_id": "kitchen", "shape": {"type": "polygon", "points": [1, 2]}}
        ]
        valid, error = FloorplanStore._validate_config_structure(config)
        self.assertFalse(valid)
        self.assertIn("points", error or "")

    def test_embedded_svg_is_rejected(self) -> None:
        config = valid_config()
        config["plans"][0]["background"]["url"] = "data:image/svg+xml;base64,AA=="
        valid, error = FloorplanStore._validate_config_structure(config)
        self.assertFalse(valid)
        self.assertIn("unsupported", error or "")

    def test_validate_and_normalize_supplies_alpha_defaults(self) -> None:
        config = valid_config()
        config["views"] = []
        config["plans"][0]["areas"] = [
            {
                "id": "area-1",
                "shape": {
                    "type": "rect",
                    "x": 10,
                    "y": 20,
                    "width": 200,
                    "height": 100,
                },
            }
        ]

        normalized = FloorplanStore.validate_and_normalize(config)

        self.assertEqual("all", normalized["default_view"])
        self.assertEqual(
            ["all", "heating", "lights", "network", "entertainment"],
            [view["id"] for view in normalized["views"]],
        )
        area = normalized["plans"][0]["areas"][0]
        self.assertEqual("", area["area_id"])
        self.assertEqual([], area["tags"])
        self.assertEqual(0.4, area["style"]["fillOpacity"])

    def test_area_overlay_and_marker_secondary_binding_are_accepted(self) -> None:
        config = valid_config()
        config["default_view"] = "all"
        config["plans"][0]["markers"][0]["bind"]["secondary"] = {
            "source": "attr",
            "attr": "unit_of_measurement",
            "format": "{value}",
        }
        config["views"][0]["area_overlay"] = {
            "primary": {
                "mode": "entity",
                "entity_id": "sensor.temperature",
                "source": "state",
                "format": "{value} C",
            },
            "badges": [
                {
                    "entity_id": "binary_sensor.window",
                    "when": {"state_is": "on"},
                    "label": "Window open",
                }
            ],
        }

        self.assertEqual((True, None), FloorplanStore._validate_config_structure(config))

    def test_unknown_default_view_is_rejected(self) -> None:
        config = valid_config()
        config["default_view"] = "missing"

        valid, error = FloorplanStore._validate_config_structure(config)

        self.assertFalse(valid)
        self.assertIn("existing view", error or "")

    def test_invalid_rectangle_size_is_rejected(self) -> None:
        config = valid_config()
        config["plans"][0]["areas"] = [
            {
                "id": "area-1",
                "shape": {
                    "type": "rect",
                    "x": 0,
                    "y": 0,
                    "width": 0,
                    "height": 100,
                },
            }
        ]

        valid, error = FloorplanStore._validate_config_structure(config)

        self.assertFalse(valid)
        self.assertIn("size", error or "")


if __name__ == "__main__":
    unittest.main()
