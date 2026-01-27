/**
 * Floorplan UI - Main entry point
 * Registers the custom panel element for Home Assistant
 */

import { FloorplanPanel } from "./components/floorplan-panel";

// Register the custom element
customElements.define("floorplan-ui-panel", FloorplanPanel);

// Log that the panel has loaded
console.info("%c FLOORPLAN-UI %c loaded ", "background: #3498db; color: white", "");
