import { html, type TemplateResult } from "lit";
import type {
  FloorplanConfig,
  HassEntityRegistry,
  HomeAssistant,
  Marker,
  Plan,
  View,
} from "../types/home-assistant";
import type { ConfigDiagnostic } from "../lib/config-diagnostics";
import type { SaveState } from "../lib/config-save-queue";
import type { Localize, TranslationKey } from "../lib/i18n";
import type { EditorTab } from "./floorplan-editor";
import type { PanelDialog, PanelDialogResult } from "./floorplan-dialog";
import { areaMatchesView } from "../lib/konva-renderer";
import { markerMatchesView } from "../lib/marker-utils";
import { is3DPlan } from "../lib/plan-config";
import { renderWarningBadge, renderWarningCenter } from "./floorplan-warnings";

export type PlacementShape = "rect" | "polygon" | "mesh" | "anchor3d" | null;

const placementLabel: Record<NonNullable<PlacementShape>, TranslationKey> = {
  rect: "editor.rectangle",
  polygon: "editor.polygon",
  mesh: "editor.bindMesh",
  anchor3d: "editor.addAnchor3d",
};

const cameraPresets = [
  ["isometric", "Iso", "editor.presetIso"],
  ["top", "Top", "editor.presetTop"],
  ["front", "Front", "editor.presetFront"],
] as const;

interface PanelModel {
  narrow: boolean;
  editMode: boolean;
  hass: HomeAssistant;
  entities: HassEntityRegistry[];
  config: FloorplanConfig | null;
  canEdit: boolean;
  currentViewId: string;
  loading: boolean;
  notice: string;
  error: string;
  loadFailed: boolean;
  saveState: SaveState;
  saveConflict: boolean;
  shape: PlacementShape;
  entityToAdd: string;
  selectedAreaId: string | null;
  selectedMarkerId: string | null;
  dialog: PanelDialog | null;
  warningsOpen: boolean;
  currentPlan: Plan | null;
  currentView: View | undefined;
  cameraMode: "ortho" | "perspective";
  diagnostics: ConfigDiagnostic[];
  editor: TemplateResult | "";
}

interface PanelActions {
  selectPlan: (event: Event) => void;
  toggleEditMode: () => void;
  setView: (id: string) => void;
  handleFileUpload: (event: Event) => void;
  handleConfigImport: (event: Event) => void;
  onCanvasKeydown: (event: KeyboardEvent) => void;
  onCanvasDragOver: (event: DragEvent) => void;
  onCanvasDragLeave: (event: DragEvent) => void;
  onCanvasDrop: (event: DragEvent) => void;
  place: (event: MouseEvent) => void;
  cancelPlacement: () => void;
  switchTab: (tab: EditorTab) => void;
  armPlacement: (shape: PlacementShape) => void;
  loadConfig: () => void;
  reloadAfterConflict: () => void;
  retrySave: () => void;
  zoomBy: (factor: number) => void;
  fitCurrentPlan: () => void;
  triggerFileUpload: () => void;
  triggerConfigImport: () => void;
  selectCanvasObject: (kind: "area" | "marker", id: string) => void;
  activateMarker: (marker: Marker) => void;
  resolveDialog: (value: PanelDialogResult) => void;
  applyCameraPreset: (id: string) => void;
  toggleCameraMode: () => void;
  toggleWarnings: () => void;
  closeWarnings: () => void;
  jumpToWarning: (diagnostic: ConfigDiagnostic) => void;
}

export function renderPanelTemplate(
  model: PanelModel,
  actions: PanelActions,
  t: Localize
): TemplateResult {
  const {
    narrow,
    editMode,
    hass,
    config,
    canEdit,
    currentViewId,
    loading,
    notice,
    error,
    loadFailed,
    saveState,
    saveConflict,
    shape,
    entityToAdd,
    selectedAreaId,
    selectedMarkerId,
    dialog,
    warningsOpen,
    currentPlan,
    currentView,
    cameraMode,
    diagnostics,
    editor,
  } = model;
  const plans = config?.plans ?? [];
  const views = config?.views ?? [];
  const is3D = is3DPlan(currentPlan);
  const visibleAreas =
    currentPlan?.areas.filter((area) => editMode || areaMatchesView(area, currentView)) ?? [];
  const visibleMarkers =
    currentPlan?.markers.filter((marker) => editMode || markerMatchesView(marker, currentView)) ??
    [];
  const placementEntity = entityToAdd
    ? model.entities.find((entity) => entity.entity_id === entityToAdd)
    : undefined;
  const saveMessage =
    saveState === "pending"
      ? t("panel.pending")
      : saveState === "saving"
        ? t("panel.saving")
        : notice === t("panel.changesSaved")
          ? notice
          : "";
  return html`
    <div class="container ${narrow ? "narrow" : ""}">
      <div class="toolbar">
        <div class="toolbar-left">
          ${narrow ? html`<ha-menu-button .hass=${hass} .narrow=${narrow}></ha-menu-button>` : ""}
          <div class="workspace-title">
            <h1>${t("panel.title")}</h1>
            <span
              class="save-indicator ${saveMessage ? "status" : ""}"
              role="status"
              aria-live="polite"
              >${saveMessage}</span
            >
          </div>
          ${currentPlan
            ? html`<label class="plan-select">
                <span>${t("panel.plan")}</span>
                <select @change=${actions.selectPlan}>
                  ${plans.map(
                    (plan) => html`
                      <option
                        value=${plan.plan_id}
                        ?selected=${currentPlan?.plan_id === plan.plan_id}
                      >
                        ${plan.name}
                      </option>
                    `
                  )}
                </select>
              </label>`
            : ""}
        </div>
        <div class="toolbar-right">
          ${diagnostics.length
            ? renderWarningBadge(
                diagnostics.length,
                diagnostics.filter(({ severity }) => severity === "error").length,
                warningsOpen,
                actions.toggleWarnings,
                t
              )
            : ""}
          ${canEdit && config
            ? html`
                <button
                  class="edit-toggle ${editMode ? "active" : ""}"
                  aria-pressed=${editMode ? "true" : "false"}
                  @click=${actions.toggleEditMode}
                >
                  ${editMode ? t("panel.done") : t("panel.edit")}
                </button>
              `
            : !canEdit
              ? html`<span class="viewer-note">${t("panel.viewOnly")}</span>`
              : ""}
        </div>
      </div>
      ${currentPlan
        ? html`<nav class="views-bar" aria-label=${t("panel.views")}>
            <div class="view-tabs">
              ${views.map(
                (view) => html`
                  <button
                    class="view-tab ${currentViewId === view.id ? "active" : ""}"
                    type="button"
                    aria-pressed=${currentViewId === view.id ? "true" : "false"}
                    @click=${() => actions.setView(view.id)}
                  >
                    ${view.id === config?.default_view ? "★ " : ""}${view.name}
                  </button>
                `
              )}
            </div>
          </nav>`
        : ""}
      <div class="workspace ${editMode ? "editing" : ""}">
        <input
          type="file"
          class="file-input"
          aria-label=${t("panel.upload")}
          accept="image/png,image/jpeg,image/svg+xml,.svg,.glb,model/gltf-binary"
          @change=${actions.handleFileUpload}
        />
        <input
          type="file"
          class="config-file-input"
          aria-label=${t("editor.import")}
          accept="application/json,.json"
          @change=${actions.handleConfigImport}
        />

        <div
          class="canvas-container"
          role="application"
          tabindex="0"
          aria-label=${t("panel.canvas")}
          @keydown=${actions.onCanvasKeydown}
          @dragover=${actions.onCanvasDragOver}
          @dragleave=${actions.onCanvasDragLeave}
          @drop=${actions.onCanvasDrop}
        >
          ${loading
            ? html`<div class="loading" role="status">${t("panel.loading")}</div>`
            : html`<div class="canvas-wrapper"></div>`}
          ${editMode && currentPlan && (shape || entityToAdd)
            ? html` ${!is3D && shape !== "mesh"
                  ? html`<button
                      class="placement-surface"
                      aria-label=${t("editor.placeHint")}
                      @click=${actions.place}
                    ></button>`
                  : ""}
                <div class="placement-prompt">
                  <div>
                    <strong
                      >${placementEntity?.name ||
                      entityToAdd ||
                      (shape && t(placementLabel[shape]))}</strong
                    ><span>${t("editor.placeHint")}</span>
                  </div>
                  <button @click=${() => actions.cancelPlacement()}>${t("dialog.cancel")}</button>
                </div>`
            : ""}
          ${editMode && currentPlan && !entityToAdd && !shape
            ? html`<div class="map-tools" role="group" aria-label=${t("editor.quickActions")}>
                <button
                  type="button"
                  aria-pressed="true"
                  @click=${() => actions.switchTab("inspector")}
                >
                  ${t("editor.selectTool")}
                </button>
                ${(is3D ? (["mesh", "anchor3d"] as const) : (["rect", "polygon"] as const)).map(
                  (shape) =>
                    html`<button type="button" @click=${() => actions.armPlacement(shape)}>
                      ${t(placementLabel[shape])}
                    </button>`
                )}
              </div>`
            : ""}
          <div class="panel-feedback">
            ${notice && notice !== t("panel.changesSaved")
              ? html`<div class="status" role="status">${notice}</div>`
              : ""}
            ${error
              ? html`
                  <div class="status error" role="alert">
                    ${error}
                    ${loadFailed
                      ? html`<button type="button" @click=${actions.loadConfig}>
                          ${t("panel.retry")}
                        </button>`
                      : saveState === "failed"
                        ? saveConflict
                          ? html`
                              <button type="button" @click=${actions.reloadAfterConflict}>
                                ${t("panel.reload")}
                              </button>
                            `
                          : html`<button type="button" @click=${actions.retrySave}>
                              ${t("panel.retry")}
                            </button>`
                        : ""}
                  </div>
                `
              : ""}
          </div>
          ${currentPlan && !loading
            ? html`<div class="map-dock" ?data-3d=${is3D}>
                <div class="map-caption">
                  <strong>${editMode ? t("panel.editContents") : currentView?.name}</strong>
                  <span
                    >${t("panel.mapContents", {
                      areas: visibleAreas.length,
                      markers: visibleMarkers.length,
                    })}</span
                  >
                </div>
                <div class="map-zoom" role="group" aria-label=${t("panel.canvas")}>
                  ${is3D
                    ? html`
                        ${cameraPresets.map(
                          ([id, label, key]) =>
                            html`<button
                              type="button"
                              class="camera-tool"
                              aria-label=${t(key)}
                              title=${t(key)}
                              @click=${() => actions.applyCameraPreset(id)}
                            >
                              ${label}
                            </button>`
                        )}
                        <button
                          type="button"
                          class="camera-tool"
                          aria-label=${t(
                            cameraMode === "ortho"
                              ? "editor.cameraOrtho"
                              : "editor.cameraPerspective"
                          )}
                          @click=${actions.toggleCameraMode}
                        >
                          ${cameraMode === "ortho" ? "Ortho" : "Persp"}
                        </button>
                      `
                    : ""}
                  <button
                    type="button"
                    aria-label=${t("panel.zoomOut")}
                    title=${t("panel.zoomOut")}
                    @click=${() => actions.zoomBy(0.8)}
                  >
                    −
                  </button>
                  <button
                    type="button"
                    aria-label=${t("panel.zoomIn")}
                    title=${t("panel.zoomIn")}
                    @click=${() => actions.zoomBy(1.25)}
                  >
                    +
                  </button>
                  <button class="canvas-fit" type="button" @click=${actions.fitCurrentPlan}>
                    ${t("panel.fit")}
                  </button>
                </div>
              </div>`
            : ""}
          ${!loading && !loadFailed && !currentPlan
            ? html`<div class="empty-state">
                <h2>${t("panel.emptyTitle")}</h2>
                <p>${canEdit ? t("panel.emptyDescription3d") : t("panel.emptyViewer")}</p>
                ${canEdit
                  ? html`<button
                        class="upload-btn"
                        type="button"
                        @click=${() => actions.triggerFileUpload()}
                      >
                        ${t("panel.upload")}
                      </button>
                      <button
                        class="import-btn"
                        type="button"
                        @click=${actions.triggerConfigImport}
                      >
                        ${t("editor.import")}
                      </button>`
                  : ""}
              </div>`
            : ""}
          <section class="canvas-accessibility" aria-label=${t("panel.objects")}>
            <ul>
              ${visibleAreas.map(
                (area) => html`
                  <li>
                    ${editMode
                      ? html`<button
                          type="button"
                          aria-pressed=${selectedAreaId === area.id ? "true" : "false"}
                          @click=${() => actions.selectCanvasObject("area", area.id)}
                        >
                          ${t("panel.areaObject", { id: area.id })}
                        </button>`
                      : t("panel.areaObject", { id: area.id })}
                  </li>
                `
              )}
              ${visibleMarkers.map(
                (marker) => html`
                  <li>
                    <button
                      type="button"
                      aria-pressed=${editMode && selectedMarkerId === marker.id ? "true" : "false"}
                      @click=${() =>
                        editMode
                          ? actions.selectCanvasObject("marker", marker.id)
                          : actions.activateMarker(marker)}
                    >
                      ${t("panel.markerObject", { entity: marker.entity_id })}
                    </button>
                  </li>
                `
              )}
            </ul>
          </section>
        </div>
        ${editMode && config ? editor : ""}
      </div>
      ${renderWarningCenter(
        diagnostics,
        editMode && warningsOpen,
        {
          onToggle: actions.toggleWarnings,
          onClose: actions.closeWarnings,
          onSelectDiagnostic: actions.jumpToWarning,
        },
        t
      )}
      <floorplan-dialog
        .dialog=${dialog}
        .cancelLabel=${t("dialog.cancel")}
        @floorplan-dialog-resolve=${(event: CustomEvent<PanelDialogResult>) =>
          actions.resolveDialog(event.detail)}
      ></floorplan-dialog>
    </div>
  `;
}
