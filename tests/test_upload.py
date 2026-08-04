"""Unit tests for bounded HTTP upload reading."""

from __future__ import annotations

import asyncio
import importlib
import sys
import types
import unittest
from pathlib import Path


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


if __name__ == "__main__":
    unittest.main()
