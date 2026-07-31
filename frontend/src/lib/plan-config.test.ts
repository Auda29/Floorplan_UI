import { describe, expect, it } from "vitest";
import type { FloorplanConfig, Plan } from "../types/home-assistant";
import { addPlan, createPlan, removePlan, renamePlan } from "./plan-config";

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

  it("returns null when the requested plan does not exist", () => {
    expect(removePlan(config(), "missing")).toBeNull();
  });
});
