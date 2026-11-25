import { describe, expect, it } from "vitest";
import type { CameraPreset, FloorplanConfig, ModelBackground, Plan } from "../types/home-assistant";
import { createArea, createMeshArea } from "./area-config";
import {
  addCameraPreset,
  addPlan,
  createPlan,
  is3DPlan,
  removeCameraPreset,
  removePlan,
  renamePlan,
  replacePlanBackground,
  updatePlanView,
} from "./plan-config";

function config(plans: Plan[] = []): FloorplanConfig {
  return {
    version: 3,
    revision: 4,
    plans,
    views: [{ id: "all", name: "All", filters: {} }],
  };
}

const background = {
  type: "image" as const,
  asset_id: "a".repeat(64),
  content_type: "image/png" as const,
  width: 800,
  height: 600,
};

const model: ModelBackground = { type: "model", unit_scale: 1 };
const preset: CameraPreset = {
  id: "entry",
  name: "Entry",
  mode: "perspective",
  position: { x: 1, y: 4, z: 3 },
  target: { x: 0, y: 0, z: 0 },
};

describe("plan config", () => {
  it("creates a plan from an uploaded image", () => {
    const plan = createPlan("plan-1", "Ground.floor.png", background);
    expect(plan).toEqual({
      plan_id: "plan-1",
      name: "Ground.floor",
      background,
      areas: [],
      markers: [],
      view: { minZoom: 0.1, maxZoom: 5 },
    });
  });

  it("adds and renames a plan without mutating the input", () => {
    const original = config();
    const withPlan = addPlan(original, createPlan("plan-1", "Ground.png", background));
    const renamed = renamePlan(withPlan, "plan-1", "Ground floor");

    expect(original.plans).toEqual([]);
    expect(withPlan.plans[0].name).toBe("Ground");
    expect(renamed.plans[0].name).toBe("Ground floor");
  });

  it("removes a plan and selects the first remaining plan", () => {
    const first = createPlan("first", "First.png", background);
    const second = createPlan("second", "Second.png", background);
    const result = removePlan(config([first, second]), "first");

    expect(result?.config.plans).toEqual([second]);
    expect(result?.nextPlanId).toBe("second");
  });

  it("keeps all areas and markers at their relative positions after replacing a plan image", () => {
    const plan = createPlan("ground", "Ground.png", background);
    plan.markers.push({
      id: "light",
      entity_id: "light.kitchen",
      pos: { x: 200, y: 150 },
      label_mode: "auto",
      tags: [],
      bind: { primary: { source: "state" } },
    });
    plan.areas.push(
      createArea("kitchen", "rect", { x: 200, y: 180 }),
      createArea("hall", "polygon", { x: 500, y: 200 })
    );
    const replacement = { ...background, asset_id: "b".repeat(64), width: 1600, height: 300 };
    const [result] = replacePlanBackground(config([plan]), plan, replacement).plans;
    expect(result.background).toEqual(replacement);
    expect(result.markers[0].pos).toEqual({ x: 400, y: 75 });
    expect(result.areas[0].shape).toEqual({ type: "rect", x: 160, y: 50, width: 480, height: 80 });
    expect(result.areas[1].shape).toEqual({
      type: "polygon",
      x: 1000,
      y: 100,
      points: [-240, -35, 200, -45, 280, 30, -160, 45],
    });
    expect(plan.markers[0].pos).toEqual({ x: 200, y: 150 });
    expect(plan.background).toBe(background);
  });

  it("returns null when the requested plan does not exist", () => {
    expect(removePlan(config(), "missing")).toBeNull();
  });

  it("creates model defaults and keeps 3D geometry and view when replacing a model", () => {
    const plan = createPlan("ground", "Ground.glb", model);
    expect(is3DPlan(plan)).toBe(true);
    expect(is3DPlan(null)).toBe(false);
    expect(is3DPlan(undefined)).toBe(false);
    expect(is3DPlan(createPlan("image", "Ground.png", background))).toBe(false);
    expect(plan.view).toEqual({
      minZoom: 0.1,
      maxZoom: 5,
      shadows: false,
      lighting: true,
      camera_mode: "ortho",
    });
    plan.view.camera_presets = [preset];
    plan.areas.push(createMeshArea("kitchen", "Kitchen"));
    plan.markers.push({
      id: "light",
      entity_id: "light.kitchen",
      pos: { x: 1, y: 2, z: 3 },
      label_mode: "auto",
      tags: [],
      bind: { primary: { source: "state" } },
    });
    const replacement = { ...model, unit_scale: 2 };
    const [updated] = replacePlanBackground(config([plan]), plan, replacement).plans;
    expect(updated).toEqual({ ...plan, background: replacement });
    expect(updated.view).toBe(plan.view);

    const [image] = replacePlanBackground(config([plan]), plan, background).plans;
    expect(image).toMatchObject({ background, areas: [], markers: [] });
    expect(image.view).toEqual({ minZoom: 0.1, maxZoom: 5 });
    image.areas.push(createArea("kitchen", "rect", { x: 0, y: 0 }));
    const [converted] = replacePlanBackground(config([image]), image, model).plans;
    expect(converted).toMatchObject({ background: model, areas: [], markers: [] });
    expect(converted.view).toMatchObject({ camera_mode: "ortho", lighting: true });
  });

  it("patches the targeted view and limits camera presets to 20", () => {
    const original = config([createPlan("a", "A.glb", model), createPlan("b", "B.glb", model)]);
    const patched = updatePlanView(original, "a", { shadows: true, maxZoom: 4 });
    expect(patched.plans[0].view).toMatchObject({ minZoom: 0.1, maxZoom: 4, shadows: true });
    expect(patched.plans[1]).toBe(original.plans[1]);
    expect(original.plans[0].view).toMatchObject({ maxZoom: 5, shadows: false });
    let filled = patched;
    for (let index = 0; index < 20; index++) {
      filled = addCameraPreset(filled, "a", { ...preset, id: String(index) });
    }
    expect(filled.plans[0].view.camera_presets).toHaveLength(20);
    expect(patched.plans[0].view.camera_presets).toBeUndefined();
    expect(addCameraPreset(filled, "a", preset)).toBe(filled);
    const removed = removeCameraPreset(filled, "a", "0");
    expect(removed.plans[0].view.camera_presets?.[0].id).toBe("1");
    expect(removed.plans[0].view.camera_presets).toHaveLength(19);
    expect(filled.plans[0].view.camera_presets).toHaveLength(20);
  });
});
