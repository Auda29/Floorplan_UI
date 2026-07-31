/**
 * Floorplan UI - Main entry point
 * Registers the custom panel element for Home Assistant
 */

import { FloorplanPanel } from "./components/floorplan-panel";

// Avoid duplicate registration when the bundle is evaluated more than once.
if (!customElements.get("floorplan-ui-panel")) {
  customElements.define("floorplan-ui-panel", FloorplanPanel);
}
