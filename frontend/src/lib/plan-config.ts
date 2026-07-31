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
