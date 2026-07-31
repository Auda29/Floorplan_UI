import type { AreaShape, FloorplanConfig } from "../types/home-assistant";

export type AreaGeometryUpdate = Partial<
  Pick<AreaShape["shape"], "x" | "y" | "width" | "height" | "points">
>;

export function createArea(
  areaId: string,
  type: "rect" | "polygon",
  center: { x: number; y: number }
): AreaShape {
  return {
    id: areaId,
    area_id: "",
    shape:
      type === "polygon"
        ? {
            type: "polygon",
            x: center.x,
            y: center.y,
            points: [-120, -70, 100, -90, 140, 60, -80, 90],
          }
        : {
            type: "rect",
            x: center.x - 120,
            y: center.y - 80,
            width: 240,
            height: 160,
          },
    tags: [],
    style: {
      fillOpacity: 0.4,
      strokeWidth: 2,
      fill: "#2196f3",
      stroke: "#2196f3",
    },
  };
}

export function addArea(config: FloorplanConfig, planId: string, area: AreaShape): FloorplanConfig {
  return {
    ...config,
    plans: config.plans.map((plan) =>
      plan.plan_id === planId ? { ...plan, areas: [...plan.areas, area] } : plan
    ),
  };
}

export function updateArea(
  config: FloorplanConfig,
  planId: string,
  areaId: string,
  update: (area: AreaShape) => AreaShape
): FloorplanConfig {
  return {
    ...config,
    plans: config.plans.map((plan) =>
      plan.plan_id === planId
        ? {
            ...plan,
            areas: plan.areas.map((area) => (area.id === areaId ? update(area) : area)),
          }
        : plan
    ),
  };
}

export function updateAreaShape(
  config: FloorplanConfig,
  planId: string,
  areaId: string,
  updates: AreaGeometryUpdate
): FloorplanConfig {
  return updateArea(config, planId, areaId, (area) => ({
    ...area,
    shape: { ...area.shape, ...updates },
  }));
}

export function removeArea(
  config: FloorplanConfig,
  planId: string,
  areaId: string
): FloorplanConfig {
  return {
    ...config,
    plans: config.plans.map((plan) =>
      plan.plan_id === planId
        ? { ...plan, areas: plan.areas.filter((area) => area.id !== areaId) }
        : plan
    ),
  };
}
