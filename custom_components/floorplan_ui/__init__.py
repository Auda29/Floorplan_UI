"""Floorplan UI - A visual floorplan editor for Home Assistant."""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING

from homeassistant.components import frontend, websocket_api
from homeassistant.core import HomeAssistant

from .const import DOMAIN
from .store import FloorplanStore
from .websocket import async_register_websocket_commands

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry

_LOGGER = logging.getLogger(__name__)

PANEL_URL = "/floorplan-ui"
PANEL_TITLE = "Floorplan"
PANEL_ICON = "mdi:floor-plan"


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up the Floorplan UI component."""
    hass.data[DOMAIN] = {
        "store": FloorplanStore(hass),
    }

    # Register websocket commands
    async_register_websocket_commands(hass)

    # Register the panel
    frontend.async_register_built_in_panel(
        hass,
        component_name="custom",
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        frontend_url_path="floorplan-ui",
        config={
            "_panel_custom": {
                "name": "floorplan-ui-panel",
                "embed_iframe": False,
                "trust_external": False,
                "module_url": "/local/floorplan-ui/floorplan-ui.js?v=2",
            }
        },
        require_admin=False,
    )

    _LOGGER.info("Floorplan UI component loaded")
    return True


async def async_unload(hass: HomeAssistant) -> bool:
    """Unload the Floorplan UI component."""
    frontend.async_remove_panel(hass, "floorplan-ui")
    hass.data.pop(DOMAIN, None)
    return True
