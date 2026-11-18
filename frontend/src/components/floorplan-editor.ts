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

export type EditorTab = "entities" | "inspector" | "settings";
export interface FloorplanEditorModel {
  tab: EditorTab;
  matchCount: number;
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
  replaceImage(): void;
  undo(): void;
  redo(): void;
  renamePlan(): void;
  deletePlan(): void;
  showMore(): void;
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
  setEntityToAdd(value: string, event: MouseEvent): void;
  switchTab(tab: EditorTab): void;
  startEntityDrag(entityId: string, event: DragEvent): void;
  startEntityPointerDrag(entityId: string, event: PointerEvent): void;
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
  updateMarkerAction(event: Event): void;
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
    <aside class="editor-panel" aria-label=${t("editor.title")}>
      <header class="editor-panel-header">
        <div class="editor-heading">
          <strong>${t("editor.title")}</strong>
          <div class="history-actions">
            <button
              type="button"
              aria-label=${t("editor.undo")}
              title=${t("editor.undo")}
              ?disabled=${!model.canUndo}
              @click=${actions.undo}
            >
              ↶
            </button>
            <button
              type="button"
              aria-label=${t("editor.redo")}
              title=${t("editor.redo")}
              ?disabled=${!model.canRedo}
              @click=${actions.redo}
            >
              ↷
            </button>
          </div>
        </div>
        <nav class="editor-nav" aria-label=${t("editor.title")}>
          ${(["entities", "inspector", "settings"] as const).map(
            (tab) =>
              html`<button
                type="button"
                aria-current=${model.tab === tab ? "page" : "false"}
                @click=${() => actions.switchTab(tab)}
              >
                ${t(
                  tab === "entities"
                    ? "editor.library"
                    : tab === "inspector"
                      ? "editor.inspector"
                      : "editor.settings"
                )}
              </button>`
          )}
        </nav>
      </header>
      ${model.tab === "inspector"
        ? html`
            ${selectedArea ? renderAreaEditor(selectedArea, model.areas, actions, t) : ""}
            ${selectedMarker ? renderMarkerEditor(selectedMarker, model.areas, actions, t) : ""}
            ${!selectedArea && !selectedMarker
              ? html`<p class="editor-selection-hint">${t("editor.selectHint")}</p>`
              : ""}
          `
        : model.tab === "entities"
          ? html`
              <section class="editor-card editor-entities">
                <h2>
                  ${t("editor.entities")}
                  <small>${model.matchCount} / ${model.entityCount}</small>
                </h2>
                <div class="editor-fields">
                  <label class="editor-field-wide">
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
                </div>
                <details class="entity-filters">
                  <summary>${t("editor.filters")}</summary>
                  <div class="editor-fields">
                    <label>
                      ${t("editor.domain")}
                      <select
                        .value=${model.entityDomainFilter}
                        @change=${(event: Event) =>
                          actions.setEntityDomainFilter((event.target as HTMLSelectElement).value)}
                      >
                        <option value="">${t("editor.allDomains")}</option>
                        ${model.entityDomains.map(
                          (domain) => html`<option value=${domain}>${domain}</option>`
                        )}
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
                        ${model.areas.map(
                          (area) => html`<option value=${area.id}>${area.name}</option>`
                        )}
                      </select>
                    </label>
                  </div>
                </details>
                <p class="editor-helper">${t("editor.libraryHint")}</p>
                <div class="entity-palette">
                  ${model.entityOptions.map(
                    (entity) => html`
                      <button
                        type="button"
                        ?disabled=${!currentPlan}
                        aria-pressed=${model.entityToAdd === entity.entity_id}
                        @click=${(event: MouseEvent) =>
                          actions.setEntityToAdd(entity.entity_id, event)}
                        class="entity-card"
                        draggable="true"
                        @dragstart=${(event: DragEvent) =>
                          actions.startEntityDrag(entity.entity_id, event)}
                        @pointerdown=${(event: PointerEvent) =>
                          actions.startEntityPointerDrag(entity.entity_id, event)}
                        title=${t("editor.dragHint")}
                      >
                        <strong>${entity.name ?? entity.entity_id}</strong>
                        <span>${entity.entity_id}</span>
                      </button>
                    `
                  )}
                </div>
                ${model.matchCount > model.entityOptions.length
                  ? html`<button type="button" @click=${actions.showMore}>
                      ${t("editor.showMore")}
                    </button>`
                  : ""}
                ${!model.entityOptions.length ? html`<p>${t("editor.noResults")}</p>` : ""}
              </section>
            `
          : html`
              <button class="add-plan" type="button" @click=${actions.uploadImage}>
                ${t("editor.upload")}
              </button>
              <details class="editor-card editor-plan-view">
                <summary>${t("editor.planView")}</summary>
                <div class="editor-card-body editor-actions">
                  <button type="button" ?disabled=${!currentPlan} @click=${actions.renamePlan}>
                    ${t("editor.renamePlan")}
                  </button>
                  <button type="button" ?disabled=${!currentPlan} @click=${actions.replaceImage}>
                    ${t("editor.replaceImage")}
                  </button>
                  <button type="button" ?disabled=${!currentPlan} @click=${actions.deletePlan}>
                    ${t("editor.deletePlan")}
                  </button>
                  <button type="button" @click=${actions.addView}>+ ${t("editor.addView")}</button>
                  <button type="button" @click=${actions.renameView}>
                    ${t("editor.renameView")}
                  </button>
                  <button type="button" @click=${() => actions.moveView(-1)}>
                    ← ${t("editor.previousView")}
                  </button>
                  <button type="button" @click=${() => actions.moveView(1)}>
                    ${t("editor.nextView")} →
                  </button>
                  <button type="button" @click=${actions.setDefaultView}>
                    ${t("editor.setDefault")}
                  </button>
                  <button
                    type="button"
                    ?disabled=${currentViewId === "all"}
                    @click=${actions.deleteView}
                  >
                    ${t("editor.deleteView")}
                  </button>
                  <button type="button" @click=${actions.exportConfig}>
                    ${t("editor.export")}
                  </button>
                  <button type="button" @click=${actions.importConfig}>
                    ${t("editor.import")}
                  </button>
                </div>
              </details>

              <details class="editor-card editor-advanced">
                <summary>${t("editor.viewOverlay")}</summary>
                <div class="editor-card-body">
                  <section class="editor-subsection">
                    <h3>
                      ${t("editor.viewFilters", { name: currentView?.name ?? currentViewId })}
                    </h3>
                    <div class="editor-fields">
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
                  </section>
                  <section class="editor-subsection">
                    <h3>${t("editor.areaOverlay")}</h3>
                    <div class="editor-fields">
                      <label>
                        ${t("editor.primaryEntity")}
                        <input
                          .value=${currentView?.area_overlay?.primary?.entity_id ?? ""}
                          @change=${(event: Event) =>
                            actions.updateAreaOverlay("primary", "entity_id", event)}
                          placeholder="sensor.living_room_temperature"
                        />
                      </label>
                      <label>
                        ${t("editor.source")}
                        <select
                          .value=${currentView?.area_overlay?.primary?.source ?? "state"}
                          @change=${(event: Event) =>
                            actions.updateAreaOverlay("primary", "source", event)}
                        >
                          <option value="state">${t("editor.state")}</option>
                          <option value="attr">${t("editor.attributeOption")}</option>
                        </select>
                      </label>
                      <label>
                        ${t("editor.attribute")}
                        <input
                          .value=${currentView?.area_overlay?.primary?.attr ?? ""}
                          @change=${(event: Event) =>
                            actions.updateAreaOverlay("primary", "attr", event)}
                        />
                      </label>
                      <label>
                        ${t("editor.format")}
                        <input
                          .value=${currentView?.area_overlay?.primary?.format ?? ""}
                          @change=${(event: Event) =>
                            actions.updateAreaOverlay("primary", "format", event)}
                          placeholder="{value} °C"
                        />
                      </label>
                    </div>
                  </section>
                  <section class="editor-subsection">
                    <h3>${t("editor.secondaryBadges")}</h3>
                    <div class="editor-fields">
                      <label>
                        ${t("editor.secondaryEntity")}
                        <input
                          .value=${currentView?.area_overlay?.secondary?.entity_id ?? ""}
                          @change=${(event: Event) =>
                            actions.updateAreaOverlay("secondary", "entity_id", event)}
                        />
                      </label>
                      <label>
                        ${t("editor.source")}
                        <select
                          .value=${currentView?.area_overlay?.secondary?.source ?? "state"}
                          @change=${(event: Event) =>
                            actions.updateAreaOverlay("secondary", "source", event)}
                        >
                          <option value="state">${t("editor.state")}</option>
                          <option value="attr">${t("editor.attributeOption")}</option>
                        </select>
                      </label>
                      <label>
                        ${t("editor.attribute")}
                        <input
                          .value=${currentView?.area_overlay?.secondary?.attr ?? ""}
                          @change=${(event: Event) =>
                            actions.updateAreaOverlay("secondary", "attr", event)}
                        />
                      </label>
                      <label>
                        ${t("editor.format")}
                        <input
                          .value=${currentView?.area_overlay?.secondary?.format ?? ""}
                          @change=${(event: Event) =>
                            actions.updateAreaOverlay("secondary", "format", event)}
                        />
                      </label>
                      <label class="editor-field-wide">
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
                  </section>
                </div>
              </details>
            `}
    </aside>
  `;
}

function renderAreaEditor(
  area: AreaShape,
  areas: HassArea[],
  actions: FloorplanEditorActions,
  t: Localize
): TemplateResult {
  return html`
    <section class="editor-card editor-selection">
      <h2>${t("editor.selectedArea")}</h2>
      <strong class="editor-selection-name">${area.id}</strong>
      <div class="editor-fields">
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
        <button class="editor-danger editor-field-wide" type="button" @click=${actions.deleteArea}>
          ${t("editor.deleteArea")}
        </button>
      </div>
    </section>
  `;
}

function renderMarkerEditor(
  marker: Marker,
  areas: HassArea[],
  actions: FloorplanEditorActions,
  t: Localize
): TemplateResult {
  return html`
    <section class="editor-card editor-selection">
      <h2>${t("editor.selectedMarker")}</h2>
      <strong class="editor-selection-name">${marker.entity_id}</strong>
      <div class="editor-fields">
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
          ${t("editor.markerAction")}
          <select .value=${marker.action?.tap ?? "more-info"} @change=${actions.updateMarkerAction}>
            <option value="more-info">${t("editor.actionDetails")}</option>
            <option value="toggle">${t("editor.actionToggle")}</option>
            <option value="none">${t("editor.actionNone")}</option>
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
                  @change=${(event: Event) =>
                    actions.updateMarkerBinding("secondary", "attr", event)}
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
              <button type="button" @click=${actions.removeMarkerSecondaryBinding}>
                ${t("editor.removeSecondary")}
              </button>
            `
          : html`
              <button type="button" @click=${actions.addMarkerSecondaryBinding}>
                + ${t("editor.addSecondary")}
              </button>
            `}
        <button
          class="editor-danger editor-field-wide"
          type="button"
          @click=${actions.deleteMarker}
        >
          ${t("editor.deleteMarker")}
        </button>
      </div>
    </section>
  `;
}
