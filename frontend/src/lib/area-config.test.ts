import { describe, expect, it } from "vitest";
import type { FloorplanConfig, Plan } from "../types/home-assistant";
import {
  addArea,
  createAnchor3DArea,
  createArea,
  createMeshArea,
  removeArea,
  updateArea,
  updateAreaShape,
} from "./area-config";

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
    const beforeShape = withArea.plans[0].areas[0].shape;
    const afterShape = updated.plans[0].areas[0].shape;
    expect(beforeShape.type).toBe("rect");
    expect(afterShape.type).toBe("rect");
    if (beforeShape.type !== "rect" || afterShape.type !== "rect") {
      throw new Error("Expected rectangle geometry");
    }
    expect(beforeShape.width).toBe(240);
    expect(afterShape.width).toBe(300);
  });

  it("creates mesh and anchor areas and applies explicit 3D geometry updates", () => {
    const position = { x: 1, y: 2, z: 3 };
    const mesh = createMeshArea("mesh", "Kitchen", position);
    const anchor = createAnchor3DArea("anchor", position);
    expect(mesh).toMatchObject({
      id: "mesh",
      shape: { type: "mesh", mesh_name: "Kitchen", anchor: position },
    });
    expect(createMeshArea("unanchored", "Kitchen").shape).toEqual({
      type: "mesh",
      mesh_name: "Kitchen",
    });
    expect(anchor.shape).toEqual({ type: "anchor3d", ...position });
    const original = config();
    original.plans[0].background = { type: "model" };
    original.plans[0].areas = [mesh, anchor];

    const ignored = updateAreaShape(original, "plan-1", mesh.id, {
      x: 99,
      points: [0, 0, 1, 1, 2, 2],
    });
    expect(ignored.plans[0].areas[0]).toBe(mesh);
    const changedShape = { type: "anchor3d" as const, ...position, z: 4 };
    const updated = updateAreaShape(original, "plan-1", anchor.id, changedShape);
    expect(updated.plans[0].areas[1].shape).toEqual(changedShape);
    expect(original.plans[0].areas[1].shape).toEqual({ type: "anchor3d", ...position });
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
