import type { HassArea, HassEntity, HassEntityRegistry } from "../types/home-assistant";
export type DiagnosticSeverity = "warning" | "error";
export type DiagnosticCategory =
  | "missing_entity"
  | "unavailable_entity"
  | "unbound_area"
  | "missing_area"
  | "invalid_binding"
  | "missing_background"
  | "missing_mesh"
  | "overlay_missing_entity";
export interface ConfigDiagnostic {
  id: string;
  severity: DiagnosticSeverity;
  category: DiagnosticCategory;
  planId?: string;
  planName?: string;
  viewId?: string;
  viewName?: string;
  targetType?: "marker" | "area" | "plan" | "view";
  targetId?: string;
  entityId?: string;
  areaId?: string;
  meshName?: string;
  attr?: string;
  messageKey: string;
  params: Record<string, string | number>;
}
interface Binding {
  source?: string;
  attr?: string;
}
interface DiagnosticPlan {
  plan_id: string;
  name: string;
  background: { asset_id?: string; url?: string };
  areas: readonly {
    id: string;
    area_id?: string | null;
    shape: { type: string; mesh_name?: string };
  }[];
  markers: readonly {
    id: string;
    entity_id: string;
    area_id?: string | null;
    bind?: { primary?: Binding; secondary?: Binding };
  }[];
}
interface Overlay {
  primary?: { mode: string; entity_id?: string };
  secondary?: { mode: string; entity_id?: string };
  badges?: readonly { entity_id: string }[];
}
interface DiagnosticView {
  id: string;
  name: string;
  area_overlay?: Overlay;
  marker_overlay?: Overlay;
}
interface DiagnosticsInput {
  plans: readonly DiagnosticPlan[];
  views: readonly DiagnosticView[];
  states: Record<string, Pick<HassEntity, "state" | "attributes">>;
  entities: readonly Pick<HassEntityRegistry, "entity_id">[];
  haAreas: readonly Pick<HassArea, "id">[];
  availableMeshesByPlan?: ReadonlyMap<string, ReadonlySet<string> | readonly string[]>;
}
type Location = Pick<
  ConfigDiagnostic,
  "planId" | "planName" | "viewId" | "viewName" | "targetId" | "targetType"
>;
type Details = Pick<ConfigDiagnostic, "areaId" | "entityId" | "attr" | "meshName">;
export function analyzeConfigDiagnostics({
  plans,
  views,
  states,
  entities,
  haAreas,
  availableMeshesByPlan,
}: DiagnosticsInput): ConfigDiagnostic[] {
  const diagnostics: ConfigDiagnostic[] = [];
  const areaIds = new Set(haAreas.map((area) => area.id));
  const registered = new Set(entities.map((entity) => entity.entity_id));
  const statesLoaded = Object.keys(states).length > 0;
  const missing = (id: string) =>
    !Object.prototype.hasOwnProperty.call(states, id) && (statesLoaded || !registered.has(id));
  function report(
    category: DiagnosticCategory,
    location: Location,
    details: Details = {},
    slot = ""
  ) {
    const id = JSON.stringify([
      location.planId,
      location.viewId,
      location.targetType,
      location.targetId,
      category,
      slot,
    ]);
    const severity =
      category === "missing_background" || category === "missing_entity" ? "error" : "warning";
    diagnostics.push({
      id,
      category,
      severity,
      ...location,
      ...details,
      messageKey: "diagnostics." + category,
      params: { ...location, ...details, ...(slot ? { slot } : {}) },
    });
  }
  for (const plan of plans) {
    const base = { planId: plan.plan_id, planName: plan.name };
    if (!plan.background.asset_id && !plan.background.url)
      report("missing_background", { ...base, targetType: "plan", targetId: plan.plan_id });
    const meshes = availableMeshesByPlan?.get(plan.plan_id);
    const meshNames = meshes && new Set(meshes);
    for (const area of plan.areas) {
      const location = { ...base, targetType: "area", targetId: area.id } as const;
      if (!area.area_id?.trim()) report("unbound_area", location);
      else if (areaIds.size && !areaIds.has(area.area_id))
        report("missing_area", location, { areaId: area.area_id });
      if (area.shape.type === "mesh" && meshNames && !meshNames.has(area.shape.mesh_name ?? ""))
        report("missing_mesh", location, { meshName: area.shape.mesh_name ?? "" });
    }
    for (const marker of plan.markers) {
      const location = { ...base, targetType: "marker", targetId: marker.id } as const;
      const entityId = marker.entity_id;
      if (marker.area_id && areaIds.size && !areaIds.has(marker.area_id))
        report("missing_area", location, { areaId: marker.area_id });
      const state = states[entityId];
      if (missing(entityId)) report("missing_entity", location, { entityId });
      else if (state) {
        if (["unavailable", "unknown"].includes(state.state))
          report("unavailable_entity", location, { entityId });
        else
          for (const slot of ["primary", "secondary"] as const) {
            const binding = marker.bind?.[slot];
            if (
              binding?.source === "attr" &&
              !Object.prototype.hasOwnProperty.call(state.attributes, binding.attr ?? "")
            )
              report("invalid_binding", location, { entityId, attr: binding.attr ?? "" }, slot);
          }
      }
    }
  }
  for (const view of views) {
    const location = {
      viewId: view.id,
      viewName: view.name,
      targetType: "view",
      targetId: view.id,
    } as const;
    for (const key of ["area_overlay", "marker_overlay"] as const) {
      const overlay = view[key];
      if (!overlay) continue;
      for (const slot of ["primary", "secondary"] as const) {
        const spec = overlay[slot];
        if (spec?.mode === "entity" && missing(spec.entity_id ?? ""))
          report(
            "overlay_missing_entity",
            location,
            { entityId: spec.entity_id ?? "" },
            key + "." + slot
          );
      }
      overlay.badges?.forEach((badge, index) => {
        if (missing(badge.entity_id))
          report(
            "overlay_missing_entity",
            location,
            { entityId: badge.entity_id },
            key + ".badges." + index
          );
      });
    }
  }
  return diagnostics;
}
