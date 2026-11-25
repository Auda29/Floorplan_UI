import { describe, expect, it } from "vitest";
import { analyzeConfigDiagnostics } from "./config-diagnostics";
const binding = { source: "attr", attr: "battery" };
const plan = {
  plan_id: "p",
  name: "Floor",
  background: {},
  areas: [
    { id: "a", area_id: null, shape: { type: "rect" } },
    { id: "b", area_id: "removed", shape: { type: "mesh", mesh_name: "wall" } },
  ],
  markers: [
    { id: "m", entity_id: "sensor.missing", area_id: "removed" },
    { id: "u", entity_id: "sensor.offline", bind: { primary: binding } },
    { id: "b", entity_id: "sensor.live", bind: { primary: binding, secondary: binding } },
  ],
};
const value = { mode: "entity", entity_id: "sensor.missing" };
const view = {
  id: "v",
  name: "View",
  area_overlay: { primary: value, badges: [value, value] },
  marker_overlay: { primary: { mode: "aggregate" }, secondary: value },
};
const input = {
  plans: [plan],
  views: [view],
  haAreas: [{ id: "room" }],
  entities: [{ entity_id: "sensor.missing" }],
  states: {
    "sensor.offline": { state: "unknown", attributes: {} },
    "sensor.live": { state: "2", attributes: {} },
  },
};
describe("config diagnostics", () => {
  it("reports all targets with severity and unique stable locations", () => {
    const diagnostics = analyzeConfigDiagnostics({
      ...input,
      availableMeshesByPlan: new Map([["p", []]]),
    });
    const categories = diagnostics.map((item) => item.category);
    expect(categories.sort()).toEqual(
      [
        "missing_background",
        "unbound_area",
        "missing_area",
        "missing_mesh",
        "missing_area",
        "missing_entity",
        "unavailable_entity",
        "invalid_binding",
        "invalid_binding",
        ...Array(4).fill("overlay_missing_entity"),
      ].sort()
    );
    expect(new Set(diagnostics.map((item) => item.id)).size).toBe(diagnostics.length);
    expect(
      diagnostics.filter((item) => item.severity === "error").map((item) => item.category)
    ).toEqual(["missing_background", "missing_entity"]);
    expect(diagnostics.find((item) => item.category === "missing_mesh")).toMatchObject({
      planId: "p",
      targetId: "b",
      meshName: "wall",
    });
  });
  it("uses registry fallback and waits for loaded area and mesh inventories", () => {
    const results = analyzeConfigDiagnostics({ ...input, states: {}, haAreas: [] });
    expect(results.map((item) => item.category)).toEqual([
      "missing_background",
      "unbound_area",
      "missing_entity",
      "missing_entity",
    ]);
  });
  it("accepts known assets, meshes, areas and attributes with falsy values", () => {
    const results = analyzeConfigDiagnostics({
      ...input,
      views: [],
      plans: [
        {
          ...plan,
          background: { asset_id: "asset" },
          areas: [plan.areas[1]],
          markers: [plan.markers[2]],
        },
      ],
      availableMeshesByPlan: new Map([["p", new Set(["wall"])]]),
      haAreas: [{ id: "removed" }],
      states: { "sensor.live": { state: "ok", attributes: { battery: 0 } } },
    });
    expect(results).toEqual([]);
  });
});
