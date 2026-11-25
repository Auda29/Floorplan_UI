import type {
  Anchor3DShape,
  AreaShape,
  FloorplanConfig,
  MeshShape,
  Vec3,
} from "../types/home-assistant";

export interface AreaGeometryUpdate {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  points?: number[];
}

export function createArea(
  areaId: string,
  type: "rect" | "polygon",
  center: { x: number; y: number }
): AreaShape {
  return areaWithShape(
    areaId,
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
        }
  );
}

export function createMeshArea(areaId: string, meshName: string, anchor?: Vec3): AreaShape {
  return areaWithShape(areaId, {
    type: "mesh",
    mesh_name: meshName,
    ...(anchor && { anchor: { ...anchor } }),
  });
}

export function createAnchor3DArea(areaId: string, pos: Vec3): AreaShape {
  return areaWithShape(areaId, { ...pos, type: "anchor3d" });
}

function areaWithShape(areaId: string, shape: AreaShape["shape"]): AreaShape {
  return {
    id: areaId,
    area_id: "",
    shape,
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
  updates: AreaGeometryUpdate | MeshShape | Anchor3DShape
): FloorplanConfig {
  return updateArea(config, planId, areaId, (area) => {
    if ("type" in updates) {
      if (area.shape.type !== "mesh" && area.shape.type !== "anchor3d") return area;
      return { ...area, shape: updates };
    }
    if (area.shape.type === "rect") {
      const { x, y, width, height } = updates;
      return {
        ...area,
        shape: {
          ...area.shape,
          ...(x === undefined ? {} : { x }),
          ...(y === undefined ? {} : { y }),
          ...(width === undefined ? {} : { width }),
          ...(height === undefined ? {} : { height }),
        },
      };
    }

    if (area.shape.type !== "polygon") return area;
    const { x, y, points } = updates;
    return {
      ...area,
      shape: {
        ...area.shape,
        ...(x === undefined ? {} : { x }),
        ...(y === undefined ? {} : { y }),
        ...(points && points.length >= 6 ? { points } : {}),
      },
    };
  });
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
