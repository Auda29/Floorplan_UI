import { html, type TemplateResult } from "lit";
import type { Localize } from "../lib/i18n";
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
  actions: FloorplanEditorActions,
  t: Localize
): TemplateResult {
  const { currentPlan, currentView, currentViewId, selectedArea, selectedMarker } = model;
  return html`
    <div class="edit-toolbar">
      <button @click=${actions.uploadImage}>${t("editor.upload")}</button>
      <button ?disabled=${!model.canUndo} @click=${actions.undo}>${t("editor.undo")}</button>
      <button ?disabled=${!model.canRedo} @click=${actions.redo}>${t("editor.redo")}</button>
      <button ?disabled=${!currentPlan} @click=${actions.renamePlan}>
        ${t("editor.renamePlan")}
      </button>
      <button ?disabled=${!currentPlan} @click=${actions.deletePlan}>
        ${t("editor.deletePlan")}
      </button>
      <button ?disabled=${!currentPlan} @click=${actions.addAreaRect}>
        + ${t("editor.addRectangle")}
      </button>
      <button ?disabled=${!currentPlan} @click=${actions.addAreaPolygon}>
        + ${t("editor.addPolygon")}
      </button>
      <button @click=${actions.addView}>+ ${t("editor.addView")}</button>
      <button @click=${actions.renameView}>${t("editor.renameView")}</button>
      <button @click=${() => actions.moveView(-1)}>← ${t("editor.previousView")}</button>
      <button @click=${() => actions.moveView(1)}>${t("editor.nextView")} →</button>
      <button @click=${actions.setDefaultView}>${t("editor.setDefault")}</button>
      <button ?disabled=${currentViewId === "all"} @click=${actions.deleteView}>
        ${t("editor.deleteView")}
      </button>
      <button @click=${actions.exportConfig}>${t("editor.export")}</button>
      <button @click=${actions.importConfig}>${t("editor.import")}</button>
    </div>
    <div class="edit-toolbar">
      <label>
        ${t("editor.searchEntity")}
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
        ${t("editor.domain")}
        <select
          .value=${model.entityDomainFilter}
          @change=${(event: Event) =>
            actions.setEntityDomainFilter((event.target as HTMLSelectElement).value)}
        >
          <option value="">${t("editor.allDomains")}</option>
          ${model.entityDomains.map((domain) => html`<option value=${domain}>${domain}</option>`)}
        </select>
      </label>
      <label>
        ${t("editor.haArea")}
        <select
          .value=${model.entityAreaFilter}
          @change=${(event: Event) =>
            actions.setEntityAreaFilter((event.target as HTMLSelectElement).value)}
        >
          <option value="">${t("editor.allAreas")}</option>
          ${model.areas.map((area) => html`<option value=${area.id}>${area.name}</option>`)}
        </select>
      </label>
      <select
        class="grow"
        aria-label=${t("editor.selectEntity", { count: model.entityCount })}
        .value=${model.entityToAdd}
        @change=${(event: Event) =>
          actions.setEntityToAdd((event.target as HTMLSelectElement).value)}
      >
        <option value="">${t("editor.selectEntity", { count: model.entityCount })}</option>
        ${model.entityOptions.map(
          (entity) => html`
            <option value=${entity.entity_id}>
              ${entity.entity_id}${entity.name ? ` — ${entity.name}` : ""}
            </option>
          `
        )}
      </select>
      <button ?disabled=${!currentPlan || !model.entityToAdd} @click=${actions.addMarker}>
        + ${t("editor.addMarker")}
      </button>
    </div>
    <div class="edit-toolbar">
      <strong>${t("editor.dragEntity")}</strong>
      <div class="entity-palette">
        ${model.entityOptions.slice(0, 80).map(
          (entity) => html`
            <div
              class="entity-card"
              draggable="true"
              @dragstart=${(event: DragEvent) => actions.startEntityDrag(entity.entity_id, event)}
              title=${t("editor.dragHint")}
            >
              <strong>${entity.name ?? entity.entity_id}</strong>
              <span>${entity.entity_id}</span>
            </div>
          `
        )}
      </div>
    </div>
    <div class="edit-toolbar">
      <strong>${t("editor.viewFilters", { name: currentView?.name ?? currentViewId })}</strong>
      <label>
        ${t("editor.domains")}
        <input
          .value=${currentView?.filters.domains?.join(", ") ?? ""}
          @change=${(event: Event) => actions.updateViewFilter("domains", event)}
          placeholder="light, switch"
        />
      </label>
      <label>
        ${t("editor.tags")}
        <input
          .value=${currentView?.filters.tags?.join(", ") ?? ""}
          @change=${(event: Event) => actions.updateViewFilter("tags", event)}
          placeholder="heating"
        />
      </label>
      <label>
        ${t("editor.areaIds")}
        <input
          .value=${currentView?.filters.area_ids?.join(", ") ?? ""}
          @change=${(event: Event) => actions.updateViewFilter("area_ids", event)}
          placeholder="living_room"
        />
      </label>
    </div>
    <div class="edit-toolbar">
      <strong>${t("editor.areaOverlay")}</strong>
      <label>
        ${t("editor.primaryEntity")}
        <input
          .value=${currentView?.area_overlay?.primary?.entity_id ?? ""}
          @change=${(event: Event) => actions.updateAreaOverlay("primary", "entity_id", event)}
          placeholder="sensor.living_room_temperature"
        />
      </label>
      <label>
        ${t("editor.source")}
        <select
          .value=${currentView?.area_overlay?.primary?.source ?? "state"}
          @change=${(event: Event) => actions.updateAreaOverlay("primary", "source", event)}
        >
          <option value="state">${t("editor.state")}</option>
          <option value="attr">${t("editor.attributeOption")}</option>
        </select>
      </label>
      <label>
        ${t("editor.attribute")}
        <input
          .value=${currentView?.area_overlay?.primary?.attr ?? ""}
          @change=${(event: Event) => actions.updateAreaOverlay("primary", "attr", event)}
        />
      </label>
      <label>
        ${t("editor.format")}
        <input
          .value=${currentView?.area_overlay?.primary?.format ?? ""}
          @change=${(event: Event) => actions.updateAreaOverlay("primary", "format", event)}
          placeholder="{value} °C"
        />
      </label>
    </div>
    <div class="edit-toolbar">
      <strong>${t("editor.secondaryBadges")}</strong>
      <label>
        ${t("editor.secondaryEntity")}
        <input
          .value=${currentView?.area_overlay?.secondary?.entity_id ?? ""}
          @change=${(event: Event) => actions.updateAreaOverlay("secondary", "entity_id", event)}
        />
      </label>
      <label>
        ${t("editor.source")}
        <select
          .value=${currentView?.area_overlay?.secondary?.source ?? "state"}
          @change=${(event: Event) => actions.updateAreaOverlay("secondary", "source", event)}
        >
          <option value="state">${t("editor.state")}</option>
          <option value="attr">${t("editor.attributeOption")}</option>
        </select>
      </label>
      <label>
        ${t("editor.attribute")}
        <input
          .value=${currentView?.area_overlay?.secondary?.attr ?? ""}
          @change=${(event: Event) => actions.updateAreaOverlay("secondary", "attr", event)}
        />
      </label>
      <label>
        ${t("editor.format")}
        <input
          .value=${currentView?.area_overlay?.secondary?.format ?? ""}
          @change=${(event: Event) => actions.updateAreaOverlay("secondary", "format", event)}
        />
      </label>
      <label>
        ${t("editor.badges")}
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
    ${selectedArea ? renderAreaEditor(selectedArea, model.areas, actions, t) : ""}
    ${selectedMarker ? renderMarkerEditor(selectedMarker, model.areas, actions, t) : ""}
  `;
}

function renderAreaEditor(
  area: AreaShape,
  areas: HassArea[],
  actions: FloorplanEditorActions,
  t: Localize
): TemplateResult {
  return html`
    <div class="edit-toolbar">
      <span>${t("editor.selectedArea")}</span>
      <strong>${area.id}</strong>
      <label>
        ${t("editor.haArea")}
        <select @change=${actions.bindArea} .value=${area.area_id ?? ""}>
          <option value="">${t("editor.unbound")}</option>
          ${areas.map(
            (candidate) => html`<option value=${candidate.id}>${candidate.name}</option>`
          )}
        </select>
      </label>
      <label>
        ${t("editor.tags")}
        <input
          .value=${area.tags.join(", ")}
          @change=${actions.updateAreaTags}
          placeholder="downstairs, heating"
        />
      </label>
      <label>
        ${t("editor.fill")}
        <input
          type="color"
          .value=${area.style.fill ?? "#2196f3"}
          @change=${(event: Event) => actions.updateAreaStyle("fill", event)}
        />
      </label>
      <label>
        ${t("editor.stroke")}
        <input
          type="color"
          .value=${area.style.stroke ?? "#1976d2"}
          @change=${(event: Event) => actions.updateAreaStyle("stroke", event)}
        />
      </label>
      <label>
        ${t("editor.opacity")}
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
        ${t("editor.strokeWidth")}
        <input
          type="number"
          min="0"
          max="20"
          step="1"
          .value=${String(area.style.strokeWidth)}
          @change=${(event: Event) => actions.updateAreaStyle("strokeWidth", event)}
        />
      </label>
      <button @click=${actions.deleteArea}>${t("editor.deleteArea")}</button>
    </div>
  `;
}

function renderMarkerEditor(
  marker: Marker,
  areas: HassArea[],
  actions: FloorplanEditorActions,
  t: Localize
): TemplateResult {
  return html`
    <div class="edit-toolbar">
      <span>${t("editor.selectedMarker")}</span>
      <strong>${marker.entity_id}</strong>
      <label>
        ${t("editor.tags")}
        <input
          .value=${marker.tags.join(", ")}
          @change=${actions.updateMarkerTags}
          placeholder="heating, downstairs"
        />
      </label>
      <label>
        ${t("editor.haArea")}
        <select .value=${marker.area_id ?? ""} @change=${actions.updateMarkerArea}>
          <option value="">${t("editor.unbound")}</option>
          ${areas.map((area) => html`<option value=${area.id}>${area.name}</option>`)}
        </select>
      </label>
      <label>
        ${t("editor.label")}
        <select .value=${marker.label_mode} @change=${actions.updateMarkerLabelMode}>
          <option value="auto">${t("editor.auto")}</option>
          <option value="short">${t("editor.short")}</option>
          <option value="full">${t("editor.full")}</option>
          <option value="off">${t("editor.off")}</option>
        </select>
      </label>
      <label>
        ${t("editor.primary")}
        <select
          .value=${marker.bind.primary.source}
          @change=${(event: Event) => actions.updateMarkerBinding("primary", "source", event)}
        >
          <option value="state">${t("editor.state")}</option>
          <option value="attr">${t("editor.attributeOption")}</option>
        </select>
      </label>
      <label>
        ${t("editor.attribute")}
        <input
          .value=${marker.bind.primary.attr ?? ""}
          @change=${(event: Event) => actions.updateMarkerBinding("primary", "attr", event)}
        />
      </label>
      <label>
        ${t("editor.format")}
        <input
          .value=${marker.bind.primary.format ?? ""}
          @change=${(event: Event) => actions.updateMarkerBinding("primary", "format", event)}
          placeholder="{value} °C"
        />
      </label>
      ${marker.bind.secondary
        ? html`
            <label>
              ${t("editor.secondary")}
              <select
                .value=${marker.bind.secondary.source}
                @change=${(event: Event) =>
                  actions.updateMarkerBinding("secondary", "source", event)}
              >
                <option value="state">${t("editor.state")}</option>
                <option value="attr">${t("editor.attributeOption")}</option>
              </select>
            </label>
            <label>
              ${t("editor.attribute")}
              <input
                .value=${marker.bind.secondary.attr ?? ""}
                @change=${(event: Event) => actions.updateMarkerBinding("secondary", "attr", event)}
              />
            </label>
            <label>
              ${t("editor.format")}
              <input
                .value=${marker.bind.secondary.format ?? ""}
                @change=${(event: Event) =>
                  actions.updateMarkerBinding("secondary", "format", event)}
              />
            </label>
            <button @click=${actions.removeMarkerSecondaryBinding}>
              ${t("editor.removeSecondary")}
            </button>
          `
        : html`
            <button @click=${actions.addMarkerSecondaryBinding}>
              + ${t("editor.addSecondary")}
            </button>
          `}
      <button @click=${actions.deleteMarker}>${t("editor.deleteMarker")}</button>
    </div>
  `;
}
