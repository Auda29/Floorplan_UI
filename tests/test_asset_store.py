"""Unit tests for content-addressed floorplan image storage."""

from __future__ import annotations

import asyncio
import base64
import importlib
import sys
import tempfile
import threading
import time
import types
import unittest
from io import BytesIO
from pathlib import Path
from unittest.mock import patch

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
    @staticmethod
    def _store(directory: str) -> FloorplanAssetStore:
        class Config:
            @staticmethod
            def path(_relative: str) -> str:
                return directory

        class Hass:
            config = Config()

            @staticmethod
            async def async_add_executor_job(function, *args):
                return await asyncio.to_thread(function, *args)

        return FloorplanAssetStore(Hass())

    async def test_assets_are_content_addressed_and_deduplicated(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            store = self._store(directory)
            first = await store.async_store(PNG, "image/png")
            second = await store.async_store(PNG, "image/png")

            self.assertEqual(first, second)
            self.assertTrue(store.path_for(first.asset_id, first.content_type).is_file())

    async def test_raw_image_validation_runs_once_outside_the_event_loop(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            store = self._store(directory)
            event_loop_thread = threading.get_ident()
            validation_threads: list[int] = []
            original_validate = ASSET_MODULE.validate_image_bytes

            def track_validation(data: bytes, content_type: str) -> None:
                validation_threads.append(threading.get_ident())
                original_validate(data, content_type)

            with patch.object(ASSET_MODULE, "validate_image_bytes", side_effect=track_validation):
                await store.async_store(PNG, "image/png")

            self.assertEqual(1, len(validation_threads))
            self.assertNotEqual(event_loop_thread, validation_threads[0])

    async def test_legacy_data_url_is_decoded_once_outside_the_event_loop(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            store = self._store(directory)
            event_loop_thread = threading.get_ident()
            validation_threads: list[int] = []
            original_validate = ASSET_MODULE.validate_image_bytes
            data_url = f"data:image/png;base64,{base64.b64encode(PNG).decode('ascii')}"

            def track_validation(data: bytes, content_type: str) -> None:
                validation_threads.append(threading.get_ident())
                original_validate(data, content_type)

            with patch.object(ASSET_MODULE, "validate_image_bytes", side_effect=track_validation):
                await store.async_store_data_url(data_url)

            self.assertEqual(1, len(validation_threads))
            self.assertNotEqual(event_loop_thread, validation_threads[0])


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

    async def test_retains_newly_unreferenced_old_images_until_grace_expires(self) -> None:
        referenced = "a" * 64
        orphan = "b" * 64
        fresh = "c" * 64
        referenced_path = self._asset_file(referenced, age_seconds=10_000)
        orphan_path = self._asset_file(orphan, age_seconds=10_000)
        fresh_path = self._asset_file(fresh, age_seconds=10)
        invalid_path = self.store.directory / "not-an-asset.png"
        invalid_path.write_bytes(PNG)

        started = time.time()
        self.assertEqual(
            [], await self.store.async_collect_garbage({referenced}, grace_seconds=300)
        )
        self.assertTrue(orphan_path.exists())
        # Referencing the fresh asset clears its orphan timestamp.
        await self.store.async_collect_garbage({referenced, fresh}, grace_seconds=300)
        with patch.object(ASSET_MODULE.time, "time", return_value=started + 301):
            deleted = await self.store.async_collect_garbage({referenced, fresh}, grace_seconds=300)

        self.assertEqual([orphan], deleted)
        self.assertTrue(referenced_path.exists())
        self.assertFalse(orphan_path.exists())
        self.assertTrue(fresh_path.exists())
        self.assertTrue(invalid_path.exists())

    async def test_dry_run_reports_without_deleting_and_is_idempotent(self) -> None:
        orphan = "d" * 64
        orphan_path = self._asset_file(orphan, age_seconds=10_000)

        candidates = await self.store.async_collect_garbage(set(), grace_seconds=0, dry_run=True)
        self.assertFalse(orphan_path.with_name(f".{orphan_path.name}.unreferenced").exists())
        deleted = await self.store.async_collect_garbage(set(), grace_seconds=0)
        repeated = await self.store.async_collect_garbage(set(), grace_seconds=300)

        self.assertEqual([orphan], candidates)
        self.assertEqual([orphan], deleted)
        self.assertEqual([], repeated)
        self.assertFalse(orphan_path.exists())

    async def test_undo_and_reupload_reset_retention_across_restarts(self) -> None:
        reference = await self.store.async_store(PNG, "image/png")
        path = self.store.path_for(reference.asset_id, reference.content_type)
        await self.store.async_collect_garbage(set(), grace_seconds=300)
        marker = path.with_name(f".{path.name}.unreferenced")
        self.assertTrue(marker.exists())
        # A restored plan removes the orphan timestamp.
        await self.store.async_collect_garbage({reference.asset_id}, grace_seconds=300)
        self.assertFalse(marker.exists())
        await self.store.async_collect_garbage(set(), grace_seconds=300)
        # Retention survives an integration restart.
        restarted = FloorplanAssetStore(self.store._hass)
        with patch.object(ASSET_MODULE.time, "time", return_value=time.time() + 301):
            self.assertEqual(
                [reference.asset_id],
                await restarted.async_collect_garbage(set(), grace_seconds=300, dry_run=True),
            )
            await restarted.async_store(PNG, "image/png")
            self.assertEqual([], await restarted.async_collect_garbage(set(), grace_seconds=300))
        self.assertTrue(path.exists())
