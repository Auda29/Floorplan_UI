import { html, type TemplateResult } from "lit";
import type {
  AreaShape,
  HassArea,
  HassEntityRegistry,
  Marker,
  Plan,
  View,
} from "../types/home-assistant";

type ViewFilterName = "domains" | "tags" | "area_ids";
type OverlaySlot = "primary" | "secondary";
type OverlayField = "entity_id" | "source" | "attr" | "format";
type AreaStyleField = "fill" | "stroke" | "fillOpacity" | "strokeWidth";
type MarkerBindingField = "source" | "attr" | "format";

export interface FloorplanEditorModel {
  currentPlan: Plan | null;
  currentView: View | undefined;
  currentViewId: string;
  selectedArea: AreaShape | null;
  selectedMarker: Marker | null;
  areas: HassArea[];
  entityCount: number;
  entityOptions: HassEntityRegistry[];
  entityDomains: string[];
  entitySearch: string;
  entityDomainFilter: string;
  entityAreaFilter: string;
  entityToAdd: string;
  canUndo: boolean;
  canRedo: boolean;
}

export interface FloorplanEditorActions {
  uploadImage(): void;
  undo(): void;
  redo(): void;
  renamePlan(): void;
  deletePlan(): void;
  addAreaRect(): void;
  addAreaPolygon(): void;
  addView(): void;
  renameView(): void;
  moveView(direction: -1 | 1): void;
  setDefaultView(): void;
  deleteView(): void;
  exportConfig(): void;
  importConfig(): void;
  setEntitySearch(value: string): void;
  setEntityDomainFilter(value: string): void;
  setEntityAreaFilter(value: string): void;
  setEntityToAdd(value: string): void;
  addMarker(): void;
  startEntityDrag(entityId: string, event: DragEvent): void;
  updateViewFilter(filterName: ViewFilterName, event: Event): void;
  updateAreaOverlay(slot: OverlaySlot, field: OverlayField, event: Event): void;
  updateAreaBadges(event: Event): void;
  bindArea(event: Event): void;
  updateAreaTags(event: Event): void;
  updateAreaStyle(field: AreaStyleField, event: Event): void;
  deleteArea(): void;
  updateMarkerTags(event: Event): void;
  updateMarkerArea(event: Event): void;
  updateMarkerLabelMode(event: Event): void;
  updateMarkerBinding(slot: OverlaySlot, field: MarkerBindingField, event: Event): void;
  addMarkerSecondaryBinding(): void;
  removeMarkerSecondaryBinding(): void;
  deleteMarker(): void;
}

export function renderFloorplanEditor(
  model: FloorplanEditorModel,
  actions: FloorplanEditorActions
): TemplateResult {
  const { currentPlan, currentView, currentViewId, selectedArea, selectedMarker } = model;
  return html`
    <div class="edit-toolbar">
      <button @click=${actions.uploadImage}>Upload Image</button>
      <button ?disabled=${!model.canUndo} @click=${actions.undo}>Undo</button>
      <button ?disabled=${!model.canRedo} @click=${actions.redo}>Redo</button>
      <button ?disabled=${!currentPlan} @click=${actions.renamePlan}>Rename Plan</button>
      <button ?disabled=${!currentPlan} @click=${actions.deletePlan}>Delete Plan</button>
      <button ?disabled=${!currentPlan} @click=${actions.addAreaRect}>+ Rectangle</button>
      <button ?disabled=${!currentPlan} @click=${actions.addAreaPolygon}>+ Polygon</button>
      <button @click=${actions.addView}>+ View</button>
      <button @click=${actions.renameView}>Rename View</button>
      <button @click=${() => actions.moveView(-1)}>← View</button>
      <button @click=${() => actions.moveView(1)}>View →</button>
      <button @click=${actions.setDefaultView}>Set Default</button>
      <button ?disabled=${currentViewId === "all"} @click=${actions.deleteView}>Delete View</button>
      <button @click=${actions.exportConfig}>Export JSON</button>
      <button @click=${actions.importConfig}>Import JSON</button>
    </div>
    <div class="edit-toolbar">
      <label>
        Search entity:
        <input
          class="grow"
          type="search"
          .value=${model.entitySearch}
          @input=${(event: Event) =>
            actions.setEntitySearch((event.target as HTMLInputElement).value)}
          placeholder="light.kitchen"
        />
      </label>
      <label>
        Domain:
        <select
          .value=${model.entityDomainFilter}
          @change=${(event: Event) =>
            actions.setEntityDomainFilter((event.target as HTMLSelectElement).value)}
        >
          <option value="">All domains</option>
          ${model.entityDomains.map((domain) => html`<option value=${domain}>${domain}</option>`)}
        </select>
      </label>
      <label>
        HA Area:
        <select
          .value=${model.entityAreaFilter}
          @change=${(event: Event) =>
            actions.setEntityAreaFilter((event.target as HTMLSelectElement).value)}
        >
          <option value="">All areas</option>
          ${model.areas.map((area) => html`<option value=${area.id}>${area.name}</option>`)}
        </select>
      </label>
      <select
        class="grow"
        .value=${model.entityToAdd}
        @change=${(event: Event) =>
          actions.setEntityToAdd((event.target as HTMLSelectElement).value)}
      >
        <option value="">Select entity (${model.entityCount})</option>
        ${model.entityOptions.map(
          (entity) => html`
            <option value=${entity.entity_id}>
              ${entity.entity_id}${entity.name ? ` — ${entity.name}` : ""}
            </option>
          `
        )}
      </select>
      <button ?disabled=${!currentPlan || !model.entityToAdd} @click=${actions.addMarker}>
        + Marker
      </button>
    </div>
    <div class="edit-toolbar">
      <strong>Drag entity onto plan:</strong>
      <div class="entity-palette">
        ${model.entityOptions.slice(0, 80).map(
          (entity) => html`
            <div
              class="entity-card"
              draggable="true"
              @dragstart=${(event: DragEvent) => actions.startEntityDrag(entity.entity_id, event)}
              title="Drag onto the floorplan"
            >
              <strong>${entity.name ?? entity.entity_id}</strong>
              <span>${entity.entity_id}</span>
            </div>
          `
        )}
      </div>
    </div>
    <div class="edit-toolbar">
      <strong>View “${currentView?.name ?? currentViewId}” filters:</strong>
      <label>
        Domains:
        <input
          .value=${currentView?.filters.domains?.join(", ") ?? ""}
          @change=${(event: Event) => actions.updateViewFilter("domains", event)}
          placeholder="light, switch"
        />
      </label>
      <label>
        Tags:
        <input
          .value=${currentView?.filters.tags?.join(", ") ?? ""}
          @change=${(event: Event) => actions.updateViewFilter("tags", event)}
          placeholder="heating"
        />
      </label>
      <label>
        Area IDs:
        <input
          .value=${currentView?.filters.area_ids?.join(", ") ?? ""}
          @change=${(event: Event) => actions.updateViewFilter("area_ids", event)}
          placeholder="living_room"
        />
      </label>
    </div>
    <div class="edit-toolbar">
      <strong>Area overlay:</strong>
      <label>
        Primary entity:
        <input
          .value=${currentView?.area_overlay?.primary?.entity_id ?? ""}
          @change=${(event: Event) => actions.updateAreaOverlay("primary", "entity_id", event)}
          placeholder="sensor.living_room_temperature"
        />
      </label>
      <label>
        Source:
        <select
          .value=${currentView?.area_overlay?.primary?.source ?? "state"}
          @change=${(event: Event) => actions.updateAreaOverlay("primary", "source", event)}
        >
          <option value="state">State</option>
          <option value="attr">Attribute</option>
        </select>
      </label>
      <label>
        Attribute:
        <input
          .value=${currentView?.area_overlay?.primary?.attr ?? ""}
          @change=${(event: Event) => actions.updateAreaOverlay("primary", "attr", event)}
        />
      </label>
      <label>
        Format:
        <input
          .value=${currentView?.area_overlay?.primary?.format ?? ""}
          @change=${(event: Event) => actions.updateAreaOverlay("primary", "format", event)}
          placeholder="{value} °C"
        />
      </label>
    </div>
    <div class="edit-toolbar">
      <strong>Secondary / badges:</strong>
      <label>
        Secondary entity:
        <input
          .value=${currentView?.area_overlay?.secondary?.entity_id ?? ""}
          @change=${(event: Event) => actions.updateAreaOverlay("secondary", "entity_id", event)}
        />
      </label>
      <label>
        Source:
        <select
          .value=${currentView?.area_overlay?.secondary?.source ?? "state"}
          @change=${(event: Event) => actions.updateAreaOverlay("secondary", "source", event)}
        >
          <option value="state">State</option>
          <option value="attr">Attribute</option>
        </select>
      </label>
      <label>
        Attribute:
        <input
          .value=${currentView?.area_overlay?.secondary?.attr ?? ""}
          @change=${(event: Event) => actions.updateAreaOverlay("secondary", "attr", event)}
        />
      </label>
      <label>
        Format:
        <input
          .value=${currentView?.area_overlay?.secondary?.format ?? ""}
          @change=${(event: Event) => actions.updateAreaOverlay("secondary", "format", event)}
        />
      </label>
      <label>
        Badges:
        <input
          class="grow"
          .value=${currentView?.area_overlay?.badges
            ?.map(
              (badge) =>
                `${badge.entity_id}=${badge.when.state_is}${badge.label ? `:${badge.label}` : ""}`
            )
            .join(", ") ?? ""}
          @change=${actions.updateAreaBadges}
          placeholder="binary_sensor.window=on:Window open"
        />
      </label>
    </div>
    ${selectedArea ? renderAreaEditor(selectedArea, model.areas, actions) : ""}
    ${selectedMarker ? renderMarkerEditor(selectedMarker, model.areas, actions) : ""}
  `;
}

function renderAreaEditor(
  area: AreaShape,
  areas: HassArea[],
  actions: FloorplanEditorActions
): TemplateResult {
  return html`
    <div class="edit-toolbar">
      <span>Selected area:</span>
      <strong>${area.id}</strong>
      <label>
        HA Area:
        <select @change=${actions.bindArea} .value=${area.area_id ?? ""}>
          <option value="">Unbound</option>
          ${areas.map(
            (candidate) => html`<option value=${candidate.id}>${candidate.name}</option>`
          )}
        </select>
      </label>
      <label>
        Tags:
        <input
          .value=${area.tags.join(", ")}
          @change=${actions.updateAreaTags}
          placeholder="downstairs, heating"
        />
      </label>
      <label>
        Fill:
        <input
          type="color"
          .value=${area.style.fill ?? "#2196f3"}
          @change=${(event: Event) => actions.updateAreaStyle("fill", event)}
        />
      </label>
      <label>
        Stroke:
        <input
          type="color"
          .value=${area.style.stroke ?? "#1976d2"}
          @change=${(event: Event) => actions.updateAreaStyle("stroke", event)}
        />
      </label>
      <label>
        Opacity:
        <input
          type="number"
          min="0"
          max="1"
          step="0.05"
          .value=${String(area.style.fillOpacity)}
          @change=${(event: Event) => actions.updateAreaStyle("fillOpacity", event)}
        />
      </label>
      <label>
        Stroke width:
        <input
          type="number"
          min="0"
          max="20"
          step="1"
          .value=${String(area.style.strokeWidth)}
          @change=${(event: Event) => actions.updateAreaStyle("strokeWidth", event)}
        />
      </label>
      <button @click=${actions.deleteArea}>Delete Area</button>
    </div>
  `;
}

function renderMarkerEditor(
  marker: Marker,
  areas: HassArea[],
  actions: FloorplanEditorActions
): TemplateResult {
  return html`
    <div class="edit-toolbar">
      <span>Selected marker:</span>
      <strong>${marker.entity_id}</strong>
      <label>
        Tags:
        <input
          .value=${marker.tags.join(", ")}
          @change=${actions.updateMarkerTags}
          placeholder="heating, downstairs"
        />
      </label>
      <label>
        HA Area:
        <select .value=${marker.area_id ?? ""} @change=${actions.updateMarkerArea}>
          <option value="">Unbound</option>
          ${areas.map((area) => html`<option value=${area.id}>${area.name}</option>`)}
        </select>
      </label>
      <label>
        Label:
        <select .value=${marker.label_mode} @change=${actions.updateMarkerLabelMode}>
          <option value="auto">Auto</option>
          <option value="short">Short</option>
          <option value="full">Full</option>
          <option value="off">Off</option>
        </select>
      </label>
      <label>
        Primary:
        <select
          .value=${marker.bind.primary.source}
          @change=${(event: Event) => actions.updateMarkerBinding("primary", "source", event)}
        >
          <option value="state">State</option>
          <option value="attr">Attribute</option>
        </select>
      </label>
      <label>
        Attribute:
        <input
          .value=${marker.bind.primary.attr ?? ""}
          @change=${(event: Event) => actions.updateMarkerBinding("primary", "attr", event)}
        />
      </label>
      <label>
        Format:
        <input
          .value=${marker.bind.primary.format ?? ""}
          @change=${(event: Event) => actions.updateMarkerBinding("primary", "format", event)}
          placeholder="{value} °C"
        />
      </label>
      ${marker.bind.secondary
        ? html`
            <label>
              Secondary:
              <select
                .value=${marker.bind.secondary.source}
                @change=${(event: Event) =>
                  actions.updateMarkerBinding("secondary", "source", event)}
              >
                <option value="state">State</option>
                <option value="attr">Attribute</option>
              </select>
            </label>
            <label>
              Attribute:
              <input
                .value=${marker.bind.secondary.attr ?? ""}
                @change=${(event: Event) => actions.updateMarkerBinding("secondary", "attr", event)}
              />
            </label>
            <label>
              Format:
              <input
                .value=${marker.bind.secondary.format ?? ""}
                @change=${(event: Event) =>
                  actions.updateMarkerBinding("secondary", "format", event)}
              />
            </label>
            <button @click=${actions.removeMarkerSecondaryBinding}>Remove Secondary</button>
          `
        : html` <button @click=${actions.addMarkerSecondaryBinding}>+ Secondary</button> `}
      <button @click=${actions.deleteMarker}>Delete Marker</button>
    </div>
  `;
}
