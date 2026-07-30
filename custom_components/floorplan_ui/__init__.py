"""Floorplan UI - A visual floorplan editor for Home Assistant."""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType

from .const import (
    DOMAIN,
    INTEGRATION_VERSION,
    PANEL_ICON,
    PANEL_TITLE,
    PANEL_URL,
    STATIC_URL,
)
from .store import FloorplanStore
from .websocket import async_register_websocket_commands

_LOGGER = logging.getLogger(__name__)

FRONTEND_PATH = Path(__file__).parent / "frontend"
FRONTEND_BUNDLE = FRONTEND_PATH / "floorplan-ui.js"


async def _async_register_panel(hass: HomeAssistant) -> bool:
    """Register the panel once the integration is configured."""
    domain_data = hass.data[DOMAIN]
    if domain_data.get("panel_registered"):
        return True

    if not FRONTEND_BUNDLE.is_file():
        _LOGGER.error(
            "Floorplan UI frontend bundle is missing at %s. Reinstall the integration",
            FRONTEND_BUNDLE,
        )
        return False

    frontend.async_register_built_in_panel(
        hass,
        component_name="custom",
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        frontend_url_path=PANEL_URL,
        config={
            "_panel_custom": {
                "name": "floorplan-ui-panel",
                "embed_iframe": False,
                "trust_external": False,
                "module_url": (
                    f"{STATIC_URL}/floorplan-ui.js?v={INTEGRATION_VERSION}"
                ),
            }
        },
        require_admin=False,
    )
    domain_data["panel_registered"] = True
    return True


def _remove_panel(hass: HomeAssistant) -> None:
    """Remove the panel if it is currently registered."""
    domain_data = hass.data.get(DOMAIN)
    if not domain_data or not domain_data.get("panel_registered"):
        return

    frontend.async_remove_panel(hass, PANEL_URL)
    domain_data["panel_registered"] = False


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the Floorplan UI component."""
    hass.data[DOMAIN] = {
        "store": FloorplanStore(hass),
        "panel_registered": False,
    }

    await hass.http.async_register_static_paths(
        [StaticPathConfig(STATIC_URL, str(FRONTEND_PATH), True)]
    )
    async_register_websocket_commands(hass)

    if DOMAIN in config and not await _async_register_panel(hass):
        return False

    _LOGGER.info("Floorplan UI component loaded")
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Floorplan UI from a config entry."""
    return await _async_register_panel(hass)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a Floorplan UI config entry."""
    other_entries = [
        loaded_entry
        for loaded_entry in hass.config_entries.async_loaded_entries(DOMAIN)
        if loaded_entry.entry_id != entry.entry_id
    ]
    if not other_entries:
        _remove_panel(hass)
    return True


async def async_unload(hass: HomeAssistant) -> bool:
    """Unload a YAML-configured Floorplan UI component."""
    _remove_panel(hass)
    return True
