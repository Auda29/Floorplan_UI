"""Unit tests for content-addressed floorplan image storage."""

from __future__ import annotations

import asyncio
import importlib
from pathlib import Path
import sys
import tempfile
import types
import unittest


def _load_asset_module():
    root = Path(__file__).resolve().parents[1]
    integration_path = root / "custom_components" / "floorplan_ui"
    homeassistant = sys.modules.setdefault(
        "homeassistant",
        types.ModuleType("homeassistant"),
    )
    core = sys.modules.setdefault(
        "homeassistant.core",
        types.ModuleType("homeassistant.core"),
    )
    core.HomeAssistant = object
    package_name = "floorplan_ui_asset_test"
    package = types.ModuleType(package_name)
    package.__path__ = [str(integration_path)]
    sys.modules[package_name] = package
    return importlib.import_module(f"{package_name}.asset_store")


ASSET_MODULE = _load_asset_module()
AssetValidationError = ASSET_MODULE.AssetValidationError
FloorplanAssetStore = ASSET_MODULE.FloorplanAssetStore
decode_image_data_url = ASSET_MODULE.decode_image_data_url
validate_image_bytes = ASSET_MODULE.validate_image_bytes

PNG = b"\x89PNG\r\n\x1a\nunit-test"
JPEG = b"\xff\xd8\xffunit-test\xff\xd9"


class AssetValidationTests(unittest.TestCase):
    def test_png_and_jpeg_magic_are_accepted(self) -> None:
        validate_image_bytes(PNG, "image/png")
        validate_image_bytes(JPEG, "image/jpeg")

    def test_declared_type_must_match_magic(self) -> None:
        with self.assertRaisesRegex(AssetValidationError, "not a PNG"):
            validate_image_bytes(JPEG, "image/png")

    def test_embedded_data_url_is_strictly_validated(self) -> None:
        data, content_type = decode_image_data_url(
            "data:image/png;base64,iVBORw0KGgp1bml0LXRlc3Q="
        )
        self.assertEqual(PNG, data)
        self.assertEqual("image/png", content_type)


class AssetPersistenceTests(unittest.IsolatedAsyncioTestCase):
    async def test_assets_are_content_addressed_and_deduplicated(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            class Config:
                @staticmethod
                def path(_relative: str) -> str:
                    return directory

            class Hass:
                config = Config()

                @staticmethod
                async def async_add_executor_job(function, *args):
                    return await asyncio.to_thread(function, *args)

            store = FloorplanAssetStore(Hass())
            first = await store.async_store(PNG, "image/png")
            second = await store.async_store(PNG, "image/png")

            self.assertEqual(first, second)
            self.assertTrue(store.path_for(first.asset_id, first.content_type).is_file())
