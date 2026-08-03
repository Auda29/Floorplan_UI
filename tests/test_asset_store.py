"""Unit tests for content-addressed floorplan image storage."""

from __future__ import annotations

import asyncio
import importlib
import sys
import tempfile
import time
import types
import unittest
from io import BytesIO
from pathlib import Path

from PIL import Image


def _load_asset_module():
    root = Path(__file__).resolve().parents[1]
    integration_path = root / "custom_components" / "floorplan_ui"
    sys.modules.setdefault(
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
collect_referenced_asset_ids = ASSET_MODULE.collect_referenced_asset_ids
decode_image_data_url = ASSET_MODULE.decode_image_data_url
validate_image_bytes = ASSET_MODULE.validate_image_bytes


def image_bytes(image_format: str, size: tuple[int, int] = (4, 3)) -> bytes:
    """Create a small, fully decodable image fixture."""
    output = BytesIO()
    mode = "RGB" if image_format == "JPEG" else "RGBA"
    Image.new(mode, size, "white").save(output, format=image_format)
    return output.getvalue()


PNG = image_bytes("PNG")
JPEG = image_bytes("JPEG")


class AssetValidationTests(unittest.TestCase):
    def test_png_and_jpeg_are_fully_decoded(self) -> None:
        validate_image_bytes(PNG, "image/png")
        validate_image_bytes(JPEG, "image/jpeg")

    def test_signature_only_payload_is_rejected(self) -> None:
        with self.assertRaisesRegex(AssetValidationError, "decoded"):
            validate_image_bytes(b"\x89PNG\r\n\x1a\nnot-an-image", "image/png")

    def test_declared_type_must_match_decoded_format(self) -> None:
        with self.assertRaisesRegex(AssetValidationError, "does not match"):
            validate_image_bytes(JPEG, "image/png")

    def test_excessive_dimensions_are_rejected(self) -> None:
        too_wide = image_bytes("PNG", (16_385, 1))

        with self.assertRaisesRegex(AssetValidationError, "dimensions"):
            validate_image_bytes(too_wide, "image/png")

    def test_excessive_pixel_count_is_rejected(self) -> None:
        output = BytesIO()
        Image.new("1", (8_000, 8_001)).save(output, format="PNG")

        with self.assertRaisesRegex(AssetValidationError, "pixel"):
            validate_image_bytes(output.getvalue(), "image/png")

    def test_embedded_data_url_is_strictly_validated(self) -> None:
        import base64

        data, content_type = decode_image_data_url(
            f"data:image/png;base64,{base64.b64encode(PNG).decode('ascii')}"
        )
        self.assertEqual(PNG, data)
        self.assertEqual("image/png", content_type)


class AssetReferenceTests(unittest.TestCase):
    def test_collects_unique_references_from_multiple_plans(self) -> None:
        config = {
            "plans": [
                {"background": {"asset_id": "a" * 64}},
                {"background": {"asset_id": "a" * 64}},
                {"background": {"asset_id": "b" * 64}},
                {"background": {"asset_id": "unsafe"}},
            ]
        }

        self.assertEqual(
            {"a" * 64, "b" * 64},
            collect_referenced_asset_ids(config),
        )


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


class AssetGarbageCollectionTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self) -> None:
        self._temporary = tempfile.TemporaryDirectory()
        directory = self._temporary.name

        class Config:
            @staticmethod
            def path(_relative: str) -> str:
                return directory

        class Hass:
            config = Config()

            @staticmethod
            async def async_add_executor_job(function, *args):
                return await asyncio.to_thread(function, *args)

        self.store = FloorplanAssetStore(Hass())

    def tearDown(self) -> None:
        self._temporary.cleanup()

    def _asset_file(self, asset_id: str, *, age_seconds: int) -> Path:
        path = self.store.directory / f"{asset_id}.png"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(PNG)
        timestamp = time.time() - age_seconds
        path.touch()
        path.chmod(0o600)
        import os

        os.utime(path, (timestamp, timestamp))
        return path

    async def test_removes_only_old_unreferenced_assets(self) -> None:
        referenced = "a" * 64
        orphan = "b" * 64
        fresh = "c" * 64
        referenced_path = self._asset_file(referenced, age_seconds=10_000)
        orphan_path = self._asset_file(orphan, age_seconds=10_000)
        fresh_path = self._asset_file(fresh, age_seconds=10)
        invalid_path = self.store.directory / "not-an-asset.png"
        invalid_path.write_bytes(PNG)

        deleted = await self.store.async_collect_garbage({referenced}, grace_seconds=300)

        self.assertEqual([orphan], deleted)
        self.assertTrue(referenced_path.exists())
        self.assertFalse(orphan_path.exists())
        self.assertTrue(fresh_path.exists())
        self.assertTrue(invalid_path.exists())

    async def test_dry_run_reports_without_deleting_and_is_idempotent(self) -> None:
        orphan = "d" * 64
        orphan_path = self._asset_file(orphan, age_seconds=10_000)

        candidates = await self.store.async_collect_garbage(set(), grace_seconds=300, dry_run=True)
        deleted = await self.store.async_collect_garbage(set(), grace_seconds=300)
        repeated = await self.store.async_collect_garbage(set(), grace_seconds=300)

        self.assertEqual([orphan], candidates)
        self.assertEqual([orphan], deleted)
        self.assertEqual([], repeated)
        self.assertFalse(orphan_path.exists())
