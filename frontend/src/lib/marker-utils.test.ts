import { describe, expect, it } from "vitest";

import type { HassEntity, Marker, View } from "../types/home-assistant";
import {
  getEntityDisplayName,
  getMarkerLabel,
  getMarkerValue,
  markerMatchesView,
} from "./marker-utils";

const marker: Marker = {
  id: "marker-1",
  entity_id: "light.kitchen",
  area_id: "kitchen",
  pos: { x: 100, y: 120 },
  icon: "mdi:lightbulb",
  label_mode: "auto",
  tags: ["lights", "downstairs"],
  bind: { primary: { source: "state" } },
};

const state: HassEntity = {
  entity_id: marker.entity_id,
  state: "on",
  attributes: { friendly_name: "Kitchen light", brightness: 180 },
  last_changed: "2026-01-01T00:00:00Z",
  last_updated: "2026-01-01T00:00:00Z",
  context: { id: "1", parent_id: null, user_id: null },
};

function view(filters: View["filters"]): View {
  return { id: "test", name: "Test", filters };
}

describe("marker view filtering", () => {
  it("matches domain, tag and area filters", () => {
    expect(markerMatchesView(marker, view({ domains: ["light"] }))).toBe(true);
    expect(markerMatchesView(marker, view({ tags: ["lights"] }))).toBe(true);
    expect(markerMatchesView(marker, view({ area_ids: ["kitchen"] }))).toBe(true);
  });

  it("rejects non-matching filters", () => {
    expect(markerMatchesView(marker, view({ domains: ["sensor"] }))).toBe(false);
    expect(markerMatchesView(marker, view({ tags: ["heating"] }))).toBe(false);
    expect(markerMatchesView(marker, view({ area_ids: ["garage"] }))).toBe(false);
  });
});

describe("marker display values", () => {
  it("uses the friendly name and state by default", () => {
    expect(getEntityDisplayName(marker, state)).toBe("Kitchen light");
    expect(getMarkerValue(marker, state)).toBe("on");
  });

  it("reads and formats attributes", () => {
    const attributeMarker: Marker = {
      ...marker,
      bind: {
        primary: { source: "attr", attr: "brightness", format: "{value} lx" },
      },
    };
    expect(getMarkerValue(attributeMarker, state)).toBe("180 lx");
  });

  it("handles missing entities", () => {
    expect(getMarkerValue(marker, undefined)).toBe("Unavailable");
  });

  it("keeps the configured label mode during live updates", () => {
    expect(getMarkerLabel({ ...marker, label_mode: "short" }, state)).toBe("kitchen");
    expect(getMarkerLabel({ ...marker, label_mode: "off" }, state)).toBe("");
  });
});
