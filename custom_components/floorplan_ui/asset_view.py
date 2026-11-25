"""Authenticated HTTP endpoints for Floorplan UI assets."""

from __future__ import annotations

from datetime import timedelta
from http import HTTPStatus
from typing import Final

from aiohttp import web
from homeassistant.components.http.auth import async_sign_path
from homeassistant.components.http.view import HomeAssistantView
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import Unauthorized

from .asset_store import GLB_MAGIC, AssetValidationError, FloorplanAssetStore
from .const import (
    ASSET_API_URL,
    ASSET_URL_EXPIRATION_SECONDS,
    DOMAIN,
    IMAGE_CONTENT_TYPES,
    MAX_IMAGE_FILE_BYTES,
    MAX_MODEL_FILE_BYTES,
    MODEL_CONTENT_TYPE,
)
from .upload import AssetTooLargeError, async_read_limited

_CACHE_HEADERS: Final = {
    "Cache-Control": "private, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
}
_SVG_HEADERS: Final = {
    **_CACHE_HEADERS,
    "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
}
_ASSET_CONTENT_TYPES: Final = (*IMAGE_CONTENT_TYPES, MODEL_CONTENT_TYPE)
_UNTYPED_UPLOADS: Final = ("", "application/octet-stream")


def asset_path(asset_id: str) -> str:
    """Return the canonical URL path for an asset."""
    return f"{ASSET_API_URL}/{asset_id}"


def signed_asset_path(hass: HomeAssistant, asset_id: str) -> str:
    """Return a temporary authenticated URL for an asset."""
    return async_sign_path(
        hass,
        asset_path(asset_id),
        timedelta(seconds=ASSET_URL_EXPIRATION_SECONDS),
    )


class FloorplanAssetView(HomeAssistantView):
    """Serve one immutable asset to authenticated users."""

    url = f"{ASSET_API_URL}/{{asset_id}}"
    name = "api:floorplan_ui:asset"
    requires_auth = True

    async def get(self, request: web.Request, asset_id: str) -> web.StreamResponse:
        """Serve a validated asset with its storage content type."""
        asset_store: FloorplanAssetStore = request.app["hass"].data[DOMAIN]["asset_store"]
        content_type = request.query.get("content_type")
        candidate_types = (
            (content_type,) if content_type in _ASSET_CONTENT_TYPES else _ASSET_CONTENT_TYPES
        )
        for candidate_type in candidate_types:
            try:
                path = asset_store.path_for(asset_id, candidate_type)
            except AssetValidationError:
                raise web.HTTPNotFound from None
            if await request.app["hass"].async_add_executor_job(path.is_file):
                headers = _SVG_HEADERS if candidate_type == "image/svg+xml" else _CACHE_HEADERS
                response = web.FileResponse(path, headers=headers)
                response.content_type = candidate_type
                return response
        raise web.HTTPNotFound


class FloorplanAssetUploadView(HomeAssistantView):
    """Accept one validated asset from an administrator."""

    url = ASSET_API_URL
    name = "api:floorplan_ui:asset_upload"
    requires_auth = True

    async def post(self, request: web.Request) -> web.Response:
        """Persist a raw PNG, JPEG, SVG or GLB upload."""
        user = request.get("hass_user")
        if user is None or not user.is_admin:
            raise Unauthorized

        content_type = request.content_type
        sniff_model = content_type in _UNTYPED_UPLOADS
        if content_type in IMAGE_CONTENT_TYPES:
            limit = MAX_IMAGE_FILE_BYTES
        elif sniff_model or content_type == MODEL_CONTENT_TYPE:
            limit = MAX_MODEL_FILE_BYTES
        else:
            return web.json_response(
                {"error": "Unsupported asset content type"},
                status=HTTPStatus.BAD_REQUEST,
            )
        try:
            if request.content_length is not None and request.content_length > limit:
                raise AssetTooLargeError
            data = await async_read_limited(request.content, limit)
        except AssetTooLargeError:
            return web.json_response(
                {"error": f"The asset exceeds the {limit // 1_000_000} MB limit"},
                status=HTTPStatus.REQUEST_ENTITY_TOO_LARGE,
            )
        asset_store: FloorplanAssetStore = request.app["hass"].data[DOMAIN]["asset_store"]
        try:
            if sniff_model:
                if not data.startswith(GLB_MAGIC):
                    raise AssetValidationError("Untyped uploads must be binary glTF models")
                content_type = MODEL_CONTENT_TYPE
            reference = await asset_store.async_store(data, content_type)
        except AssetValidationError as err:
            return web.json_response(
                {"error": str(err)},
                status=HTTPStatus.BAD_REQUEST,
            )

        return web.json_response(
            {
                **reference.as_dict(),
                "url": signed_asset_path(request.app["hass"], reference.asset_id),
            },
            status=HTTPStatus.CREATED,
        )
