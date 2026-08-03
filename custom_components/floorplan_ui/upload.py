"""Bounded streaming helpers for floorplan asset uploads."""

from __future__ import annotations

from typing import Protocol


class AsyncChunkStream(Protocol):
    """Subset of aiohttp's request content stream used by the integration."""

    def iter_chunked(self, size: int):
        """Yield request-body chunks asynchronously."""


class AssetTooLargeError(ValueError):
    """Raised as soon as a streamed upload exceeds its configured limit."""


async def async_read_limited(stream: AsyncChunkStream, limit: int) -> bytes:
    """Read a stream without ever accepting more than ``limit`` bytes."""
    chunks: list[bytes] = []
    received = 0
    async for chunk in stream.iter_chunked(min(64 * 1024, limit + 1)):
        received += len(chunk)
        if received > limit:
            raise AssetTooLargeError
        chunks.append(chunk)
    return b"".join(chunks)
