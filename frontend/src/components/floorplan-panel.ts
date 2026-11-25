/**
 * Floorplan Panel - Main HA panel component
 * Coordinates the Lit shell and the active plan viewport.
 */

import { LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import type Konva from "konva";
import type {
  HomeAssistant,
  FloorplanConfig,
  Plan,
  AreaShape,
  HassArea,
  HassEntityRegistry,
  Marker,
  View,
} from "../types/home-assistant";
import { defaultTagsForEntity } from "../lib/marker-utils";
import { createLocalizer } from "../lib/i18n";
import {
  errorCode,
  loadFloorplanConfig,
  loadRegistry,
  saveFloorplanConfig,
} from "../lib/config-api";
import { fetchFloorplanModel } from "../lib/asset-api";
import { ConfigSaveQueue, type SaveState, type SaveStatus } from "../lib/config-save-queue";
import { ConfigHistory } from "../lib/config-history";
import { addMarker, updateMarker } from "../lib/marker-config";
import { addCameraPreset, is3DPlan } from "../lib/plan-config";
import {
  addArea,
  createArea,
  createAnchor3DArea,
  createMeshArea,
  updateAreaShape,
  type AreaGeometryUpdate,
} from "../lib/area-config";
import { PanelKonvaViewport } from "../lib/panel-konva-viewport";
import type { ViewportRenderState } from "../lib/viewport-types";
import { floorplanPanelStyles } from "./floorplan-panel.styles";
import type { EditorTab } from "./floorplan-editor";
import { type PanelDialog } from "./floorplan-dialog";
import "./floorplan-dialog";
import { EntityDragController } from "../lib/panel-drag-controller";
import { PanelEditOperations } from "../lib/panel-edit-operations";
import { mergePanelEntities, renderPanelEditor } from "./floorplan-panel-editor";
import { analyzeConfigDiagnostics, type ConfigDiagnostic } from "../lib/config-diagnostics";
import type { ThreeViewportController, ThreeViewportState } from "../lib/three-viewport";
import { renderPanelTemplate, type PlacementShape } from "./floorplan-panel-template";

const LIVE_REFRESH_DELAY_MS = 500;
const fieldValue = (event: Event) => (event.target as HTMLInputElement).value;

export class FloorplanPanel extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ type: Boolean }) public narrow = false;
  @property({ type: Object }) public panel?: { config: Record<string, unknown> };

  @state() private _config: FloorplanConfig | null = null;
  @state() private _loading = true;
  @state() private _loadFailed = false;
  @state() private _editMode = false;
  @state() private _currentView = "all";
  @state() private _currentPlanId: string | null = null;
  @state() private _selectedAreaId: string | null = null;
  @state() private _selectedMarkerId: string | null = null;
  @state() private _haAreas: HassArea[] = [];
  @state() private _haEntities: HassEntityRegistry[] = [];
  @state() private _entityScrollTop = 0;
  @state() private _entityViewportHeight = 180;
  @state() private _warningsOpen = false;
  @state() private _cameraMode: "ortho" | "perspective" = "ortho";
  @state() private _tab: EditorTab = "entities";
  @state() private _shape: PlacementShape = null;
  @state() private _entityToAdd = "";
  @state() private _entitySearch = "";
  @state() private _entityDomainFilter = "";
  @state() private _entityAreaFilter = "";
  @state() private _notice = "";
  @state() private _error = "";
  @state() private _saveState: SaveState = "idle";
  @state() private _saveDirty = false;
  @state() private _saveConflict = false;
  @state() private _dialog: PanelDialog | null = null;

  private _stage: Konva.Stage | null = null;
  private _konva: PanelKonvaViewport | null = null;
  private readonly _areaShapes: Map<string, Konva.Shape> = new Map();
  private readonly _markerGroups: Map<string, Konva.Group> = new Map();
  private _renderGeneration = 0;
  private _liveRefreshTimer: number | null = null;
  private _threeViewport: ThreeViewportController | null = null;
  private _pending3DFocus: { kind: "area" | "marker"; id: string } | null = null;
  private readonly _availableMeshesByPlan = new Map<string, string[]>();
  private readonly _drag = new EntityDragController({
    isEnabled: () => this._editMode && this._canEdit && !!this._getCurrentPlan(),
    getCanvasContainer: () => this._canvasContainer(),
    onDropEntity: (id, x, y, container) => this._addMarkerAtClientPoint(id, x, y, container),
  });
  private readonly _edits = new PanelEditOperations({
    hass: () => this.hass,
    editableConfig: () => (this._canEdit ? this._config : null),
    commit: (config) => this._commitConfig(config),
    selectPlan: (id) => this._changePlan(id),
    selectView: (id) => this._setView(id),
    onReplaceBackground: (id) => {
      this._availableMeshesByPlan.delete(id);
      if (id === this._currentPlanId) this._clearSelection();
    },
    onImport: () => this._availableMeshesByPlan.clear(),
    newPlanId: () => this._newId("plan"),
    localize: () => this._t,
    askText: (title, value) => this._askText(title, value),
    confirm: (message, label, destructive) => this._askConfirm(message, label, destructive),
    notice: (message) => this._setNotice(message),
    error: (message) => this._setError(message),
  });
  private _replacePlanId: string | null = null;
  private readonly _history = new ConfigHistory();
  private _dialogResolver: ((value: string | boolean | null) => void) | null = null;
  private readonly _saveQueue = new ConfigSaveQueue(
    (config, baseRevision) => saveFloorplanConfig(this.hass, config, baseRevision),
    {
      onStatus: (status) => this._onSaveStatus(status),
      onSaved: (revision) => {
        if (this._config) {
          this._config = { ...this._config, revision };
        }
        this._setNotice(this._t("panel.changesSaved"));
      },
    }
  );
  private readonly _beforeUnload = (event: BeforeUnloadEvent) => {
    if (!this._saveDirty) return;
    event.preventDefault();
    event.returnValue = "";
  };
  private get _canEdit(): boolean {
    return this.hass?.user?.is_admin === true;
  }

  private get _t() {
    return createLocalizer(this.hass?.language);
  }

  static styles = floorplanPanelStyles;

  async connectedCallback() {
    super.connectedCallback();
    window.addEventListener("beforeunload", this._beforeUnload);
    this._drag.attach();
    await this._loadConfig();
    if (this._canEdit) {
      await this._loadRegistry();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("beforeunload", this._beforeUnload);
    this._drag.detach();
    this._resolveDialog(null);
    if (this._liveRefreshTimer !== null) {
      window.clearTimeout(this._liveRefreshTimer);
      this._liveRefreshTimer = null;
    }
    this._destroyStage();
    this._destroyThreeViewport();
  }

  private async _loadConfig() {
    this._destroyStage();
    this._destroyThreeViewport();
    this._availableMeshesByPlan.clear();
    this._loading = true;
    this._loadFailed = false;
    try {
      this._config = await loadFloorplanConfig(this.hass);
      this._saveQueue.reset(this._config.revision);
      this._history.reset();
      this._saveConflict = false;
      this._error = "";
      this._notice = "";
      this._changePlan(this._config.plans[0]?.plan_id ?? null);
      const defaultView = this._config.views.find(({ id }) => id === this._config?.default_view);
      if (defaultView) this._currentView = defaultView.id;
      this._reconcileSelection();
    } catch {
      this._config = null;
      this._loadFailed = true;
      this._saveQueue.reset(0);
      this._history.reset();
      this._setError(this._t("panel.loadError"));
    }
    this._loading = false;
  }

  public async saveConfig(): Promise<boolean> {
    if (!this._config || !this._canEdit) return false;
    return this._saveQueue.enqueue(this._config);
  }

  private _commitConfig(config: FloorplanConfig, recordHistory = true): Promise<boolean> {
    if (!this._canEdit || config === this._config) return Promise.resolve(false);
    if (recordHistory && this._config) {
      this._history.record(this._config);
    }
    this._config = config;
    this._reconcileSelection();
    return this._saveQueue.enqueue(config);
  }

  private _undo(): void {
    if (!this._config) return;
    const previous = this._history.undo(this._config);
    if (!previous) return;
    void this._commitConfig(previous, false);
    this._clearSelection();
  }

  private _redo(): void {
    if (!this._config) return;
    const next = this._history.redo(this._config);
    if (!next) return;
    void this._commitConfig(next, false);
    this._clearSelection();
  }

  private _onSaveStatus(status: SaveStatus): void {
    this._saveState = status.state;
    this._saveDirty = status.dirty;
    if (status.state === "pending" || status.state === "saving") {
      this._notice = "";
      this._error = "";
      this._saveConflict = false;
    }
    if (status.state === "failed") {
      this._saveConflict = errorCode(status.error) === "config_conflict";
      this._setError(this._t(this._saveConflict ? "panel.conflict" : "panel.saveFailed"));
    }
  }

  protected updated(changes: Map<string, unknown>) {
    if (changes.has("hass")) {
      if (!this._canEdit && this._editMode) this._toggleEditMode();
      this._scheduleLiveRefresh();
    }
    if (this._loading || !this.isConnected) return;
    const oldConfig = changes.has("_config")
      ? (changes.get("_config") as FloorplanConfig | null)
      : this._config;
    const oldPlan = oldConfig?.plans.find(({ plan_id }) => plan_id === this._currentPlanId);
    const plan = this._getCurrentPlan();
    if (
      changes.has("_loading") ||
      changes.has("_currentPlanId") ||
      oldPlan?.background !== plan?.background
    ) {
      void this._renderFloorplan();
      return;
    }

    const oldViewId = (changes.get("_currentView") as string | undefined) ?? this._currentView;
    const oldView = oldConfig?.views.find(({ id }) => id === oldViewId);
    const view = this._getCurrentView();
    const registryChanged = changes.has("_haAreas") || changes.has("_haEntities");
    const modeChanged = changes.has("_editMode");
    const selectionChanged = changes.has("_selectedAreaId") || changes.has("_selectedMarkerId");
    if (this._threeViewport) {
      if (
        oldPlan !== plan ||
        oldView !== view ||
        modeChanged ||
        registryChanged ||
        selectionChanged ||
        changes.has("_shape") ||
        changes.has("_entityToAdd")
      ) {
        this._sync3DState();
      }
      if (plan?.view.camera_mode !== oldPlan?.view.camera_mode) {
        this._setCameraMode(plan?.view.camera_mode ?? "ortho");
      }
      if (
        view?.camera_preset_id &&
        (changes.has("_currentView") || view.camera_preset_id !== oldView?.camera_preset_id)
      ) {
        this._applyCameraPreset(view.camera_preset_id);
      }
      return;
    }
    const state = this._getCanvasState();
    if (oldPlan?.markers !== plan?.markers || oldView !== view || modeChanged || registryChanged) {
      this._konva?.renderMarkers(state);
    }
    if (
      oldPlan?.areas !== plan?.areas ||
      oldPlan?.markers !== plan?.markers ||
      oldView !== view ||
      modeChanged ||
      registryChanged ||
      changes.has("_selectedAreaId")
    ) {
      this._konva?.renderAreas(state);
    }
    if (selectionChanged || modeChanged) this._konva?.syncCanvasInteractivity(state);
  }

  private _scheduleLiveRefresh() {
    if (this._liveRefreshTimer !== null) return;
    this._liveRefreshTimer = window.setTimeout(() => {
      this._liveRefreshTimer = null;
      const state = this._getCanvasState();
      this._konva?.refreshMarkerLiveValues(state);
      if (!this._editMode) this._konva?.renderAreas(state);
      this._sync3DState();
    }, LIVE_REFRESH_DELAY_MS);
  }

  private _setNotice(message: string) {
    this._error = "";
    this._notice = message;
  }

  private _setError(message: string) {
    this._notice = "";
    this._error = message;
  }

  private _askText(title: string, value = ""): Promise<string | null> {
    this._dialogResolver?.(null);
    this._dialog = {
      kind: "text",
      title,
      value,
      confirmLabel: this._t("dialog.save"),
      destructive: false,
    };
    return new Promise((resolve) => {
      this._dialogResolver = (result) => resolve(typeof result === "string" ? result : null);
    });
  }

  private _askConfirm(
    message: string,
    confirmLabel = this._t("dialog.confirm"),
    destructive = false
  ): Promise<boolean> {
    this._dialogResolver?.(null);
    this._dialog = {
      kind: "confirm",
      title: this._t("dialog.confirmTitle"),
      message,
      value: "",
      confirmLabel,
      destructive,
    };
    return new Promise((resolve) => {
      this._dialogResolver = (value) => resolve(value === true);
    });
  }

  private _resolveDialog(value: string | boolean | null): void {
    const resolve = this._dialogResolver;
    this._dialogResolver = null;
    this._dialog = null;
    resolve?.(value);
  }

  private _retrySave(): void {
    void this._saveQueue.retry();
  }

  private async _reloadAfterConflict(): Promise<void> {
    if (!(await this._askConfirm(this._t("dialog.reloadMessage"), this._t("dialog.reload"), true)))
      return;
    await this._loadConfig();
  }

  private _initializeStage() {
    const container = this.renderRoot.querySelector<HTMLDivElement>(".canvas-wrapper");
    if (!container) {
      this._setError(this._t("panel.canvasInitError"));
      return;
    }
    this._konva = new PanelKonvaViewport(container, this._areaShapes, this._markerGroups, {
      isEditing: () => this._editMode,
      getPlan: () => this._getCurrentPlan(),
      getState: () => this._getCanvasState(),
      select: (kind, id) => this._selectCanvasObject(kind, id),
      activate: (marker) => void this._activateMarker(marker),
      move: (id, pos) => this._updateMarker(id, { pos }),
      resize: (id, updates) => this._updateAreaShape(id, updates),
      onEmptyCanvasClick: () => this._clearSelection(),
      onImageError: (kind) =>
        this._setError(
          this._t(kind === "load" ? "panel.imageLoadError" : "panel.imageRenderError")
        ),
    });
    this._stage = this._konva.stage;
  }

  private _getCanvasState(): ViewportRenderState {
    return {
      plan: this._getCurrentPlan(),
      view: this._getCurrentView(),
      states: this.hass.states,
      entities: this._haEntities,
      areas: this._haAreas,
      editMode: this._editMode,
      selectedAreaId: this._selectedAreaId,
      selectedMarkerId: this._selectedMarkerId,
    };
  }

  private _destroyStage() {
    this._konva?.destroy();
    this._konva = null;
    this._stage = null;
  }

  private _getCurrentPlan(): Plan | null {
    return this._config?.plans.find((plan) => plan.plan_id === this._currentPlanId) ?? null;
  }

  private _reconcileSelection(): void {
    if (!this._config) return;
    if (!this._config.plans.some((plan) => plan.plan_id === this._currentPlanId)) {
      this._currentPlanId = this._config.plans[0]?.plan_id ?? null;
      this._selectedAreaId = null;
      this._selectedMarkerId = null;
    }
    const plan = this._getCurrentPlan();
    if (this._selectedAreaId && !plan?.areas.some(({ id }) => id === this._selectedAreaId)) {
      this._selectedAreaId = null;
    }
    if (this._selectedMarkerId && !plan?.markers.some(({ id }) => id === this._selectedMarkerId)) {
      this._selectedMarkerId = null;
    }
    if (!this._config.views.some((view) => view.id === this._currentView)) {
      this._currentView = this._config.default_view ?? this._config.views[0]?.id ?? "all";
    }
  }

  private async _renderFloorplan() {
    const plan = this._getCurrentPlan();
    if (plan?.background.type === "model") {
      this._destroyStage();
      this._destroyThreeViewport();
      const generation = this._renderGeneration;
      const container = this.renderRoot.querySelector<HTMLDivElement>(".canvas-wrapper");
      if (!container) return;
      const background = plan.background;
      this._availableMeshesByPlan.delete(plan.plan_id);
      const isCurrent = () =>
        generation === this._renderGeneration &&
        this.isConnected &&
        this._currentPlanId === plan.plan_id &&
        this._getCurrentPlan()?.background === background;
      try {
        const { createThreeViewport } = await import("../lib/three-viewport");
        if (!isCurrent()) return;
        const cameraMode = this._getCurrentPlan()?.view.camera_mode ?? "ortho";
        this._cameraMode = cameraMode;
        const controller = createThreeViewport(container, {
          ...this._get3DState(),
          loadModelBuffer: () => fetchFloorplanModel(this.hass, background),
          cameraMode,
          cameraPreset: this._getCurrentView()?.camera_preset_id,
          messages: {
            webglUnavailable: this._t("panel.webglUnavailable"),
            modelLoadError: this._t("panel.modelLoadError"),
            webglContextLost: this._t("panel.webglContextLost"),
          },
          onPlaceMarker: (id, { x, y, z }) => this._addMarkerAt(id, { x, y, z }),
          onSelectMarker: (id) => this._selectCanvasObject("marker", id),
          onMoveMarker: (id, pos) => this._updateMarker(id, { pos }),
          onActivateMarker: (marker) => void this._activateMarker(marker),
          onPickMesh: (name, anchor) =>
            this._addDrawnArea(createMeshArea(this._newId("area"), name, anchor)),
          onPlaceAnchor: (pos) => this._addDrawnArea(createAnchor3DArea(this._newId("area"), pos)),
          onSelectArea: (id) => this._selectCanvasObject("area", id),
          onEmptyCanvasClick: () => this._clearSelection(),
          onError: () => {
            if (isCurrent()) this._setError(this._t("panel.modelLoadError"));
          },
        });
        this._threeViewport = controller;
        if ((await controller.ready) && isCurrent()) {
          this._availableMeshesByPlan.set(plan.plan_id, controller.getAvailableMeshes());
          this._cameraMode = controller.getCameraPreset()?.mode ?? this._cameraMode;
          if (this._pending3DFocus) {
            if (this._pending3DFocus.kind === "area") {
              controller.focusArea(this._pending3DFocus.id);
            } else {
              controller.focusMarker(this._pending3DFocus.id);
            }
          }
          this._pending3DFocus = null;
          this.requestUpdate();
        }
      } catch {
        if (isCurrent()) this._setError(this._t("panel.modelLoadError"));
      }
      return;
    }
    this._destroyThreeViewport();
    if (!this._stage) this._initializeStage();
    this._konva?.renderPlan(this.hass, this._getCanvasState());
  }

  private _destroyThreeViewport() {
    this._renderGeneration += 1;
    this._threeViewport?.destroy();
    this._threeViewport = null;
  }

  private _get3DState(): ThreeViewportState {
    const { plan, areas, ...state } = this._getCanvasState();
    return {
      ...state,
      markers: plan?.markers,
      areas: plan?.areas,
      hassAreas: areas,
      shadows: plan?.view.shadows ?? false,
      lighting: plan?.view.lighting ?? true,
      camera_presets: plan?.view.camera_presets,
      meshPickMode: this._shape === "mesh",
      anchorPickMode: this._shape === "anchor3d",
      armedEntityId: this._entityToAdd || null,
    };
  }

  private _sync3DState() {
    this._threeViewport?.update(this._get3DState());
  }

  private _fitCurrentPlan() {
    const plan = this._getCurrentPlan();
    if (this._threeViewport) this._threeViewport.fit();
    else if (plan?.background.type === "image")
      this._konva?.fitToScreen(plan.background.width, plan.background.height);
  }

  private _zoomBy(factor: number) {
    if (this._threeViewport) {
      if (factor > 1) this._threeViewport.zoomIn();
      else this._threeViewport.zoomOut();
      return;
    }
    this._konva?.zoomBy(factor);
  }

  private _toggleEditMode() {
    if (!this._canEdit && !this._editMode) return;
    this._switchTab("entities");
    this._editMode = !this._editMode;
    if (!this._editMode) {
      this._drag.cancel();
      this._warningsOpen = false;
      this._clearSelection();
    }
  }

  private _selectPlan(event: Event) {
    this._changePlan(fieldValue(event) || null);
  }

  private _changePlan(planId: string | null) {
    this._switchTab("entities");
    this._clearSelection();
    this._currentPlanId = planId;
  }

  private _clearSelection() {
    this._selectedAreaId = null;
    this._selectedMarkerId = null;
    this._pending3DFocus = null;
  }

  private _switchTab(tab: EditorTab) {
    if (tab !== this._tab) this._resetEntityScroll();
    this._shape = null;
    this._entityToAdd = "";
    this._tab = tab;
  }

  private _armPlacement(shape: PlacementShape, entity = "") {
    this._shape = shape;
    this._entityToAdd = entity;
    void this.updateComplete.then(() =>
      (
        this.renderRoot.querySelector<HTMLButtonElement>(".placement-surface") ??
        this._canvasContainer()
      )?.focus({ preventScroll: true })
    );
  }

  private _place(event: MouseEvent) {
    if (!this._editMode || !this._canEdit) return;
    if (is3DPlan(this._getCurrentPlan())) {
      const surface = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const hit = this._threeViewport?.raycastClientPoint(
        event.detail ? event.clientX : surface.left + surface.width / 2,
        event.detail ? event.clientY : surface.top + surface.height / 2
      );
      if (!hit) return;
      const { x, y, z } = hit;
      if (this._shape === "anchor3d")
        this._addDrawnArea(createAnchor3DArea(this._newId("area"), { x, y, z }));
      else if (this._entityToAdd) this._addMarkerAt(this._entityToAdd, { x, y, z });
      this._canvasContainer()?.focus({ preventScroll: true });
      return;
    }
    const point = (event.detail
      ? this._konva?.clientPoint(event.clientX, event.clientY)
      : this._konva?.center()) ?? { x: 0, y: 0 };
    if (this._shape === "rect" || this._shape === "polygon") {
      this._addDrawnArea(createArea(this._newId("area"), this._shape, point));
    } else if (this._entityToAdd) this._addMarkerAt(this._entityToAdd, point);
    this._canvasContainer()?.focus({ preventScroll: true });
  }

  private _addDrawnArea(area: AreaShape) {
    const plan = this._getCurrentPlan();
    if (!this._canEdit || !this._editMode || !this._config || !plan) return;
    void this._commitConfig(addArea(this._config, plan.plan_id, area));
    this._selectCanvasObject("area", area.id);
  }

  private _updateAreaShape(areaId: string, updates: AreaGeometryUpdate) {
    if (!this._canEdit || !this._config) return;
    const plan = this._getCurrentPlan();
    if (!plan) return;

    void this._commitConfig(updateAreaShape(this._config, plan.plan_id, areaId, updates));
  }

  private async _loadRegistry() {
    if (!this._canEdit) return;
    let entities: HassEntityRegistry[] = [];
    try {
      const registry = await loadRegistry(this.hass);
      ({ areas: this._haAreas, entities } = registry);
    } catch {
      this._haAreas = [];
      this._setError(this._t("panel.registryLoadError"));
    }
    this._haEntities = mergePanelEntities(this.hass.states, entities);
  }

  private _deleteSelectedArea() {
    return this._edits.deleteObject("area", this._getCurrentPlan(), this._selectedAreaId);
  }

  private _addMarkerAt(entityId: string, position: Marker["pos"]) {
    if (!this._canEdit || !this._config) return;
    const plan = this._getCurrentPlan();
    if (!plan) return;

    const registryEntry = this._haEntities.find((entity) => entity.entity_id === entityId);
    if (!registryEntry && !this.hass.states[entityId]) {
      this._setError(this._t("panel.selectExistingEntity"));
      return;
    }

    const marker: Marker = {
      id: this._newId("marker"),
      entity_id: entityId,
      area_id: registryEntry?.area_id ?? null,
      pos: position,
      icon: registryEntry?.icon ?? undefined,
      label_mode: "auto",
      tags: defaultTagsForEntity(entityId),
      bind: { primary: { source: "state" } },
    };

    void this._commitConfig(addMarker(this._config, plan.plan_id, marker));
    this._selectCanvasObject("marker", marker.id);
  }

  private _canvasContainer(): HTMLElement | null {
    return this.renderRoot.querySelector<HTMLElement>(".canvas-container");
  }

  private _addMarkerAtClientPoint(
    entityId: string,
    clientX: number,
    clientY: number,
    container: HTMLElement
  ) {
    if (this._threeViewport) {
      this._threeViewport.dropAt(clientX, clientY, entityId);
      return;
    }
    const point = this._konva?.clientPoint(clientX, clientY, container);
    if (point) this._addMarkerAt(entityId, point);
  }

  private _updateMarker(markerId: string, updates: Partial<Marker>) {
    if (!this._canEdit || !this._config) return;
    const plan = this._getCurrentPlan();
    if (!plan) return;

    void this._commitConfig(updateMarker(this._config, plan.plan_id, markerId, updates));
  }

  private _deleteSelectedMarker() {
    return this._edits.deleteObject("marker", this._getCurrentPlan(), this._selectedMarkerId);
  }

  private async _activateMarker(marker: Marker): Promise<void> {
    const action = marker.action?.tap ?? "more-info";
    if (action === "none") return;
    if (action === "toggle") {
      try {
        await this.hass.callService("homeassistant", "toggle", { entity_id: marker.entity_id });
      } catch {
        this._setError(this._t("panel.actionFailed"));
      }
      return;
    }
    this._openMoreInfo(marker.entity_id);
  }

  private _openMoreInfo(entityId: string) {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        bubbles: true,
        composed: true,
        detail: { entityId },
      })
    );
  }

  private _selectCanvasObject(kind: "area" | "marker", id: string): void {
    if (!this._canEdit || !this._editMode) return;
    this._switchTab("inspector");
    this._selectedAreaId = kind === "area" ? id : null;
    this._selectedMarkerId = kind === "marker" ? id : null;
  }

  private _onCanvasKeydown(event: KeyboardEvent): void {
    if (!this._canEdit || !this._editMode) return;
    if (event.key === "Escape") {
      this._switchTab(this._tab);
      this._canvasContainer()?.focus();
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
      event.preventDefault();
      if (event.shiftKey) this._redo();
      else this._undo();
      return;
    }
    if (
      event.key === "Enter" &&
      is3DPlan(this._getCurrentPlan()) &&
      (this._entityToAdd || this._shape === "anchor3d")
    ) {
      if (
        event.target instanceof Element &&
        event.target.closest("button, input, select, textarea, a, [role='button']")
      ) {
        return;
      }
      const container = this._canvasContainer();
      if (!container) return;
      event.preventDefault();
      const bounds = container.getBoundingClientRect();
      const hit = this._threeViewport?.raycastClientPoint(
        bounds.left + bounds.width / 2,
        bounds.top + bounds.height / 2
      );
      if (!hit) return;
      const { x, y, z } = hit;
      if (this._shape === "anchor3d") {
        this._addDrawnArea(createAnchor3DArea(this._newId("area"), { x, y, z }));
      } else if (this._entityToAdd) {
        this._addMarkerAt(this._entityToAdd, { x, y, z });
      }
      return;
    }
    if (event.key !== "Delete" && event.key !== "Backspace") return;
    if (this._selectedAreaId) {
      event.preventDefault();
      void this._deleteSelectedArea();
    } else if (this._selectedMarkerId) {
      event.preventDefault();
      void this._deleteSelectedMarker();
    }
  }

  private _getCurrentView(): View | undefined {
    return this._config?.views.find((view) => view.id === this._currentView);
  }

  private _setView(viewId: string) {
    this._switchTab(this._tab);
    this._clearSelection();
    this._currentView = viewId;
  }

  private _deleteCurrentView() {
    return this._edits.deleteView(this._currentView);
  }

  private _triggerConfigImport() {
    if (!this._canEdit) return;
    (this.renderRoot.querySelector(".config-file-input") as HTMLInputElement)?.click();
  }

  private _handleFileUpload(event: Event) {
    const replaceId = this._replacePlanId;
    this._replacePlanId = null;
    return this._edits.uploadAsset(event, replaceId);
  }

  private _triggerFileUpload(replacePlanId: string | null = null) {
    if (!this._canEdit) return;
    this._replacePlanId = replacePlanId;
    (this.renderRoot.querySelector(".file-input") as HTMLInputElement)?.click();
  }

  private _newId(prefix: string): string {
    // HTTP access by LAN address is common in Home Assistant.
    const words = crypto.getRandomValues(new Uint32Array(4));
    const suffix = Array.from(words, (word) => word.toString(16).padStart(8, "0")).join("");
    return `${prefix}_${suffix}`;
  }

  private _resetEntityScroll() {
    this._entityScrollTop = 0;
    const palette = this.renderRoot.querySelector<HTMLElement>(".entity-palette");
    if (palette) palette.scrollTop = 0;
  }

  private _setCameraMode(mode: "ortho" | "perspective") {
    this._threeViewport?.setCameraMode(mode);
    this._cameraMode = mode;
  }

  private _toggleCameraMode() {
    this._setCameraMode(this._cameraMode === "ortho" ? "perspective" : "ortho");
  }

  private _applyCameraPreset(id: string) {
    if (!this._threeViewport?.applyCameraPreset(id)) return;
    this._cameraMode = this._threeViewport.getCameraPreset()?.mode ?? this._cameraMode;
  }

  private async _saveCameraPreset() {
    const plan = this._getCurrentPlan();
    const viewport = this._threeViewport;
    if (!this._canEdit || !plan || !viewport) return;
    const preset = viewport.getCameraPreset();
    if (!preset) return;
    const name = (await this._askText(this._t("editor.savePreset")))?.trim();
    if (!this._config || !name || this._threeViewport !== viewport) return;
    void this._commitConfig(
      addCameraPreset(this._config, plan.plan_id, {
        ...preset,
        id: this._newId("camera"),
        name,
        mode: preset.mode ?? this._cameraMode,
      })
    );
  }

  private async _jumpToWarning({ planId, viewId, targetId, targetType }: ConfigDiagnostic) {
    this._warningsOpen = false;
    if (planId && planId !== this._currentPlanId) this._changePlan(planId);
    if (viewId) this._setView(viewId);
    this._clearSelection();
    if (targetId && (targetType === "area" || targetType === "marker")) {
      this._selectCanvasObject(targetType, targetId);
      if (is3DPlan(this._getCurrentPlan())) {
        this._pending3DFocus = { kind: targetType, id: targetId };
      }
      await this.updateComplete;
      if (this._pending3DFocus && this._threeViewport) {
        const focused =
          this._pending3DFocus.kind === "area"
            ? this._threeViewport.focusArea(this._pending3DFocus.id)
            : this._threeViewport.focusMarker(this._pending3DFocus.id);
        if (focused) this._pending3DFocus = null;
      }
      this._konva?.focusObject(targetType, targetId);
    } else {
      this._switchTab("settings");
      await this.updateComplete;
    }
    this.renderRoot.querySelector<HTMLElement>('.editor-nav [aria-current="page"]')?.focus();
  }

  private _renderEditor(currentPlan: Plan | null, currentView: View | undefined) {
    return renderPanelEditor(
      this._getCanvasState(),
      {
        tab: this._tab,
        currentViewId: this._currentView,
        availableMeshes: currentPlan
          ? this._availableMeshesByPlan.get(currentPlan.plan_id)
          : undefined,
        entityToAdd: this._entityToAdd,
        entitySearch: this._entitySearch,
        entityDomainFilter: this._entityDomainFilter,
        entityAreaFilter: this._entityAreaFilter,
        entityScrollTop: this._entityScrollTop,
        entityViewportHeight: this._entityViewportHeight,
        canUndo: this._history.canUndo,
        canRedo: this._history.canRedo,
      },
      {
        uploadImage: () => this._triggerFileUpload(),
        replaceImage: () => this._triggerFileUpload(currentPlan?.plan_id),
        undo: () => this._undo(),
        redo: () => this._redo(),
        renamePlan: () => this._edits.renamePlan(currentPlan),
        deletePlan: () => this._edits.deletePlan(currentPlan),
        onEntityScroll: (top, height) => {
          this._entityScrollTop = top;
          this._entityViewportHeight = height;
        },
        addView: () => this._edits.addView(),
        renameView: () => this._edits.renameView(currentView),
        moveView: (direction) => this._edits.moveView(this._currentView, direction),
        setDefaultView: () => this._edits.setDefaultView(currentView),
        deleteView: () => this._deleteCurrentView(),
        exportConfig: () => this._edits.exportConfig(this._config),
        importConfig: () => this._triggerConfigImport(),
        setEntitySearch: (value) => {
          this._resetEntityScroll();
          this._entitySearch = value;
        },
        setEntityDomainFilter: (value) => {
          this._resetEntityScroll();
          this._entityDomainFilter = value;
        },
        setEntityAreaFilter: (value) => {
          this._resetEntityScroll();
          this._entityAreaFilter = value;
        },
        setEntityToAdd: (value, event) => {
          if (!this._drag.skipNextClick || !event.detail) this._armPlacement(null, value);
          this._drag.skipNextClick = false;
        },
        switchTab: (tab) => this._switchTab(tab),
        startEntityDrag: this._drag.onEntityDragStart,
        startEntityPointerDrag: this._drag.onEntityPointerDown,
        updatePlan3DSettings: (field, event) =>
          this._edits.updatePlan3DSettings(currentPlan, field, event),
        saveCameraPreset: () => void this._saveCameraPreset(),
        applyCameraPreset: (id) => this._applyCameraPreset(id),
        deleteCameraPreset: (id) => this._edits.deleteCameraPreset(currentPlan, id),
        deleteArea: () => this._deleteSelectedArea(),
        deleteMarker: () => this._deleteSelectedMarker(),
      },
      () => this._config,
      (config) => this._commitConfig(config),
      this._t
    );
  }

  protected render() {
    const currentPlan = this._getCurrentPlan();
    const currentView = this._getCurrentView();
    const t = this._t;
    const diagnostics = this._editMode
      ? analyzeConfigDiagnostics({
          plans: this._config?.plans ?? [],
          views: this._config?.views ?? [],
          states: this.hass.states,
          entities: this._haEntities,
          haAreas: this._haAreas,
          availableMeshesByPlan: this._availableMeshesByPlan,
        })
      : [];
    return renderPanelTemplate(
      {
        narrow: this.narrow,
        editMode: this._editMode,
        hass: this.hass,
        entities: this._haEntities,
        config: this._config,
        canEdit: this._canEdit,
        currentViewId: this._currentView,
        loading: this._loading,
        notice: this._notice,
        error: this._error,
        loadFailed: this._loadFailed,
        saveState: this._saveState,
        saveConflict: this._saveConflict,
        shape: this._shape,
        entityToAdd: this._entityToAdd,
        selectedAreaId: this._selectedAreaId,
        selectedMarkerId: this._selectedMarkerId,
        dialog: this._dialog,
        warningsOpen: this._warningsOpen,
        currentPlan,
        currentView,
        cameraMode: this._cameraMode,
        diagnostics,
        editor: this._editMode && this._config ? this._renderEditor(currentPlan, currentView) : "",
      },
      {
        selectPlan: this._selectPlan.bind(this),
        toggleEditMode: this._toggleEditMode.bind(this),
        setView: this._setView.bind(this),
        handleFileUpload: this._handleFileUpload.bind(this),
        handleConfigImport: (event) => this._edits.importConfig(event),
        onCanvasKeydown: this._onCanvasKeydown.bind(this),
        onCanvasDragOver: this._drag.onCanvasDragOver,
        onCanvasDragLeave: this._drag.onCanvasDragLeave,
        onCanvasDrop: this._drag.onCanvasDrop,
        place: this._place.bind(this),
        cancelPlacement: () => this._switchTab(this._tab),
        switchTab: this._switchTab.bind(this),
        armPlacement: this._armPlacement.bind(this),
        loadConfig: this._loadConfig.bind(this),
        reloadAfterConflict: this._reloadAfterConflict.bind(this),
        retrySave: this._retrySave.bind(this),
        zoomBy: this._zoomBy.bind(this),
        fitCurrentPlan: this._fitCurrentPlan.bind(this),
        triggerFileUpload: this._triggerFileUpload.bind(this),
        triggerConfigImport: this._triggerConfigImport.bind(this),
        selectCanvasObject: this._selectCanvasObject.bind(this),
        activateMarker: this._activateMarker.bind(this),
        resolveDialog: this._resolveDialog.bind(this),
        applyCameraPreset: this._applyCameraPreset.bind(this),
        toggleCameraMode: this._toggleCameraMode.bind(this),
        toggleWarnings: () => {
          this._warningsOpen = !this._warningsOpen;
        },
        closeWarnings: () => {
          this._warningsOpen = false;
        },
        jumpToWarning: this._jumpToWarning.bind(this),
      },
      t
    );
  }
}
