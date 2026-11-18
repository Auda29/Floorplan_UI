import { describe, expect, it } from "vitest";
import type { FloorplanConfig, Plan } from "../types/home-assistant";
import { createArea } from "./area-config";
import { addPlan, createPlan, removePlan, renamePlan, replacePlanBackground } from "./plan-config";

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
});
