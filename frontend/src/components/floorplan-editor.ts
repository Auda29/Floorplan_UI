import { renderAreaEditor, renderMarkerEditor } from "./floorplan-editor-inspector";
import { renderSettingsTab } from "./floorplan-editor-settings";
import { computeVirtualWindow } from "../lib/virtual-list";
import type { ViewStyle, AggregateValueSpec } from "../types/floorplan-config.generated";
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
  availableMeshes?: readonly string[];
  entityScrollTop?: number;
  entityViewportHeight?: number;
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
  onEntityScroll?(scrollTop: number, viewportHeight: number): void;
  updateMarkerIcon?(event: Event): void;
  updateAreaMesh?(event: Event): void;
  updateAreaOverlayMode?(slot: OverlaySlot, event: Event): void;
  updateAreaOverlayAggregate?(
    slot: OverlaySlot,
    field: Exclude<keyof AggregateValueSpec, "mode">,
    event: Event
  ): void;
  updateViewStyle?(field: keyof ViewStyle, event: Event): void;
  updateViewCameraPreset?(event: Event): void;
  updatePlan3DSettings?(field: "shadows" | "lighting" | "camera_mode", event: Event): void;
  saveCameraPreset?(): void;
  applyCameraPreset?(id: string): void;
  deleteCameraPreset?(id: string): void;
  showMore?(): void;
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
  const { currentPlan, selectedArea, selectedMarker } = model;
  const windowRange = computeVirtualWindow({
    totalCount: model.entityOptions.length,
    scrollTop: model.entityScrollTop ?? 0,
    viewportHeight: model.entityViewportHeight ?? 180,
    minRenderedItems: actions.onEntityScroll ? 35 : model.entityOptions.length,
  });
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
            ${selectedArea
              ? renderAreaEditor(selectedArea, model.areas, model.availableMeshes ?? [], actions, t)
              : ""}
            ${selectedMarker
              ? renderMarkerEditor(
                  selectedMarker,
                  model.areas,
                  currentPlan?.background.type === "model",
                  actions,
                  t
                )
              : ""}
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
                <div
                  class="entity-palette"
                  @scroll=${(event: Event) => {
                    const element = event.currentTarget as HTMLElement;
                    actions.onEntityScroll?.(element.scrollTop, element.clientHeight);
                  }}
                >
                  <div aria-hidden="true" style=${"height:" + windowRange.topSpacerPx + "px"}></div>
                  ${model.entityOptions.slice(windowRange.startIndex, windowRange.endIndex).map(
                    (entity) => html`
                      <button
                        type="button"
                        ?disabled=${!currentPlan}
                        aria-pressed=${model.entityToAdd === entity.entity_id}
                        @click=${(event: MouseEvent) =>
                          actions.setEntityToAdd(entity.entity_id, event)}
                        class="entity-card"
                        style="height:52px"
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
                  <div
                    aria-hidden="true"
                    style=${"height:" + windowRange.bottomSpacerPx + "px"}
                  ></div>
                </div>
                ${actions.showMore && model.matchCount > model.entityOptions.length
                  ? html`<button type="button" @click=${actions.showMore}>
                      ${t("editor.showMore")}
                    </button>`
                  : ""}
                ${!model.entityOptions.length ? html`<p>${t("editor.noResults")}</p>` : ""}
              </section>
            `
          : renderSettingsTab(model, actions, t)}
    </aside>
  `;
}
