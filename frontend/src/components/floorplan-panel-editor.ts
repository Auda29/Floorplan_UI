import type {
  AreaShape,
  HassEntity,
  HassEntityRegistry,
  Marker,
  View,
} from "../types/home-assistant";
import * as mutations from "../lib/panel-config-mutations";
import {
  renderFloorplanEditor,
  type FloorplanEditorActions,
  type FloorplanEditorModel,
} from "./floorplan-editor";
import type { ViewportRenderState } from "../lib/viewport-types";
import type { Localize } from "../lib/i18n";
import type { FloorplanConfig } from "../types/home-assistant";
import { updateArea } from "../lib/area-config";
import { updateMarker } from "../lib/marker-config";
import { updateView } from "../lib/view-config";

function fieldValue(event: Event): string {
  return (event.target as HTMLInputElement).value;
}
function checked(event: Event): boolean {
  return (event.target as HTMLInputElement).checked;
}

function filterPanelEntities(
  entities: HassEntityRegistry[],
  search: string,
  selectedDomain: string,
  selectedArea: string
): HassEntityRegistry[] {
  const query = search.trim().toLowerCase();
  return entities.filter(
    ({ entity_id, name, domain, area_id }) =>
      (!query || entity_id.toLowerCase().includes(query) || name?.toLowerCase().includes(query)) &&
      (!selectedDomain || domain === selectedDomain) &&
      (!selectedArea || area_id === selectedArea)
  );
}

type MutationActions = Pick<
  FloorplanEditorActions,
  | "updateViewFilter"
  | "updateAreaOverlay"
  | "updateAreaOverlayMode"
  | "updateAreaOverlayAggregate"
  | "updateAreaBadges"
  | "updateViewStyle"
  | "updateViewCameraPreset"
  | "bindArea"
  | "updateAreaTags"
  | "updateAreaStyle"
  | "updateAreaMesh"
  | "updateMarkerIcon"
  | "updateMarkerTags"
  | "updateMarkerArea"
  | "updateMarkerLabelMode"
  | "updateMarkerAction"
  | "updateMarkerBinding"
>;

function panelEditorMutationActions(
  selectedMarker: Marker | null,
  changeView: (mutate: (view: View) => View) => void,
  changeArea: (mutate: (area: AreaShape) => AreaShape) => void,
  changeMarker: (updates: Partial<Marker>) => void
): MutationActions {
  return {
    updateViewFilter: (field, event) =>
      changeView((view) => mutations.updateViewFilter(view, field, fieldValue(event))),
    updateAreaOverlay: (slot, field, event) =>
      changeView((view) => mutations.updateAreaOverlayValue(view, slot, field, fieldValue(event))),
    updateAreaOverlayMode: (slot, event) =>
      changeView((view) => mutations.updateAreaOverlayMode(view, slot, fieldValue(event))),
    updateAreaOverlayAggregate: (slot, field, event) =>
      changeView((view) =>
        mutations.updateAreaOverlayAggregate(view, slot, field, fieldValue(event))
      ),
    updateAreaBadges: (event) =>
      changeView((view) => mutations.updateAreaBadges(view, fieldValue(event))),
    updateViewStyle: (field, event) =>
      changeView((view) =>
        mutations.updateViewStyle(
          view,
          field,
          (event.target as HTMLInputElement).type === "checkbox"
            ? checked(event)
            : fieldValue(event)
        )
      ),
    updateViewCameraPreset: (event) => {
      changeView((view) => ({ ...view, camera_preset_id: fieldValue(event) || undefined }));
    },
    bindArea: (event) => changeArea((area) => ({ ...area, area_id: fieldValue(event) })),
    updateAreaTags: (event) =>
      changeArea((area) => ({ ...area, tags: mutations.parseTags(fieldValue(event)) })),
    updateAreaStyle: (field, event) =>
      changeArea((area) => mutations.updateAreaStyle(area, field, fieldValue(event))),
    updateAreaMesh: (event) =>
      changeArea((area) => {
        const mesh_name = fieldValue(event).trim();
        return area.shape.type === "mesh" && mesh_name
          ? { ...area, shape: { type: "mesh", mesh_name } }
          : area;
      }),
    updateMarkerIcon: (event) => changeMarker({ icon: fieldValue(event).trim() || undefined }),
    updateMarkerTags: (event) => changeMarker({ tags: mutations.parseTags(fieldValue(event)) }),
    updateMarkerArea: (event) => changeMarker({ area_id: fieldValue(event) || null }),
    updateMarkerLabelMode: (event) =>
      changeMarker({ label_mode: fieldValue(event) as Marker["label_mode"] }),
    updateMarkerAction: (event) => {
      const tap = fieldValue(event);
      if (tap === "more-info" || tap === "toggle" || tap === "none") {
        changeMarker({ action: { ...selectedMarker?.action, tap } });
      }
    },
    updateMarkerBinding: (slot, field, event) => {
      if (selectedMarker)
        changeMarker({
          bind: mutations.updateMarkerBinding(selectedMarker, slot, field, fieldValue(event)),
        });
    },
  };
}

export function mergePanelEntities(
  states: Record<string, HassEntity>,
  registry: HassEntityRegistry[]
): HassEntityRegistry[] {
  const entities = new Map<string, HassEntityRegistry>();
  for (const state of Object.values(states)) {
    const { friendly_name: name, icon } = state.attributes;
    entities.set(state.entity_id, {
      entity_id: state.entity_id,
      name: typeof name === "string" ? name : null,
      icon: typeof icon === "string" ? icon : null,
      domain: state.entity_id.split(".", 1)[0],
      area_id: null,
      device_id: null,
    });
  }
  for (const entry of registry) {
    const state = entities.get(entry.entity_id);
    entities.set(entry.entity_id, {
      ...entry,
      name: entry.name ?? state?.name ?? null,
      icon: entry.icon ?? state?.icon ?? null,
    });
  }
  return [...entities.values()].sort((left, right) =>
    left.entity_id.localeCompare(right.entity_id, undefined, { numeric: true })
  );
}

type PanelEditorOptions = Omit<
  FloorplanEditorModel,
  | "areas"
  | "currentPlan"
  | "currentView"
  | "selectedArea"
  | "selectedMarker"
  | "entityCount"
  | "matchCount"
  | "entityDomains"
  | "entityOptions"
>;

export function renderPanelEditor(
  { plan, view, areas, entities, selectedAreaId, selectedMarkerId }: ViewportRenderState,
  options: PanelEditorOptions,
  actions: Omit<
    FloorplanEditorActions,
    keyof MutationActions | "addMarkerSecondaryBinding" | "removeMarkerSecondaryBinding"
  >,
  getConfig: () => FloorplanConfig | null,
  commit: (config: FloorplanConfig) => Promise<boolean>,
  t: Localize
) {
  const selectedArea = plan?.areas.find(({ id }) => id === selectedAreaId) ?? null;
  const selectedMarker = plan?.markers.find(({ id }) => id === selectedMarkerId) ?? null;
  const entityOptions = filterPanelEntities(
    entities,
    options.entitySearch,
    options.entityDomainFilter,
    options.entityAreaFilter
  );
  const changeView = (mutate: (view: View) => View) => {
    const config = getConfig();
    if (config && view) void commit(updateView(config, view.id, mutate));
  };
  const changeArea = (mutate: (area: AreaShape) => AreaShape) => {
    const config = getConfig();
    if (config && plan && selectedArea)
      void commit(updateArea(config, plan.plan_id, selectedArea.id, mutate));
  };
  const changeMarker = (updates: Partial<Marker>) => {
    const config = getConfig();
    if (config && plan && selectedMarker)
      void commit(updateMarker(config, plan.plan_id, selectedMarker.id, updates));
  };
  return renderFloorplanEditor(
    {
      ...options,
      currentPlan: plan,
      currentView: view,
      areas,
      selectedArea,
      selectedMarker,
      entityCount: entities.length,
      matchCount: entityOptions.length,
      entityOptions,
      entityDomains: [...new Set(entities.map(({ domain }) => domain))].sort(),
    },
    {
      ...actions,
      ...panelEditorMutationActions(selectedMarker, changeView, changeArea, changeMarker),
      addMarkerSecondaryBinding: () => {
        if (selectedMarker && !selectedMarker.bind.secondary) {
          changeMarker({ bind: { ...selectedMarker.bind, secondary: { source: "state" } } });
        }
      },
      removeMarkerSecondaryBinding: () => {
        if (selectedMarker) changeMarker({ bind: { primary: selectedMarker.bind.primary } });
      },
    },
    t
  );
}
