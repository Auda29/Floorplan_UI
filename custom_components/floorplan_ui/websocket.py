"""WebSocket API for Floorplan UI."""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING, Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from .asset_view import signed_asset_path
from .const import DOMAIN
from .store import ConfigConflictError

if TYPE_CHECKING:
    from homeassistant.components.websocket_api import ActiveConnection

_LOGGER = logging.getLogger(__name__)


def _attach_asset_urls(hass: HomeAssistant, config: dict[str, Any]) -> None:
    """Add transient signed URLs to asset-backed backgrounds."""
    for plan in config.get("plans", []):
        background = plan.get("background", {})
        asset_id = background.get("asset_id")
        if asset_id:
            background["url"] = signed_asset_path(hass, asset_id)


def async_register_websocket_commands(hass: HomeAssistant) -> None:
    """Register WebSocket commands."""
    websocket_api.async_register_command(hass, websocket_get_config)
    websocket_api.async_register_command(hass, websocket_save_config)
    websocket_api.async_register_command(hass, websocket_validate_config)
    websocket_api.async_register_command(hass, websocket_list_registry)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "floorplan_ui/get_config",
    }
)
@websocket_api.async_response
async def websocket_get_config(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Get floorplan configuration."""
    store = hass.data[DOMAIN]["store"]
    config = await store.async_get_config()
    _attach_asset_urls(hass, config)
    connection.send_result(msg["id"], config)


@websocket_api.require_admin
@websocket_api.async_response
@websocket_api.websocket_command(
    {
        vol.Required("type"): "floorplan_ui/save_config",
        vol.Required("config"): dict,
        vol.Required("base_revision"): vol.All(int, vol.Range(min=0)),
    }
)
async def websocket_save_config(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Save floorplan configuration."""
    store = hass.data[DOMAIN]["store"]
    try:
        config = await store.async_update_config(
            msg["config"],
            msg["base_revision"],
        )
    except ConfigConflictError as err:
        connection.send_error(
            msg["id"],
            "config_conflict",
            str(err),
        )
        return
    except ValueError as err:
        _LOGGER.warning("Failed to save floorplan config: %s", err)
        connection.send_error(
            msg["id"],
            "invalid_config",
            str(err),
        )
        return

    connection.send_result(
        msg["id"],
        {
            "success": True,
            "revision": config["revision"],
        },
    )


@websocket_api.require_admin
@websocket_api.async_response
@websocket_api.websocket_command(
    {
        vol.Required("type"): "floorplan_ui/validate_config",
        vol.Required("config"): dict,
    }
)
async def websocket_validate_config(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Validate and normalize an imported configuration without saving it."""
    store = hass.data[DOMAIN]["store"]
    try:
        config = await store.async_validate_config(msg["config"])
    except ValueError as err:
        connection.send_error(msg["id"], "invalid_config", str(err))
        return
    _attach_asset_urls(hass, config)
    connection.send_result(msg["id"], {"config": config})


@websocket_api.require_admin
@websocket_api.async_response
@websocket_api.websocket_command(
    {
        vol.Required("type"): "floorplan_ui/list_registry",
        vol.Optional("filter_domain"): str,
        vol.Optional("filter_area"): str,
    }
)
async def websocket_list_registry(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """List areas, devices, and entities from HA registries."""
    from homeassistant.helpers import area_registry, device_registry, entity_registry

    area_reg = area_registry.async_get(hass)
    device_reg = device_registry.async_get(hass)
    entity_reg = entity_registry.async_get(hass)

    filter_domain = msg.get("filter_domain")
    filter_area = msg.get("filter_area")

    # Get areas
    areas = [
        {"id": area.id, "name": area.name, "icon": area.icon}
        for area in area_reg.async_list_areas()
    ]

    # Get entities with optional filtering
    entities = []
    for entity in entity_reg.entities.values():
        # Filter by domain if specified
        if filter_domain and not entity.entity_id.startswith(f"{filter_domain}."):
            continue

        # Get device for area info
        device = device_reg.async_get(entity.device_id) if entity.device_id else None
        entity_area_id = entity.area_id or (device.area_id if device else None)

        # Filter by area if specified
        if filter_area and entity_area_id != filter_area:
            continue

        entities.append(
            {
                "entity_id": entity.entity_id,
                "name": entity.name or entity.original_name,
                "icon": entity.icon or entity.original_icon,
                "area_id": entity_area_id,
                "device_id": entity.device_id,
                "domain": entity.domain,
            }
        )

    connection.send_result(
        msg["id"],
        {
            "areas": areas,
            "entities": entities,
        },
    )
