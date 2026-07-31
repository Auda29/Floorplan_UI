import { describe, expect, it } from "vitest";
import type { FloorplanConfig, Plan } from "../types/home-assistant";
import { addArea, createArea, removeArea, updateArea, updateAreaShape } from "./area-config";

function config(): FloorplanConfig {
  const plan: Plan = {
    plan_id: "plan-1",
    name: "Ground",
    background: { type: "image", width: 800, height: 600 },
    areas: [],
    markers: [],
    view: { minZoom: 0.1, maxZoom: 5 },
  };
  return {
    version: 3,
    revision: 2,
    plans: [plan],
    views: [{ id: "all", name: "All", filters: {} }],
  };
}

describe("area config", () => {
  it("creates centered rectangle and polygon defaults", () => {
    expect(createArea("rect", "rect", { x: 500, y: 400 }).shape).toMatchObject({
      type: "rect",
      x: 380,
      y: 320,
      width: 240,
      height: 160,
    });
    expect(createArea("polygon", "polygon", { x: 500, y: 400 }).shape).toMatchObject({
      type: "polygon",
      x: 500,
      y: 400,
    });
  });

  it("adds and updates area geometry immutably", () => {
    const original = config();
    const withArea = addArea(original, "plan-1", createArea("area-1", "rect", { x: 0, y: 0 }));
    const updated = updateAreaShape(withArea, "plan-1", "area-1", { width: 300 });

    expect(original.plans[0].areas).toEqual([]);
    expect(withArea.plans[0].areas[0].shape.width).toBe(240);
    expect(updated.plans[0].areas[0].shape.width).toBe(300);
  });

  it("updates area metadata and removes the area", () => {
    const withArea = addArea(config(), "plan-1", createArea("area-1", "rect", { x: 0, y: 0 }));
    const tagged = updateArea(withArea, "plan-1", "area-1", (area) => ({
      ...area,
      area_id: "living_room",
      tags: ["downstairs"],
    }));
    const removed = removeArea(tagged, "plan-1", "area-1");

    expect(tagged.plans[0].areas[0]).toMatchObject({
      area_id: "living_room",
      tags: ["downstairs"],
    });
    expect(removed.plans[0].areas).toEqual([]);
  });
});
