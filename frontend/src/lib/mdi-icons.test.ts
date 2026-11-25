// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import type { HassEntity, HassEntityRegistry } from "../types/home-assistant";
import {
  resolveMdiIconName,
  getMdiIconPath,
  resolveDynamicMdiPath,
  createMdiSvgDataUri,
  MDI_ICON_SUGGESTIONS,
} from "./mdi-icons";
const state: HassEntity = {
  last_changed: "",
  last_updated: "",
  context: { id: "", parent_id: null, user_id: null },
  entity_id: "binary_sensor.front",
  state: "on",
  attributes: { device_class: "door", icon: "mdi:bell" },
};
describe("MDI rendering", () => {
  it("resolves marker, state, registry, then state-aware defaults", () => {
    const registry = { icon: "mdi:cctv" } as HassEntityRegistry;
    expect(resolveMdiIconName("mdi:circle", state, registry)).toBe("mdi:circle");
    expect(resolveMdiIconName(" ", state, registry)).toBe("mdi:bell");
    const door = { ...state, attributes: { device_class: "door" } };
    expect(resolveMdiIconName(undefined, door, registry)).toBe("mdi:cctv");
    expect(resolveMdiIconName(undefined, door)).toBe("mdi:door-open");
    expect(resolveMdiIconName(undefined, { ...door, state: "off" })).toBe("mdi:door-closed");
    expect(resolveMdiIconName(undefined, undefined, undefined, "camera.drive")).toBe("mdi:cctv");
  });
  it("provides bundled paths, a safe SVG data URI and graceful misses", async () => {
    expect(MDI_ICON_SUGGESTIONS.length).toBeGreaterThanOrEqual(90);
    for (const name of MDI_ICON_SUGGESTIONS) expect(getMdiIconPath(name)).toMatch(/^M/i);
    expect(await resolveDynamicMdiPath("mdi:lamp")).toBe(getMdiIconPath("lamp"));
    expect(await resolveDynamicMdiPath("mdi:unbundled")).toBeNull();
    const xml = decodeURIComponent(createMdiSvgDataUri("M1 2", 'red" data-x="bad').split(",")[1]);
    const path = new DOMParser().parseFromString(xml, "image/svg+xml").querySelector("path");
    expect(path?.getAttribute("d")).toBe("M1 2");
    expect(path?.hasAttribute("data-x")).toBe(false);
  });
  it("waits for nested shadow DOM and reuses its cached path", async () => {
    let renders = 0;
    customElements.define(
      "ha-icon",
      class extends HTMLElement {
        connectedCallback() {
          renders++;
          const root = this.attachShadow({ mode: "open" });
          const inner = document.createElement("span");
          root.append(inner);
          setTimeout(() => {
            inner.attachShadow({ mode: "open" }).innerHTML = '<svg><path d="M1 1Z"/></svg>';
          }, 5);
        }
      }
    );
    expect(
      await Promise.all([
        resolveDynamicMdiPath("mdi:test-live"),
        resolveDynamicMdiPath("test-live"),
      ])
    ).toEqual(["M1 1Z", "M1 1Z"]);
    expect(getMdiIconPath("mdi:test-live")).toBe("M1 1Z");
    expect(renders).toBe(1);
    expect(document.querySelector("ha-icon")).toBeNull();
  });
});
