"""Unit tests for bounded HTTP upload reading."""

from __future__ import annotations

import asyncio
import importlib
import sys
import types
import unittest
from http import HTTPStatus
from pathlib import Path
from unittest.mock import AsyncMock, patch

from tests.test_asset_store import GLB, make_glb


def _load_upload_module():
    root = Path(__file__).resolve().parents[1]
    integration_path = root / "custom_components" / "floorplan_ui"
    package_name = "floorplan_ui_upload_test"
    package = types.ModuleType(package_name)
    package.__path__ = [str(integration_path)]
    sys.modules[package_name] = package
    return importlib.import_module(f"{package_name}.upload")


UPLOAD_MODULE = _load_upload_module()
AssetTooLargeError = UPLOAD_MODULE.AssetTooLargeError
async_read_limited = UPLOAD_MODULE.async_read_limited


def _load_asset_view_module():
    """Load the HTTP handler with minimal framework stubs."""
    web = types.SimpleNamespace(
        json_response=lambda payload, *, status: types.SimpleNamespace(
            payload=payload, status=status
        ),
    )
    stubs = {
        "aiohttp": types.SimpleNamespace(web=web),
        "homeassistant.components.http.auth": types.SimpleNamespace(
            async_sign_path=lambda _hass, path, _duration: path
        ),
        "homeassistant.components.http.view": types.SimpleNamespace(HomeAssistantView=object),
        "homeassistant.exceptions": types.SimpleNamespace(Unauthorized=PermissionError),
    }
    with patch.dict(sys.modules, stubs):
        return importlib.import_module("floorplan_ui_upload_test.asset_view")


ASSET_VIEW = _load_asset_view_module()


class ChunkStream:
    """Small async stream double matching aiohttp's iter_chunked contract."""

    def __init__(self, chunks: list[bytes]) -> None:
        self._chunks = chunks

    async def iter_chunked(self, _size: int):
        for chunk in self._chunks:
            await asyncio.sleep(0)
            yield chunk


class BoundedUploadTests(unittest.IsolatedAsyncioTestCase):
    async def test_collects_chunks_up_to_the_limit(self) -> None:
        data = await async_read_limited(ChunkStream([b"abc", b"def"]), 6)

        self.assertEqual(b"abcdef", data)

    async def test_rejects_chunked_body_as_soon_as_limit_is_exceeded(self) -> None:
        with self.assertRaises(AssetTooLargeError):
            await async_read_limited(ChunkStream([b"abcd", b"efgh"]), 7)


class AssetUploadTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self) -> None:
        self.store = types.SimpleNamespace(
            async_store=AsyncMock(
                return_value=types.SimpleNamespace(
                    asset_id="a" * 64,
                    as_dict=lambda: {"asset_id": "a" * 64, "content_type": "model/gltf-binary"},
                )
            )
        )

    async def _post(self, content_type: str, data: bytes, *, length: int | None = None):
        class Request(dict):
            app = {
                "hass": types.SimpleNamespace(data={ASSET_VIEW.DOMAIN: {"asset_store": self.store}})
            }
            content = ChunkStream([data])
            content_length = length

        request = Request(hass_user=types.SimpleNamespace(is_admin=True))
        request.content_type = content_type
        return await ASSET_VIEW.FloorplanAssetUploadView().post(request)

    async def test_untyped_uploads_are_sniffed_as_glb(self) -> None:
        for content_type in ("", "application/octet-stream"):
            with self.subTest(content_type=content_type):
                response = await self._post(content_type, GLB)
                self.assertEqual(HTTPStatus.CREATED, response.status)
                self.store.async_store.assert_awaited_with(GLB, "model/gltf-binary")
                self.store.async_store.reset_mock()

                response = await self._post(content_type, b"<svg/>")
                self.assertEqual(HTTPStatus.BAD_REQUEST, response.status)
                self.store.async_store.assert_not_called()

    async def test_upload_size_limits_apply_to_streamed_and_declared_lengths(self) -> None:
        large_model = make_glb(
            {"asset": {"version": "2.0"}}, bytes(ASSET_VIEW.MAX_IMAGE_FILE_BYTES)
        )
        oversized_model = large_model.ljust(ASSET_VIEW.MAX_MODEL_FILE_BYTES + 1, b"\0")
        for content_type in ("image/png", "image/jpeg", "image/svg+xml"):
            with self.subTest(content_type=content_type):
                streamed = await self._post(content_type, large_model)
                declared = await self._post(content_type, b"", length=len(large_model))
                self.assertEqual(HTTPStatus.REQUEST_ENTITY_TOO_LARGE, streamed.status)
                self.assertEqual(HTTPStatus.REQUEST_ENTITY_TOO_LARGE, declared.status)
        self.store.async_store.assert_not_called()

        for content_type in ("model/gltf-binary", "application/octet-stream"):
            with self.subTest(content_type=content_type):
                response = await self._post(content_type, large_model)
                self.assertEqual(HTTPStatus.CREATED, response.status)
                self.store.async_store.assert_awaited_with(large_model, "model/gltf-binary")
                self.store.async_store.reset_mock()

                declared = await self._post(
                    content_type, b"", length=ASSET_VIEW.MAX_MODEL_FILE_BYTES + 1
                )
                streamed = await self._post(content_type, oversized_model)
                self.assertEqual(HTTPStatus.REQUEST_ENTITY_TOO_LARGE, declared.status)
                self.assertEqual(HTTPStatus.REQUEST_ENTITY_TOO_LARGE, streamed.status)
                self.store.async_store.assert_not_called()


if __name__ == "__main__":
    unittest.main()
