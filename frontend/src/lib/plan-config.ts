import type {
  CameraPreset,
  FloorplanBackground,
  FloorplanConfig,
  Plan,
} from "../types/home-assistant";

export function is3DPlan(plan: Plan | null | undefined): boolean {
  return plan?.background.type === "model";
}

function defaultPlanView(type: FloorplanBackground["type"]): Plan["view"] {
  const zoom = { minZoom: 0.1, maxZoom: 5 };
  return type === "model"
    ? { ...zoom, shadows: false, lighting: true, camera_mode: "ortho" }
    : zoom;
}

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
    view: defaultPlanView(background.type),
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
  return updatePlan(config, plan.plan_id, () => {
    const updatedPlan = { ...plan, background };
    if (background.type !== plan.background.type) {
      const { minZoom, maxZoom } = plan.view;
      return {
        ...updatedPlan,
        view: { ...defaultPlanView(background.type), minZoom, maxZoom },
        markers: [],
        areas: [],
      };
    }
    if (background.type === "image" && plan.background.type === "image") {
      const scaleX = background.width / plan.background.width;
      const scaleY = background.height / plan.background.height;
      return scaleImageGeometry(updatedPlan, scaleX, scaleY);
    }
    return updatedPlan;
  });
}

function scaleImageGeometry(plan: Plan, scaleX: number, scaleY: number): Plan {
  const markers = plan.markers.map((marker) => ({
    ...marker,
    pos: { ...marker.pos, x: marker.pos.x * scaleX, y: marker.pos.y * scaleY },
  }));
  const areas = plan.areas.map((area) => {
    const { shape } = area;
    switch (shape.type) {
      case "rect":
        return {
          ...area,
          shape: {
            ...shape,
            x: shape.x * scaleX,
            y: shape.y * scaleY,
            width: shape.width * scaleX,
            height: shape.height * scaleY,
          },
        };
      case "polygon":
        return {
          ...area,
          shape: {
            ...shape,
            x: (shape.x ?? 0) * scaleX,
            y: (shape.y ?? 0) * scaleY,
            points: shape.points.map((point, index) => point * (index % 2 ? scaleY : scaleX)),
          },
        };
      default:
        return area;
    }
  });
  return { ...plan, markers, areas };
}

function updatePlan(
  config: FloorplanConfig,
  planId: string,
  update: (plan: Plan) => Plan
): FloorplanConfig {
  const index = config.plans.findIndex((plan) => plan.plan_id === planId);
  if (index === -1) return config;
  const plan = config.plans[index];
  const updated = update(plan);
  if (updated === plan) return config;
  const plans = [...config.plans];
  plans[index] = updated;
  return { ...config, plans };
}

export function updatePlanView(
  config: FloorplanConfig,
  planId: string,
  patch: Partial<Plan["view"]>
): FloorplanConfig {
  return updatePlan(config, planId, (plan) => ({ ...plan, view: { ...plan.view, ...patch } }));
}

export function addCameraPreset(
  config: FloorplanConfig,
  planId: string,
  preset: CameraPreset
): FloorplanConfig {
  return updatePlan(config, planId, (plan) => {
    const presets = plan.view.camera_presets ?? [];
    if (presets.length >= 20 || presets.some(({ id }) => id === preset.id)) return plan;
    return { ...plan, view: { ...plan.view, camera_presets: [...presets, preset] } };
  });
}

export function removeCameraPreset(
  config: FloorplanConfig,
  planId: string,
  presetId: string
): FloorplanConfig {
  return updatePlan(config, planId, (plan) => {
    const presets = plan.view.camera_presets ?? [];
    const remaining = presets.filter(({ id }) => id !== presetId);
    if (remaining.length === presets.length) return plan;
    return { ...plan, view: { ...plan.view, camera_presets: remaining } };
  });
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
