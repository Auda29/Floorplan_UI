import type { FloorplanBackground, FloorplanConfig, Plan } from "../types/home-assistant";

export function createPlan(
  planId: string,
  fileName: string,
  background: FloorplanBackground
): Plan {
  return {
    plan_id: planId,
    name: fileName.replace(/\.[^.]+$/, ""),
    background,
    areas: [],
    markers: [],
    view: { minZoom: 0.1, maxZoom: 5 },
  };
}

export function addPlan(config: FloorplanConfig, plan: Plan): FloorplanConfig {
  return {
    ...config,
    plans: [...config.plans, plan],
  };
}

export function renamePlan(config: FloorplanConfig, planId: string, name: string): FloorplanConfig {
  return {
    ...config,
    plans: config.plans.map((plan) => (plan.plan_id === planId ? { ...plan, name } : plan)),
  };
}

export function replacePlanBackground(
  config: FloorplanConfig,
  plan: Plan,
  background: FloorplanBackground
): FloorplanConfig {
  const scaleX = background.width / plan.background.width;
  const scaleY = background.height / plan.background.height;
  const updatedPlan: Plan = {
    ...plan,
    background,
    markers: plan.markers.map((marker) => ({
      ...marker,
      pos: { x: marker.pos.x * scaleX, y: marker.pos.y * scaleY },
    })),
    areas: plan.areas.map((area) => {
      const shape = area.shape;
      return {
        ...area,
        shape:
          shape.type === "rect"
            ? {
                ...shape,
                x: shape.x * scaleX,
                y: shape.y * scaleY,
                width: shape.width * scaleX,
                height: shape.height * scaleY,
              }
            : {
                ...shape,
                x: (shape.x ?? 0) * scaleX,
                y: (shape.y ?? 0) * scaleY,
                points: shape.points.map((point, index) => point * (index % 2 ? scaleY : scaleX)),
              },
      };
    }),
  };
  return {
    ...config,
    plans: config.plans.map((candidate) =>
      candidate.plan_id === plan.plan_id ? updatedPlan : candidate
    ),
  };
}

export function removePlan(
  config: FloorplanConfig,
  planId: string
): { config: FloorplanConfig; nextPlanId: string | null } | null {
  const plans = config.plans.filter((plan) => plan.plan_id !== planId);
  if (plans.length === config.plans.length) return null;
  return {
    config: { ...config, plans },
    nextPlanId: plans[0]?.plan_id ?? null,
  };
}
