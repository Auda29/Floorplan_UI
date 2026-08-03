"""Integration tests for Floorplan UI's Home Assistant contracts."""

from __future__ import annotations

import base64
from http import HTTPStatus

import pytest
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.floorplan_ui.const import (
    DOMAIN,
    MAX_IMAGE_FILE_BYTES,
)

pytestmark = [
    pytest.mark.asyncio,
    pytest.mark.usefixtures("enable_custom_integrations"),
]

PNG = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAYAAAC09K7GAAAAFUlEQVR4nGP8////fwYkwMSABjAEAMIKBALFMvzuAAAAAElFTkSuQmCC"
)


async def _setup_yaml(hass) -> None:
    assert await async_setup_component(hass, DOMAIN, {DOMAIN: {}})
    await hass.async_block_till_done()


async def _get_config(ws_client) -> dict:
    await ws_client.send_json_auto_id({"type": "floorplan_ui/get_config"})
    response = await ws_client.receive_json()
    assert response["success"]
    return response["result"]


async def test_yaml_setup_registers_runtime(hass) -> None:
    await _setup_yaml(hass)

    assert DOMAIN in hass.data
    assert hass.data[DOMAIN]["panel_registered"]
    assert hass.data[DOMAIN]["asset_store"] is not None


async def test_config_entry_setup_and_unload(hass) -> None:
    entry = MockConfigEntry(domain=DOMAIN, title="Floorplan UI", data={})
    entry.add_to_hass(hass)

    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert hass.data[DOMAIN]["panel_registered"]

    assert await hass.config_entries.async_unload(entry.entry_id)
    assert not hass.data[DOMAIN]["panel_registered"]


async def test_viewer_can_read_but_cannot_save(
    hass,
    hass_read_only_access_token,
    hass_ws_client,
) -> None:
    await _setup_yaml(hass)
    client = await hass_ws_client(hass, hass_read_only_access_token)

    config = await _get_config(client)
    await client.send_json_auto_id(
        {
            "type": "floorplan_ui/save_config",
            "base_revision": config["revision"],
            "config": config,
        }
    )
    response = await client.receive_json()

    assert not response["success"]
    assert response["error"]["code"] == "unauthorized"


async def test_stale_save_returns_a_conflict(hass, hass_ws_client) -> None:
    await _setup_yaml(hass)
    client = await hass_ws_client(hass)
    config = await _get_config(client)

    message = {
        "type": "floorplan_ui/save_config",
        "base_revision": config["revision"],
        "config": config,
    }
    await client.send_json_auto_id(message)
    first = await client.receive_json()
    assert first["success"]
    assert first["result"]["revision"] == config["revision"] + 1

    await client.send_json_auto_id(message)
    stale = await client.receive_json()
    assert not stale["success"]
    assert stale["error"]["code"] == "config_conflict"


async def test_admin_can_upload_and_read_an_image(
    hass,
    hass_client,
    hass_client_no_auth,
) -> None:
    await _setup_yaml(hass)
    client = await hass_client()
    response = await client.post(
        "/api/floorplan_ui/assets",
        data=PNG,
        headers={"Content-Type": "image/png"},
    )
    assert response.status == HTTPStatus.CREATED
    asset = await response.json()
    assert len(asset["asset_id"]) == 64

    image_client = await hass_client_no_auth()
    image_response = await image_client.get(asset["url"])
    assert image_response.status == HTTPStatus.OK
    assert await image_response.read() == PNG
    assert image_response.headers["X-Content-Type-Options"] == "nosniff"


async def test_upload_size_and_magic_are_enforced(
    hass,
    hass_client,
) -> None:
    await _setup_yaml(hass)
    client = await hass_client()

    oversized = await client.post(
        "/api/floorplan_ui/assets",
        data=b"x" * (MAX_IMAGE_FILE_BYTES + 1),
        headers={"Content-Type": "image/png"},
    )
    assert oversized.status == HTTPStatus.REQUEST_ENTITY_TOO_LARGE

    wrong_magic = await client.post(
        "/api/floorplan_ui/assets",
        data=b"not a png",
        headers={"Content-Type": "image/png"},
    )
    assert wrong_magic.status == HTTPStatus.BAD_REQUEST


async def test_viewer_cannot_upload(
    hass,
    hass_client,
    hass_read_only_access_token,
) -> None:
    await _setup_yaml(hass)
    client = await hass_client(hass_read_only_access_token)
    response = await client.post(
        "/api/floorplan_ui/assets",
        data=PNG,
        headers={"Content-Type": "image/png"},
    )

    assert response.status == HTTPStatus.UNAUTHORIZED
