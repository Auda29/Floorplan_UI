"""Authenticated HTTP endpoints for Floorplan UI image assets."""

from __future__ import annotations

from datetime import timedelta
from http import HTTPStatus
from typing import Final

from aiohttp import web
from homeassistant.components.http.auth import async_sign_path
from homeassistant.components.http.view import HomeAssistantView
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import Unauthorized

from .asset_store import AssetValidationError, FloorplanAssetStore
from .const import (
    ASSET_API_URL,
    ASSET_URL_EXPIRATION_SECONDS,
    DOMAIN,
    MAX_IMAGE_FILE_BYTES,
)

_CACHE_HEADERS: Final = {
    "Cache-Control": "private, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
}


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
    """Serve one immutable image asset to authenticated users."""

    url = f"{ASSET_API_URL}/{{asset_id}}"
    name = "api:floorplan_ui:asset"
    requires_auth = True

    async def get(self, request: web.Request, asset_id: str) -> web.StreamResponse:
        """Serve a validated image asset."""
        asset_store: FloorplanAssetStore = request.app["hass"].data[DOMAIN]["asset_store"]
        content_type = request.query.get("content_type")
        candidate_types = (
            (content_type,)
            if content_type in {"image/png", "image/jpeg"}
            else ("image/png", "image/jpeg")
        )
        for candidate_type in candidate_types:
            try:
                path = asset_store.path_for(asset_id, candidate_type)
            except AssetValidationError:
                raise web.HTTPNotFound from None
            if await request.app["hass"].async_add_executor_job(path.is_file):
                response = web.FileResponse(path, headers=_CACHE_HEADERS)
                response.content_type = candidate_type
                return response
        raise web.HTTPNotFound


class FloorplanAssetUploadView(HomeAssistantView):
    """Accept one validated image from an administrator."""

    url = ASSET_API_URL
    name = "api:floorplan_ui:asset_upload"
    requires_auth = True

    async def post(self, request: web.Request) -> web.Response:
        """Persist a raw PNG/JPEG upload."""
        user = request.get("hass_user")
        if user is None or not user.is_admin:
            raise Unauthorized

        content_length = request.content_length
        if content_length is not None and content_length > MAX_IMAGE_FILE_BYTES:
            return web.json_response(
                {"error": f"The image exceeds the {MAX_IMAGE_FILE_BYTES // 1_000_000} MB limit"},
                status=HTTPStatus.REQUEST_ENTITY_TOO_LARGE,
            )

        content_type = request.content_type
        data = await request.read()
        asset_store: FloorplanAssetStore = request.app["hass"].data[DOMAIN]["asset_store"]
        try:
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
