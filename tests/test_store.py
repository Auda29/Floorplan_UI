"""Unit tests for Floorplan UI configuration storage."""

from __future__ import annotations

import asyncio
import base64
import copy
import importlib
import sys
import tempfile
import types
import unittest
from pathlib import Path
from unittest.mock import AsyncMock, patch


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
ConfigConflictError = STORE_MODULE.ConfigConflictError


def valid_config() -> dict:
    """Return a minimal valid v3 configuration."""
    return {
        "version": 3,
        "revision": 0,
        "plans": [
            {
                "plan_id": "ground-floor",
                "name": "Ground floor",
                "background": {
                    "type": "image",
                    "asset_id": "a" * 64,
                    "content_type": "image/png",
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

    def test_fractional_dimensions_survive_normalization_and_reload(self) -> None:
        config = valid_config()
        config["plans"][0]["background"].update(width=0.5, height=800.75)
        saved = FloorplanStore.validate_and_normalize(config)
        reloaded = FloorplanStore.validate_and_normalize(saved)
        self.assertEqual(saved, reloaded)
        self.assertEqual(0.5, reloaded["plans"][0]["background"]["width"])
        self.assertEqual(800.75, reloaded["plans"][0]["background"]["height"])

    def test_missing_view_filters_are_normalized_for_the_renderer(self) -> None:
        config = valid_config()
        del config["views"][0]["filters"]
        normalized = FloorplanStore.validate_and_normalize(config)
        self.assertEqual({}, normalized["views"][0]["filters"])
        self.assertNotIn("filters", config["views"][0])

    def test_invalid_ids_return_validation_errors_instead_of_type_errors(self) -> None:
        for kind in ("view", "plan", "area", "marker"):
            for invalid_id in (["oops"], {"bad": "id"}, None, 42, ""):
                with self.subTest(kind=kind, invalid_id=invalid_id):
                    config = valid_config()
                    plan = config["plans"][0]
                    if kind == "view":
                        config["views"][0]["id"] = invalid_id
                    elif kind == "plan":
                        plan["plan_id"] = invalid_id
                    elif kind == "area":
                        plan["areas"] = [{"id": invalid_id}]
                    else:
                        plan["markers"][0]["id"] = invalid_id
                    with self.assertRaisesRegex(ValueError, "IDs must be non-empty strings"):
                        FloorplanStore.validate_and_normalize(config)

    def test_v1_migration_adds_marker_area_and_does_not_mutate_input(self) -> None:
        original = valid_config()
        original["version"] = 1
        original_marker = original["plans"][0]["markers"][0]
        for field in ("area_id", "icon", "label_mode", "tags", "bind"):
            del original_marker[field]

        migrated = FloorplanStore._migrate_config(original)

        self.assertEqual(3, migrated["version"])
        self.assertEqual(0, migrated["revision"])
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

    def test_boolean_and_fractional_versions_are_rejected(self) -> None:
        for invalid_version in (True, False, 1.5):
            with self.subTest(version=invalid_version):
                config = valid_config()
                config["version"] = invalid_version

                with self.assertRaisesRegex(ValueError, "Config.version must be an integer"):
                    FloorplanStore.validate_and_normalize(config)

    def test_legacy_non_list_plans_are_rejected_without_migration_crash(self) -> None:
        config = {"version": 1, "plans": 42}

        with self.assertRaisesRegex(ValueError, "Config.plans must be a list"):
            FloorplanStore.validate_and_normalize(config)

    def test_legacy_non_list_markers_are_rejected_without_migration_crash(self) -> None:
        config = valid_config()
        config["version"] = 1
        config["plans"][0]["markers"] = 42

        with self.assertRaisesRegex(ValueError, "markers is invalid"):
            FloorplanStore.validate_and_normalize(config)

    def test_legacy_non_object_area_is_rejected_without_normalization_crash(self) -> None:
        config = valid_config()
        config["version"] = 1
        config["plans"][0]["areas"] = [42]

        with self.assertRaisesRegex(ValueError, "area 0 is invalid"):
            FloorplanStore.validate_and_normalize(config)

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
        del config["plans"][0]["background"]["asset_id"]
        del config["plans"][0]["background"]["content_type"]
        config["plans"][0]["background"]["url"] = "data:image/svg+xml;base64,AA=="
        valid, error = FloorplanStore._validate_config_structure(
            config,
            allow_embedded_images=True,
        )
        self.assertFalse(valid)
        self.assertIn("PNG/JPEG", error or "")

    def test_external_background_url_is_rejected(self) -> None:
        config = valid_config()
        del config["plans"][0]["background"]["asset_id"]
        del config["plans"][0]["background"]["content_type"]
        config["plans"][0]["background"]["url"] = "https://example.com/floorplan.png"

        valid, error = FloorplanStore._validate_config_structure(config)

        self.assertFalse(valid)
        self.assertIn("local image asset", error or "")

    def test_invalid_revision_is_rejected(self) -> None:
        config = valid_config()
        config["revision"] = -1

        valid, error = FloorplanStore._validate_config_structure(config)

        self.assertFalse(valid)
        self.assertIn("revision", error or "")

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


class FloorplanLoadTests(unittest.IsolatedAsyncioTestCase):
    """Recover broken legacy backgrounds without discarding plan data."""

    async def test_recovers_bad_images_preserves_original_and_survives_reload(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            hass = types.SimpleNamespace(
                config=types.SimpleNamespace(path=lambda _path: directory),
                async_add_executor_job=lambda function, *args: asyncio.to_thread(function, *args),
            )
            store = FloorplanStore.__new__(FloorplanStore)
            store._hass = hass
            store._data = None
            store._load_lock = asyncio.Lock()
            store._asset_store = STORE_MODULE.FloorplanAssetStore(hass)
            original = valid_config()
            original["version"] = 2
            for index, payload in enumerate(
                (
                    "data:image/png;base64," + base64.b64encode(b"not-an-image").decode(),
                    "data:image/png;base64,broken!",
                )
            ):
                plan = copy.deepcopy(original["plans"][0])
                plan["plan_id"] = f"damaged-{index}"
                plan["background"] = {"type": "image", "width": 800, "height": 600, "url": payload}
                original["plans"].append(plan)
            stored = copy.deepcopy(original)
            store._store = types.SimpleNamespace(
                async_load=AsyncMock(return_value=stored), async_save=AsyncMock()
            )
            backup = types.SimpleNamespace(async_save=AsyncMock())
            with patch.object(STORE_MODULE, "Store", return_value=backup):
                recovered = await store.async_load()
            backup.async_save.assert_awaited_once_with(original)
            self.assertEqual(original, stored)
            self.assertEqual(3, len(recovered["plans"]))
            self.assertEqual("a" * 64, recovered["plans"][0]["background"]["asset_id"])
            for plan in recovered["plans"][1:]:
                self.assertNotIn("url", plan["background"])
                self.assertEqual(original["plans"][0]["markers"], plan["markers"])
            store._store.async_save.assert_awaited_once_with(recovered)
            store._data = None
            store._store.async_load.return_value = copy.deepcopy(recovered)
            self.assertEqual(recovered, await store.async_load())

    async def test_image_io_errors_do_not_trigger_destructive_recovery(self) -> None:
        store = FloorplanStore.__new__(FloorplanStore)
        store._asset_store = types.SimpleNamespace(
            async_store_data_url=AsyncMock(side_effect=OSError("disk unavailable"))
        )
        config = valid_config()
        config["plans"][0]["background"]["url"] = "data:image/png;base64,YQ=="
        invalid_images: list[str] = []
        with self.assertRaisesRegex(OSError, "disk unavailable"):
            await store._async_materialize_embedded_images(config, invalid_images=invalid_images)
        self.assertEqual([], invalid_images)
        self.assertIn("url", config["plans"][0]["background"])

    async def test_failed_recovery_backup_does_not_overwrite_original_storage(self) -> None:
        config = valid_config()
        config["plans"][0]["background"] = {
            "type": "image",
            "width": 800,
            "height": 600,
            "url": "data:image/png;base64,YQ==",
        }
        store = FloorplanStore.__new__(FloorplanStore)
        store._hass = object()
        store._data = None
        store._load_lock = asyncio.Lock()
        store._store = types.SimpleNamespace(
            async_load=AsyncMock(return_value=config), async_save=AsyncMock()
        )
        store._asset_store = types.SimpleNamespace(
            async_store_data_url=AsyncMock(
                side_effect=STORE_MODULE.AssetValidationError("invalid image")
            )
        )
        backup = types.SimpleNamespace(async_save=AsyncMock(side_effect=OSError("backup failed")))
        with patch.object(STORE_MODULE, "Store", return_value=backup):
            with self.assertRaisesRegex(OSError, "backup failed"):
                await store.async_load()
        store._store.async_save.assert_not_awaited()
        self.assertIsNone(store._data)
        self.assertIn("url", config["plans"][0]["background"])


class FloorplanRevisionTests(unittest.IsolatedAsyncioTestCase):
    """Exercise compare-and-swap configuration updates."""

    async def asyncSetUp(self) -> None:
        self.store = FloorplanStore.__new__(FloorplanStore)
        self.store._data = valid_config()
        self.store._update_lock = asyncio.Lock()

        class AssetStore:
            def __init__(self) -> None:
                self.collected: list[set[str]] = []
                self.validated_data_urls: list[str] = []

            @staticmethod
            async def async_exists(asset_id: str, content_type: str) -> bool:
                return asset_id == "a" * 64 and content_type == "image/png"

            async def async_collect_garbage(self, referenced: set[str]) -> list[str]:
                self.collected.append(referenced)
                return []

            async def async_validate_data_url(self, data_url: str) -> None:
                self.validated_data_urls.append(data_url)

        self.asset_store = AssetStore()
        self.store._asset_store = self.asset_store

        async def async_load(instance):
            return instance._data

        async def async_save(instance, data):
            instance._data = data

        self.store.async_load = types.MethodType(async_load, self.store)
        self.store.async_save = types.MethodType(async_save, self.store)

    async def test_update_increments_revision(self) -> None:
        updated = await self.store.async_update_config(valid_config(), 0)

        self.assertEqual(1, updated["revision"])
        self.assertEqual(1, self.store._data["revision"])

    async def test_successful_update_collects_only_after_persisting_references(self) -> None:
        await self.store.async_update_config(valid_config(), 0)

        self.assertEqual([{"a" * 64}], self.asset_store.collected)

    async def test_garbage_collection_failure_does_not_undo_saved_config(self) -> None:
        async def fail_collection(_referenced: set[str]) -> list[str]:
            raise OSError("disk busy")

        self.asset_store.async_collect_garbage = fail_collection

        updated = await self.store.async_update_config(valid_config(), 0)

        self.assertEqual(1, updated["revision"])
        self.assertEqual(1, self.store._data["revision"])

    async def test_import_validation_delegates_embedded_image_decoding(self) -> None:
        config = valid_config()
        background = config["plans"][0]["background"]
        del background["asset_id"]
        del background["content_type"]
        background["url"] = "data:image/png;base64,iVBORw0KGgp1bml0LXRlc3Q="

        await self.store.async_validate_config(config, allow_embedded_images=True)

        self.assertEqual([background["url"]], self.asset_store.validated_data_urls)

    async def test_stale_update_is_rejected(self) -> None:
        await self.store.async_update_config(valid_config(), 0)

        with self.assertRaises(ConfigConflictError) as context:
            await self.store.async_update_config(valid_config(), 0)

        self.assertEqual(1, context.exception.current_revision)

    async def test_legacy_embedded_image_is_materialized_without_mutating_input(
        self,
    ) -> None:
        config = valid_config()
        background = config["plans"][0]["background"]
        del background["asset_id"]
        del background["content_type"]
        background["url"] = "data:image/png;base64,iVBORw0KGgp1bml0LXRlc3Q="

        class Reference:
            @staticmethod
            def as_dict() -> dict[str, str]:
                return {
                    "asset_id": "b" * 64,
                    "content_type": "image/png",
                }

        class MaterializingAssetStore:
            @staticmethod
            async def async_store_data_url(data_url: str):
                if not data_url.startswith("data:image/png;base64,"):
                    raise AssertionError("unexpected data URL")
                return Reference()

        self.store._asset_store = MaterializingAssetStore()
        migrated = await self.store._async_materialize_embedded_images(config)

        self.assertIn("url", config["plans"][0]["background"])
        self.assertNotIn("url", migrated["plans"][0]["background"])
        self.assertEqual("b" * 64, migrated["plans"][0]["background"]["asset_id"])


if __name__ == "__main__":
    unittest.main()
