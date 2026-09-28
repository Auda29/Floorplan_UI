/**
 * Floorplan Panel - Main HA panel component
 * Uses Lit for the panel shell and Konva for the canvas
 */

import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import Konva from "konva";
import type {
  HomeAssistant,
  FloorplanBackground,
  FloorplanConfig,
  Plan,
  AreaShape,
  BadgeSpec,
  HassArea,
  HassEntityRegistry,
  Marker,
  ValueSpec,
  View,
} from "../types/home-assistant";
import { defaultTagsForEntity } from "../lib/marker-utils";
import { createLocalizer } from "../lib/i18n";
import {
  CURRENT_CONFIG_VERSION,
  errorCode,
  loadFloorplanConfig,
  loadRegistry,
  saveFloorplanConfig,
  validateFloorplanConfig,
} from "../lib/config-api";
import {
  createPortableConfig,
  fetchFloorplanImage,
  materializeImportedImages,
  MAX_IMAGE_FILE_BYTES,
  MAX_PORTABLE_CONFIG_BYTES,
  uploadFloorplanImage,
} from "../lib/asset-api";
import { ConfigSaveQueue, type SaveState, type SaveStatus } from "../lib/config-save-queue";
import { ConfigHistory } from "../lib/config-history";
import {
  createStageController,
  fitStageToContent,
  getVisibleStageCenter,
  type StageController,
} from "../lib/stage-controller";
import { createView, moveView, removeView, updateView } from "../lib/view-config";
import { addMarker, removeMarker, updateMarker } from "../lib/marker-config";
import { addPlan, createPlan, removePlan, renamePlan } from "../lib/plan-config";
import {
  addArea,
  createArea,
  removeArea,
  updateArea,
  updateAreaShape,
  type AreaGeometryUpdate,
} from "../lib/area-config";
import {
  drawEmptyState,
  drawImageErrorState,
  refreshMarkerLiveValues,
  renderAreas,
  renderMarkers,
  syncCanvasInteractivity,
} from "../lib/konva-renderer";
import { floorplanPanelStyles } from "./floorplan-panel.styles";
import { renderFloorplanEditor } from "./floorplan-editor";
import { type PanelDialog, type PanelDialogResult } from "./floorplan-dialog";
import "./floorplan-dialog";

const LIVE_REFRESH_DELAY_MS = 500;
const ENTITY_POINTER_DRAG_THRESHOLD_PX = 6;
const ENTITY_TOUCH_DRAG_HOLD_MS = 250;

interface EntityPointerDrag {
  entityId: string;
  pointerId: number;
  pointerType: string;
  target: HTMLElement;
  palette: HTMLElement | null;
  startX: number;
  startY: number;
  startScrollTop: number;
  ready: boolean;
  scrolling: boolean;
  holdTimer: number | null;
  active: boolean;
}

export class FloorplanPanel extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ type: Boolean }) public narrow = false;
  @property({ type: Object }) public panel?: { config: Record<string, unknown> };

  @state() private _config: FloorplanConfig | null = null;
  @state() private _loading = true;
  @state() private _editMode = false;
  @state() private _currentView = "all";
  @state() private _currentPlanId: string | null = null;
  @state() private _selectedAreaId: string | null = null;
  @state() private _selectedMarkerId: string | null = null;
  @state() private _haAreas: HassArea[] = [];
  @state() private _haEntities: HassEntityRegistry[] = [];
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
  private _backgroundLayer: Konva.Layer | null = null;
  private _areasLayer: Konva.Layer | null = null;
  private _markersLayer: Konva.Layer | null = null;
  private _stageController: StageController | null = null;
  private _areaShapes: Map<string, Konva.Shape> = new Map();
  private _markerGroups: Map<string, Konva.Group> = new Map();
  private _renderGeneration = 0;
  private _liveRefreshTimer: number | null = null;
  private _entityPointerDrag: EntityPointerDrag | null = null;
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
  private readonly _entityPointerMove = (event: PointerEvent) => this._onEntityPointerMove(event);
  private readonly _entityPointerUp = (event: PointerEvent) => this._onEntityPointerUp(event);
  private readonly _entityPointerCancel = (event: PointerEvent) =>
    this._onEntityPointerCancel(event);

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
    window.addEventListener("pointermove", this._entityPointerMove, { passive: false });
    window.addEventListener("pointerup", this._entityPointerUp);
    window.addEventListener("pointercancel", this._entityPointerCancel);
    await this._loadConfig();
    if (this._canEdit) {
      await this._loadRegistry();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("beforeunload", this._beforeUnload);
    window.removeEventListener("pointermove", this._entityPointerMove);
    window.removeEventListener("pointerup", this._entityPointerUp);
    window.removeEventListener("pointercancel", this._entityPointerCancel);
    this._finishEntityPointerDrag();
    this._resolveDialog(null);
    if (this._liveRefreshTimer !== null) {
      window.clearTimeout(this._liveRefreshTimer);
      this._liveRefreshTimer = null;
    }
    this._destroyStage();
  }

  private async _loadConfig() {
    this._destroyStage();
    this._loading = true;
    try {
      this._config = await loadFloorplanConfig(this.hass);
      this._saveQueue.reset(this._config.revision);
      this._history.reset();
      this._saveConflict = false;
      this._error = "";
      this._notice = "";
      this._selectedAreaId = null;
      this._selectedMarkerId = null;
      this._currentPlanId = this._config.plans[0]?.plan_id ?? null;
      if (
        this._config.default_view &&
        this._config.views.some((view) => view.id === this._config?.default_view)
      ) {
        this._currentView = this._config.default_view;
      }
      this._reconcileSelection();
    } catch {
      this._config = {
        version: CURRENT_CONFIG_VERSION,
        revision: 0,
        plans: [],
        views: [],
      };
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
    if (!this._canEdit) return Promise.resolve(false);
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
    this._selectedAreaId = null;
    this._selectedMarkerId = null;
    this._renderFloorplan();
    this.requestUpdate();
  }

  private _redo(): void {
    if (!this._config) return;
    const next = this._history.redo(this._config);
    if (!next) return;
    void this._commitConfig(next, false);
    this._selectedAreaId = null;
    this._selectedMarkerId = null;
    this._renderFloorplan();
    this.requestUpdate();
  }

  private _onSaveStatus(status: SaveStatus): void {
    this._saveState = status.state;
    this._saveDirty = status.dirty;
    if (status.state === "pending" || status.state === "saving") {
      this._notice = "";
      this._error = "";
      this._saveConflict = false;
    }
    if (status.state !== "failed") return;
    if (errorCode(status.error) === "config_conflict") {
      this._saveConflict = true;
      this._setError(this._t("panel.conflict"));
      return;
    }
    this._saveConflict = false;
    this._setError(this._t("panel.saveFailed"));
  }

  protected updated(changedProps: Map<string, unknown>) {
    if (changedProps.has("_loading") && !this._loading && !this._stage && this.isConnected) {
      this._initializeStage();
    }

    if (changedProps.has("_currentPlanId") && this._stage) {
      this._selectedAreaId = null;
      this._selectedMarkerId = null;
      this._renderFloorplan();
    }

    if (changedProps.has("_currentView") && this._stage) {
      this._renderAreas(this._getCurrentPlan());
      this._renderMarkers(this._getCurrentPlan());
    }

    if (changedProps.has("hass")) {
      if (!this._canEdit && this._editMode) {
        this._editMode = false;
        this._selectedAreaId = null;
        this._selectedMarkerId = null;
        this._renderAreas(this._getCurrentPlan());
        this._renderMarkers(this._getCurrentPlan());
        this._syncCanvasInteractivity();
      }
      this._scheduleLiveRefresh();
    }
  }

  private _scheduleLiveRefresh() {
    if (this._liveRefreshTimer !== null) return;
    this._liveRefreshTimer = window.setTimeout(() => {
      this._liveRefreshTimer = null;
      this._refreshMarkerLiveValues();
      if (!this._editMode) this._renderAreas(this._getCurrentPlan());
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
    void this.updateComplete.then(() => {
      this.renderRoot.querySelector<HTMLInputElement>(".dialog input")?.focus();
    });
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
    this._renderFloorplan();
  }

  private _initializeStage() {
    const container = this.renderRoot.querySelector(".canvas-wrapper") as HTMLDivElement;
    if (!container) {
      this._setError(this._t("panel.canvasInitError"));
      return;
    }

    this._stageController = createStageController(container, {
      isEditing: () => this._editMode,
      getZoomLimits: () => {
        const plan = this._getCurrentPlan();
        return {
          minZoom: plan?.view.minZoom ?? 0.1,
          maxZoom: plan?.view.maxZoom ?? 5,
        };
      },
      onEmptyCanvasClick: () => {
        this._selectedAreaId = null;
        this._selectedMarkerId = null;
        this._renderAreas(this._getCurrentPlan());
        this._syncCanvasInteractivity();
      },
    });
    this._stage = this._stageController.stage;
    this._backgroundLayer = this._stageController.backgroundLayer;
    this._areasLayer = this._stageController.areasLayer;
    this._markersLayer = this._stageController.markersLayer;

    this._renderFloorplan();
  }

  private _destroyStage() {
    this._renderGeneration += 1;
    this._stageController?.destroy();
    this._stageController = null;
    this._stage = null;
    this._backgroundLayer = null;
    this._areasLayer = null;
    this._markersLayer = null;
    this._areaShapes.clear();
    this._markerGroups.clear();
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
    if (!this._config.views.some((view) => view.id === this._currentView)) {
      this._currentView = this._config.default_view ?? this._config.views[0]?.id ?? "all";
    }
  }

  private _renderFloorplan() {
    if (!this._stage || !this._backgroundLayer) return;

    const generation = ++this._renderGeneration;

    this._backgroundLayer.destroyChildren();
    this._areasLayer?.destroyChildren();
    this._markersLayer?.destroyChildren();
    this._areaShapes.clear();
    this._markerGroups.clear();

    const plan = this._getCurrentPlan();
    const stageWidth = this._stage.width();
    const stageHeight = this._stage.height();

    if (!plan) {
      this._drawEmptyState(stageWidth, stageHeight);
    } else if (plan.background?.asset_id || plan.background?.url) {
      this._renderAreas(plan);
      this._renderMarkers(plan);

      // Load background image
      const imageObj = new Image();
      let objectUrl: string | undefined;
      imageObj.onload = () => {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        if (generation !== this._renderGeneration || plan.plan_id !== this._currentPlanId) {
          return;
        }
        const img = new Konva.Image({
          x: 0,
          y: 0,
          image: imageObj,
          width: plan.background.width || imageObj.width,
          height: plan.background.height || imageObj.height,
        });
        this._backgroundLayer!.add(img);
        try {
          this._backgroundLayer!.batchDraw();
          this._fitToScreen(img.width(), img.height());
        } catch {
          this._backgroundLayer!.destroyChildren();
          this._drawImageErrorState(stageWidth, stageHeight);
          this._setError(this._t("panel.imageRenderError"));
        }
      };
      const onError = () => {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        if (generation !== this._renderGeneration) return;
        this._backgroundLayer!.destroyChildren();
        this._drawImageErrorState(stageWidth, stageHeight);
        this._setError(this._t("panel.imageLoadError"));
      };
      imageObj.onerror = onError;
      void fetchFloorplanImage(this.hass, plan.background)
        .then((image) => {
          if (generation !== this._renderGeneration) return;
          objectUrl = URL.createObjectURL(image);
          imageObj.src = objectUrl;
        })
        .catch(onError);
    } else if (plan) {
      // No background image but areas exist
      this._renderAreas(plan);
      this._renderMarkers(plan);
    }

    this._backgroundLayer.batchDraw();
    this._areasLayer?.batchDraw();
    this._markersLayer?.batchDraw();
  }

  private _fitToScreen(imgWidth: number, imgHeight: number) {
    if (!this._stage) return;
    fitStageToContent(this._stage, imgWidth, imgHeight, this._getCurrentPlan()?.view);
  }

  private _toggleEditMode() {
    if (!this._canEdit) return;
    this._editMode = !this._editMode;
    if (!this._editMode) {
      this._finishEntityPointerDrag();
      this._selectedAreaId = null;
      this._selectedMarkerId = null;
    }
    this._renderAreas(this._getCurrentPlan());
    this._renderMarkers(this._getCurrentPlan());
    this._syncCanvasInteractivity();
  }

  private _selectPlan(e: Event) {
    if (!this._config) return;
    const select = e.target as HTMLSelectElement;
    const planId = select.value || null;
    this._currentPlanId = planId;
  }

  private async _renameCurrentPlan() {
    if (!this._canEdit || !this._config || !this._currentPlanId) return;
    const planId = this._currentPlanId;
    const plan = this._config.plans.find((candidate) => candidate.plan_id === planId);
    if (!plan) return;

    const newName = await this._askText(this._t("dialog.renamePlan"), plan.name);
    if (!newName) return;

    const trimmed = newName.trim();
    if (!trimmed || trimmed === plan.name) return;

    void this._commitConfig(renamePlan(this._config, planId, trimmed));
  }

  private async _deleteCurrentPlan() {
    if (!this._canEdit || !this._config || !this._currentPlanId) return;
    const planId = this._currentPlanId;
    if (
      !(await this._askConfirm(
        this._t("dialog.deletePlanMessage"),
        this._t("editor.deletePlan"),
        true
      ))
    )
      return;

    const result = removePlan(this._config, planId);
    if (!result) return;
    void this._commitConfig(result.config);
    this._currentPlanId = result.nextPlanId;

    this._renderFloorplan();
  }

  private _renderAreas(plan: Plan | null) {
    if (!this._areasLayer) return;
    renderAreas({
      layer: this._areasLayer,
      plan,
      view: this._getCurrentView(),
      states: this.hass.states,
      areas: this._haAreas,
      editMode: this._editMode,
      selectedAreaId: this._selectedAreaId,
      shapes: this._areaShapes,
      onSelect: (areaId) => this._onAreaSelected(areaId),
      onUpdateShape: (areaId, updates) => this._updateAreaShape(areaId, updates),
      onRerender: () => this._renderAreas(this._getCurrentPlan()),
    });
    this._syncCanvasInteractivity();
  }

  private _syncCanvasInteractivity() {
    syncCanvasInteractivity({
      areasLayer: this._areasLayer,
      markersLayer: this._markersLayer,
      plan: this._getCurrentPlan(),
      editMode: this._editMode,
      selectedAreaId: this._selectedAreaId,
      selectedMarkerId: this._selectedMarkerId,
      areaShapes: this._areaShapes,
      markerGroups: this._markerGroups,
    });
  }

  private _drawEmptyState(stageWidth: number, stageHeight: number) {
    if (this._backgroundLayer) {
      drawEmptyState(this._backgroundLayer, stageWidth, stageHeight);
    }
  }

  private _drawImageErrorState(stageWidth: number, stageHeight: number) {
    if (this._backgroundLayer) {
      drawImageErrorState(this._backgroundLayer, stageWidth, stageHeight);
    }
  }

  private _onAreaSelected(areaId: string) {
    this._selectedAreaId = areaId;
    this._selectedMarkerId = null;
    this._renderAreas(this._getCurrentPlan());
    this._syncCanvasInteractivity();
  }

  private _addAreaRect() {
    this._addAreaShape("rect");
  }

  private _addAreaPolygon() {
    this._addAreaShape("polygon");
  }

  private _addAreaShape(type: "rect" | "polygon") {
    if (!this._canEdit || !this._config) return;
    const plan = this._getCurrentPlan();
    if (!plan) return;

    const id = this._newId("area");
    const newArea = createArea(id, type, this._getVisibleCanvasCenter());
    void this._commitConfig(addArea(this._config, plan.plan_id, newArea));

    this._selectedAreaId = id;
    this._selectedMarkerId = null;
    this._renderAreas(this._getCurrentPlan());
  }

  private _updateAreaShape(areaId: string, updates: AreaGeometryUpdate) {
    if (!this._canEdit || !this._config) return;
    const plan = this._getCurrentPlan();
    if (!plan) return;

    void this._commitConfig(updateAreaShape(this._config, plan.plan_id, areaId, updates));
  }

  private async _loadRegistry() {
    if (!this._canEdit) return;
    try {
      const result = await loadRegistry(this.hass);
      this._haAreas = result.areas;
      this._haEntities = result.entities.sort((left, right) =>
        left.entity_id.localeCompare(right.entity_id)
      );
    } catch {
      this._haAreas = [];
      this._haEntities = [];
      this._setError(this._t("panel.registryLoadError"));
    }
  }

  private _getSelectedArea(): AreaShape | null {
    if (!this._config || !this._selectedAreaId) return null;
    const plan = this._getCurrentPlan();
    if (!plan) return null;
    return (plan.areas ?? []).find((a) => a.id === this._selectedAreaId) ?? null;
  }

  private _onBindAreaChange(e: Event) {
    if (!this._canEdit || !this._config || !this._selectedAreaId) return;
    const select = e.target as HTMLSelectElement;
    const plan = this._getCurrentPlan();
    if (!plan) return;

    void this._commitConfig(
      updateArea(this._config, plan.plan_id, this._selectedAreaId, (area) => ({
        ...area,
        area_id: select.value,
      }))
    );
    this._renderAreas(this._getCurrentPlan());
  }

  private _onAreaTagsChange(event: Event) {
    const area = this._getSelectedArea();
    const plan = this._getCurrentPlan();
    if (!area || !plan || !this._config) return;
    const tags = (event.target as HTMLInputElement).value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    void this._commitConfig(
      updateArea(this._config, plan.plan_id, area.id, (candidate) => ({
        ...candidate,
        tags: [...new Set(tags)],
      }))
    );
    this._renderAreas(this._getCurrentPlan());
  }

  private async _deleteSelectedArea() {
    if (!this._canEdit || !this._config || !this._selectedAreaId) return;
    const plan = this._getCurrentPlan();
    if (!plan) return;
    if (
      !(await this._askConfirm(
        this._t("dialog.deleteAreaMessage"),
        this._t("editor.deleteArea"),
        true
      ))
    )
      return;

    void this._commitConfig(removeArea(this._config, plan.plan_id, this._selectedAreaId));

    this._selectedAreaId = null;
    this._renderFloorplan();
  }

  private _renderMarkers(plan: Plan | null) {
    if (!this._markersLayer) return;
    renderMarkers({
      layer: this._markersLayer,
      stage: this._stage,
      plan,
      view: this._getCurrentView(),
      states: this.hass.states,
      entities: this._haEntities,
      editMode: this._editMode,
      selectedMarkerId: this._selectedMarkerId,
      groups: this._markerGroups,
      onSelect: (markerId) => {
        this._selectedMarkerId = markerId;
        this._selectedAreaId = null;
        this._syncCanvasInteractivity();
      },
      onOpenMoreInfo: (entityId) => this._openMoreInfo(entityId),
      onMove: (markerId, position) => this._updateMarker(markerId, { pos: position }),
    });
  }

  private _refreshMarkerLiveValues() {
    const plan = this._getCurrentPlan();
    if (!plan || !this._markersLayer) return;
    refreshMarkerLiveValues({
      layer: this._markersLayer,
      plan,
      view: this._getCurrentView(),
      states: this.hass.states,
      entities: this._haEntities,
      groups: this._markerGroups,
    });
  }

  private _getSelectedMarker(): Marker | null {
    if (!this._selectedMarkerId) return null;
    return (
      this._getCurrentPlan()?.markers.find((marker) => marker.id === this._selectedMarkerId) ?? null
    );
  }

  private _addMarker() {
    if (!this._canEdit || !this._config || !this._entityToAdd.trim()) return;
    this._addMarkerAt(this._entityToAdd.trim(), this._getVisibleCanvasCenter());
  }

  private _addMarkerAt(entityId: string, position: { x: number; y: number }) {
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
      icon: registryEntry?.icon ?? "mdi:circle",
      label_mode: "auto",
      tags: defaultTagsForEntity(entityId),
      bind: { primary: { source: "state" } },
    };

    void this._commitConfig(addMarker(this._config, plan.plan_id, marker));
    this._selectedMarkerId = marker.id;
    this._selectedAreaId = null;
    this._entityToAdd = "";
    this._renderMarkers(this._getCurrentPlan());
  }

  private _onCanvasDragOver(event: DragEvent) {
    if (!this._editMode || !this._getCurrentPlan()) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
    (event.currentTarget as HTMLElement).classList.add("drag-target");
  }

  private _onCanvasDragLeave(event: DragEvent) {
    (event.currentTarget as HTMLElement).classList.remove("drag-target");
  }

  private _onCanvasDrop(event: DragEvent) {
    event.preventDefault();
    const container = event.currentTarget as HTMLElement;
    container.classList.remove("drag-target");
    if (!this._editMode || !this._stage) return;
    const entityId =
      event.dataTransfer?.getData("application/x-floorplan-entity") ||
      event.dataTransfer?.getData("text/plain");
    if (!entityId) return;

    this._addMarkerAtClientPoint(entityId, event.clientX, event.clientY, container);
  }

  private _onEntityDragStart(entityId: string, event: DragEvent) {
    if (!event.dataTransfer) return;
    this._finishEntityPointerDrag();
    event.dataTransfer.setData("application/x-floorplan-entity", entityId);
    event.dataTransfer.setData("text/plain", entityId);
    event.dataTransfer.effectAllowed = "copy";
  }

  private _onEntityPointerDown(entityId: string, event: PointerEvent) {
    if (!this._editMode || !this._getCurrentPlan() || !event.isPrimary || event.button !== 0) {
      return;
    }
    this._finishEntityPointerDrag();
    const target = event.currentTarget as HTMLElement;
    const palette = target.closest<HTMLElement>(".entity-palette");
    this._entityPointerDrag = {
      entityId,
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      target,
      palette,
      startX: event.clientX,
      startY: event.clientY,
      startScrollTop: palette?.scrollTop ?? 0,
      ready: event.pointerType !== "touch",
      scrolling: false,
      holdTimer: null,
      active: false,
    };
    if (event.pointerType === "touch") {
      const pointerId = event.pointerId;
      this._entityPointerDrag.holdTimer = window.setTimeout(() => {
        const drag = this._entityPointerDrag;
        if (drag?.pointerId === pointerId && !drag.scrolling) drag.ready = true;
      }, ENTITY_TOUCH_DRAG_HOLD_MS);
    }
    try {
      target.setPointerCapture(event.pointerId);
    } catch {
      // Synthetic tests and older WebViews may not expose native pointer capture.
    }
  }

  private _onEntityPointerMove(event: PointerEvent) {
    const drag = this._entityPointerDrag;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    const distance = Math.hypot(deltaX, deltaY);
    if (drag.pointerType === "touch" && !drag.ready) {
      event.preventDefault();
      if (distance >= ENTITY_POINTER_DRAG_THRESHOLD_PX) {
        drag.scrolling = true;
        if (drag.holdTimer !== null) {
          window.clearTimeout(drag.holdTimer);
          drag.holdTimer = null;
        }
        if (drag.palette) drag.palette.scrollTop = drag.startScrollTop - deltaY;
      }
      return;
    }

    if (!drag.active && distance >= ENTITY_POINTER_DRAG_THRESHOLD_PX) {
      drag.active = true;
    }
    if (!drag.active) return;

    event.preventDefault();
    const canvas = this._canvasContainer();
    canvas?.classList.toggle(
      "drag-target",
      this._clientPointIsInside(canvas, event.clientX, event.clientY)
    );
  }

  private _onEntityPointerUp(event: PointerEvent) {
    const drag = this._entityPointerDrag;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const canvas = this._canvasContainer();
    const shouldAdd =
      drag.active && this._clientPointIsInside(canvas, event.clientX, event.clientY);
    this._finishEntityPointerDrag();
    if (shouldAdd && canvas) {
      this._addMarkerAtClientPoint(drag.entityId, event.clientX, event.clientY, canvas);
    }
  }

  private _onEntityPointerCancel(event: PointerEvent) {
    if (this._entityPointerDrag?.pointerId !== event.pointerId) return;
    this._finishEntityPointerDrag();
  }

  private _canvasContainer(): HTMLElement | null {
    return this.renderRoot.querySelector<HTMLElement>(".canvas-container");
  }

  private _clientPointIsInside(
    element: HTMLElement | null,
    clientX: number,
    clientY: number
  ): element is HTMLElement {
    if (!element) return false;
    const bounds = element.getBoundingClientRect();
    return (
      clientX >= bounds.left &&
      clientX <= bounds.right &&
      clientY >= bounds.top &&
      clientY <= bounds.bottom
    );
  }

  private _finishEntityPointerDrag() {
    this._canvasContainer()?.classList.remove("drag-target");
    const drag = this._entityPointerDrag;
    if (drag) {
      if (drag.holdTimer !== null) window.clearTimeout(drag.holdTimer);
      try {
        if (drag.target.hasPointerCapture(drag.pointerId)) {
          drag.target.releasePointerCapture(drag.pointerId);
        }
      } catch {
        // The browser may already have released capture after pointerup/cancel.
      }
    }
    this._entityPointerDrag = null;
  }

  private _addMarkerAtClientPoint(
    entityId: string,
    clientX: number,
    clientY: number,
    container: HTMLElement
  ) {
    if (!this._stage) return;
    const bounds = container.getBoundingClientRect();
    const transform = this._stage.getAbsoluteTransform().copy().invert();
    this._addMarkerAt(
      entityId,
      transform.point({ x: clientX - bounds.left, y: clientY - bounds.top })
    );
  }

  private _updateMarker(markerId: string, updates: Partial<Marker>) {
    if (!this._canEdit || !this._config) return;
    const plan = this._getCurrentPlan();
    if (!plan) return;

    void this._commitConfig(updateMarker(this._config, plan.plan_id, markerId, updates));
  }

  private _onMarkerTagsChange(event: Event) {
    const marker = this._getSelectedMarker();
    if (!marker) return;
    const tags = (event.target as HTMLInputElement).value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    this._updateMarker(marker.id, { tags: [...new Set(tags)] });
    this._renderMarkers(this._getCurrentPlan());
  }

  private _onMarkerAreaChange(event: Event) {
    const marker = this._getSelectedMarker();
    if (!marker) return;
    this._updateMarker(marker.id, {
      area_id: (event.target as HTMLSelectElement).value || null,
    });
    this._renderMarkers(this._getCurrentPlan());
  }

  private _onMarkerLabelModeChange(event: Event) {
    const marker = this._getSelectedMarker();
    if (!marker) return;
    const labelMode = (event.target as HTMLSelectElement).value as Marker["label_mode"];
    this._updateMarker(marker.id, { label_mode: labelMode });
    this._renderMarkers(this._getCurrentPlan());
  }

  private _updateMarkerBinding(
    slot: "primary" | "secondary",
    field: "source" | "attr" | "format",
    event: Event
  ) {
    const marker = this._getSelectedMarker();
    if (!marker) return;
    const value = (event.target as HTMLInputElement | HTMLSelectElement).value;
    const current = marker.bind[slot] ?? { source: "state" as const };
    const binding = {
      ...current,
      [field]: field === "source" ? (value as "state" | "attr") : value || undefined,
      ...(field === "source" && value === "attr" && !current.attr ? { attr: "friendly_name" } : {}),
      ...(field === "attr" && current.source === "attr" && !value ? { attr: "friendly_name" } : {}),
    };
    this._updateMarker(marker.id, {
      bind: { ...marker.bind, [slot]: binding },
    });
    this._renderMarkers(this._getCurrentPlan());
  }

  private _addMarkerSecondaryBinding() {
    const marker = this._getSelectedMarker();
    if (!marker || marker.bind.secondary) return;
    this._updateMarker(marker.id, {
      bind: { ...marker.bind, secondary: { source: "state" } },
    });
    this._renderMarkers(this._getCurrentPlan());
  }

  private _removeMarkerSecondaryBinding() {
    const marker = this._getSelectedMarker();
    if (!marker) return;
    const bind = { ...marker.bind };
    delete bind.secondary;
    this._updateMarker(marker.id, { bind });
    this._renderMarkers(this._getCurrentPlan());
  }

  private async _deleteSelectedMarker() {
    if (!this._canEdit || !this._config || !this._selectedMarkerId) return;
    const plan = this._getCurrentPlan();
    if (
      !plan ||
      !(await this._askConfirm(
        this._t("dialog.deleteMarkerMessage"),
        this._t("editor.deleteMarker"),
        true
      ))
    )
      return;

    void this._commitConfig(removeMarker(this._config, plan.plan_id, this._selectedMarkerId));
    this._selectedMarkerId = null;
    this._renderMarkers(this._getCurrentPlan());
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
    this._selectedAreaId = kind === "area" ? id : null;
    this._selectedMarkerId = kind === "marker" ? id : null;
    this._renderAreas(this._getCurrentPlan());
    this._syncCanvasInteractivity();
    this.requestUpdate();
  }

  private _onCanvasKeydown(event: KeyboardEvent): void {
    if (!this._canEdit || !this._editMode) return;
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
      event.preventDefault();
      if (event.shiftKey) this._redo();
      else this._undo();
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
    this._currentView = viewId;
  }

  private async _addView() {
    if (!this._canEdit || !this._config) return;
    const name = (await this._askText(this._t("dialog.newView")))?.trim();
    if (!name) return;

    const view = createView(name, this._config.views);
    void this._commitConfig({
      ...this._config,
      views: [...this._config.views, view],
    });
    this._currentView = view.id;
  }

  private async _renameCurrentView() {
    if (!this._canEdit || !this._config) return;
    const view = this._getCurrentView();
    if (!view) return;
    const name = (await this._askText(this._t("dialog.renameView"), view.name))?.trim();
    if (!name || name === view.name) return;
    void this._commitConfig(
      updateView(this._config, view.id, (candidate) => ({ ...candidate, name }))
    );
  }

  private _moveCurrentView(direction: -1 | 1) {
    if (!this._canEdit || !this._config) return;
    const config = moveView(this._config, this._currentView, direction);
    if (config) void this._commitConfig(config);
  }

  private _setDefaultView() {
    if (!this._canEdit || !this._config) return;
    void this._commitConfig({ ...this._config, default_view: this._currentView });
    this._setNotice(
      this._t("panel.defaultView", { name: this._getCurrentView()?.name ?? this._currentView })
    );
  }

  private async _deleteCurrentView() {
    if (
      !this._canEdit ||
      !this._config ||
      this._currentView === "all" ||
      this._config.views.length <= 1
    )
      return;
    if (
      !(await this._askConfirm(
        this._t("dialog.deleteViewMessage"),
        this._t("editor.deleteView"),
        true
      ))
    )
      return;

    const result = removeView(this._config, this._currentView);
    if (!result) return;
    void this._commitConfig(result.config);
    this._currentView = result.nextViewId;
  }

  private _updateViewFilter(filterName: "domains" | "tags" | "area_ids", event: Event) {
    if (!this._canEdit || !this._config) return;
    const values = (event.target as HTMLInputElement).value
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    void this._commitConfig(
      updateView(this._config, this._currentView, (view) => {
        const filters: View["filters"] = { ...view.filters };
        filters[filterName] = values.length ? [...new Set(values)] : undefined;
        return { ...view, filters };
      })
    );
    this._renderMarkers(this._getCurrentPlan());
    this._renderAreas(this._getCurrentPlan());
  }

  private _updateAreaOverlayValue(
    slot: "primary" | "secondary",
    field: "entity_id" | "source" | "attr" | "format",
    event: Event
  ) {
    if (!this._canEdit || !this._config) return;
    const value = (event.target as HTMLInputElement | HTMLSelectElement).value.trim();
    void this._commitConfig(
      updateView(this._config, this._currentView, (view) => {
        const areaOverlay = { ...view.area_overlay };
        if (field === "entity_id" && !value) {
          delete areaOverlay[slot];
        } else {
          const current: ValueSpec = areaOverlay[slot] ?? {
            mode: "entity",
            entity_id: value,
            source: "state",
          };
          if (field !== "entity_id" && !current.entity_id) return view;
          areaOverlay[slot] = {
            ...current,
            [field]: field === "source" ? (value as "state" | "attr") : value || undefined,
            ...(field === "source" && value === "attr" && !current.attr
              ? { attr: "friendly_name" }
              : {}),
            ...(field === "attr" && current.source === "attr" && !value
              ? { attr: "friendly_name" }
              : {}),
          };
        }
        return { ...view, area_overlay: areaOverlay };
      })
    );
    this._renderAreas(this._getCurrentPlan());
  }

  private _updateAreaBadges(event: Event) {
    if (!this._canEdit || !this._config) return;
    const raw = (event.target as HTMLInputElement).value;
    const badges = raw
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .flatMap<BadgeSpec>((entry) => {
        const [condition, label] = entry.split(":", 2);
        const [entityId, stateIs] = condition.split("=", 2).map((value) => value.trim());
        if (!entityId || !stateIs) return [];
        const trimmedLabel = label?.trim();
        return [
          {
            entity_id: entityId,
            when: { state_is: stateIs },
            ...(trimmedLabel ? { label: trimmedLabel } : {}),
          },
        ];
      });

    void this._commitConfig(
      updateView(this._config, this._currentView, (view) => ({
        ...view,
        area_overlay: {
          ...view.area_overlay,
          badges: badges.length ? badges : undefined,
        },
      }))
    );
    this._renderAreas(this._getCurrentPlan());
  }

  private _updateAreaStyle(field: "fill" | "stroke" | "fillOpacity" | "strokeWidth", event: Event) {
    const area = this._getSelectedArea();
    if (!area) return;
    const input = event.target as HTMLInputElement;
    let value: string | number =
      field === "fill" || field === "stroke" ? input.value : Number(input.value);
    if (typeof value === "number" && !Number.isFinite(value)) return;
    if (field === "fillOpacity" && typeof value === "number") {
      value = Math.max(0, Math.min(1, value));
    }
    if (field === "strokeWidth" && typeof value === "number") {
      value = Math.max(0, Math.min(50, value));
    }

    const plan = this._getCurrentPlan();
    if (!this._config || !plan) return;
    void this._commitConfig({
      ...this._config,
      plans: this._config.plans.map((candidate) =>
        candidate.plan_id === plan.plan_id
          ? {
              ...candidate,
              areas: candidate.areas.map((candidateArea) =>
                candidateArea.id === area.id
                  ? { ...candidateArea, style: { ...candidateArea.style, [field]: value } }
                  : candidateArea
              ),
            }
          : candidate
      ),
    });
    this._renderAreas(this._getCurrentPlan());
  }

  private async _exportConfig() {
    if (!this._config) return;
    try {
      const portable = await createPortableConfig(this.hass, this._config);
      const blob = new Blob([JSON.stringify(portable)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `floorplan-ui-config-v${this._config.version}.json`;
      link.click();
      URL.revokeObjectURL(url);
      this._setNotice(this._t("panel.exported"));
    } catch (error) {
      const message = error instanceof Error ? error.message : this._t("panel.exportFailed");
      this._setError(message);
    }
  }

  private _triggerConfigImport() {
    if (!this._canEdit) return;
    (this.renderRoot.querySelector(".config-file-input") as HTMLInputElement)?.click();
  }

  private async _handleConfigImport(event: Event) {
    if (!this._canEdit) return;
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    if (file.size > MAX_PORTABLE_CONFIG_BYTES) {
      this._setError(this._t("panel.configTooLarge"));
      return;
    }

    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("The JSON root must be an object.");
      }
      const imported = parsed as {
        plans?: unknown;
        views?: unknown;
      };
      const planCount = Array.isArray(imported.plans) ? imported.plans.length : 0;
      const viewCount = Array.isArray(imported.views) ? imported.views.length : 0;
      if (
        !(await this._askConfirm(
          this._t("dialog.importMessage", { plans: planCount, views: viewCount }),
          this._t("dialog.import")
        ))
      )
        return;

      const materialized = await materializeImportedImages(this.hass, parsed as FloorplanConfig);
      const validated = await validateFloorplanConfig(this.hass, materialized);

      this._currentPlanId = validated.plans[0]?.plan_id ?? null;
      this._currentView = validated.views.some((view) => view.id === validated.default_view)
        ? (validated.default_view ?? "all")
        : (validated.views[0]?.id ?? "all");
      this._selectedAreaId = null;
      this._selectedMarkerId = null;
      const saved = await this._commitConfig(validated);
      if (!saved) return;
      this._renderFloorplan();
      this._setNotice(this._t("panel.imported"));
    } catch (err) {
      const message = err instanceof Error ? err.message : this._t("panel.invalidConfig");
      this._setError(this._t("panel.importFailed", { message }));
    }
  }

  private async _handleFileUpload(e: Event) {
    if (!this._canEdit) return;
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      this._setError(this._t("panel.imageTypeError"));
      return;
    }
    if (file.size > MAX_IMAGE_FILE_BYTES) {
      this._setError(this._t("panel.imageTooLarge"));
      return;
    }

    let image: ImageBitmap | null = null;
    try {
      image = await createImageBitmap(file);
      const background = await uploadFloorplanImage(this.hass, file);
      this._createNewPlan(file.name, {
        type: "image",
        asset_id: background.asset_id,
        content_type: background.content_type,
        url: background.url,
        width: image.width,
        height: image.height,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : this._t("panel.imageUploadFailed");
      this._setError(message);
    } finally {
      image?.close();
    }
  }

  private _createNewPlan(name: string, background: FloorplanBackground) {
    if (!this._canEdit || !this._config) return;

    const planId = this._newId("plan");
    void this._commitConfig(addPlan(this._config, createPlan(planId, name, background)));
    this._currentPlanId = planId;
    this._renderFloorplan();
  }

  private _triggerFileUpload() {
    (this.renderRoot.querySelector(".file-input") as HTMLInputElement)?.click();
  }

  private _getVisibleCanvasCenter(): { x: number; y: number } {
    if (!this._stage) return { x: 0, y: 0 };
    return getVisibleStageCenter(this._stage);
  }

  private _newId(prefix: string): string {
    return `${prefix}_${globalThis.crypto.randomUUID()}`;
  }

  private _renderEditor(
    currentPlan: Plan | null,
    currentView: View | undefined,
    selectedArea: AreaShape | null,
    selectedMarker: Marker | null
  ) {
    const entitySearch = this._entitySearch.trim().toLowerCase();
    const entityDomains = [...new Set(this._haEntities.map((entity) => entity.domain))].sort();
    const entityOptions = this._haEntities
      .filter((entity) => {
        const matchesSearch =
          !entitySearch ||
          entity.entity_id.toLowerCase().includes(entitySearch) ||
          Boolean(entity.name?.toLowerCase().includes(entitySearch));
        const matchesDomain =
          !this._entityDomainFilter || entity.domain === this._entityDomainFilter;
        const matchesArea = !this._entityAreaFilter || entity.area_id === this._entityAreaFilter;
        return matchesSearch && matchesDomain && matchesArea;
      })
      .slice(0, 250);

    return renderFloorplanEditor(
      {
        currentPlan,
        currentView,
        currentViewId: this._currentView,
        selectedArea,
        selectedMarker,
        areas: this._haAreas,
        entityCount: this._haEntities.length,
        entityOptions,
        entityDomains,
        entitySearch: this._entitySearch,
        entityDomainFilter: this._entityDomainFilter,
        entityAreaFilter: this._entityAreaFilter,
        entityToAdd: this._entityToAdd,
        canUndo: this._history.canUndo,
        canRedo: this._history.canRedo,
      },
      {
        uploadImage: () => this._triggerFileUpload(),
        undo: () => this._undo(),
        redo: () => this._redo(),
        renamePlan: () => this._renameCurrentPlan(),
        deletePlan: () => this._deleteCurrentPlan(),
        addAreaRect: () => this._addAreaRect(),
        addAreaPolygon: () => this._addAreaPolygon(),
        addView: () => this._addView(),
        renameView: () => this._renameCurrentView(),
        moveView: (direction) => this._moveCurrentView(direction),
        setDefaultView: () => this._setDefaultView(),
        deleteView: () => this._deleteCurrentView(),
        exportConfig: () => this._exportConfig(),
        importConfig: () => this._triggerConfigImport(),
        setEntitySearch: (value) => {
          this._entitySearch = value;
        },
        setEntityDomainFilter: (value) => {
          this._entityDomainFilter = value;
        },
        setEntityAreaFilter: (value) => {
          this._entityAreaFilter = value;
        },
        setEntityToAdd: (value) => {
          this._entityToAdd = value;
        },
        addMarker: () => this._addMarker(),
        startEntityDrag: (entityId, event) => this._onEntityDragStart(entityId, event),
        startEntityPointerDrag: (entityId, event) => this._onEntityPointerDown(entityId, event),
        updateViewFilter: (filterName, event) => this._updateViewFilter(filterName, event),
        updateAreaOverlay: (slot, field, event) => this._updateAreaOverlayValue(slot, field, event),
        updateAreaBadges: (event) => this._updateAreaBadges(event),
        bindArea: (event) => this._onBindAreaChange(event),
        updateAreaTags: (event) => this._onAreaTagsChange(event),
        updateAreaStyle: (field, event) => this._updateAreaStyle(field, event),
        deleteArea: () => this._deleteSelectedArea(),
        updateMarkerTags: (event) => this._onMarkerTagsChange(event),
        updateMarkerArea: (event) => this._onMarkerAreaChange(event),
        updateMarkerLabelMode: (event) => this._onMarkerLabelModeChange(event),
        updateMarkerBinding: (slot, field, event) => this._updateMarkerBinding(slot, field, event),
        addMarkerSecondaryBinding: () => this._addMarkerSecondaryBinding(),
        removeMarkerSecondaryBinding: () => this._removeMarkerSecondaryBinding(),
        deleteMarker: () => this._deleteSelectedMarker(),
      },
      this._t
    );
  }

  protected render() {
    const fallbackViews: View[] = [
      { id: "all", name: "All", filters: {} },
      { id: "heating", name: "Heating", filters: { tags: ["heating"] } },
      { id: "lights", name: "Lights", filters: { domains: ["light", "switch"] } },
      { id: "network", name: "Network", filters: { tags: ["network"] } },
      { id: "entertainment", name: "Entertainment", filters: { domains: ["media_player"] } },
    ];
    const views = this._config?.views.length ? this._config.views : fallbackViews;
    const plans = this._config?.plans ?? [];
    const currentPlan = this._getCurrentPlan();
    const currentView = this._getCurrentView();
    const selectedArea = this._getSelectedArea();
    const selectedMarker = this._getSelectedMarker();

    const t = this._t;
    return html`
      <div class="container ${this.narrow ? "narrow" : ""}">
        <div class="toolbar">
          <div class="toolbar-left">
            <h1>${t("panel.title")}</h1>
            <label class="plan-select">
              <span>${t("panel.plan")}</span>
              <select @change=${this._selectPlan}>
                <option value="" ?selected=${!currentPlan}>${t("panel.selectPlan")}</option>
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
            </label>
            <div class="view-tabs" role="tablist">
              ${views.map(
                (view) => html`
                  <button
                    class="view-tab ${this._currentView === view.id ? "active" : ""}"
                    role="tab"
                    aria-selected=${this._currentView === view.id ? "true" : "false"}
                    @click=${() => this._setView(view.id)}
                  >
                    ${view.id === this._config?.default_view ? "★ " : ""}${view.name}
                  </button>
                `
              )}
            </div>
          </div>
          <div class="toolbar-right">
            ${this._canEdit
              ? html`
                  <button
                    class="edit-toggle ${this._editMode ? "active" : ""}"
                    aria-pressed=${this._editMode ? "true" : "false"}
                    @click=${this._toggleEditMode}
                  >
                    ${this._editMode ? t("panel.done") : t("panel.edit")}
                  </button>
                `
              : html`<span class="viewer-note">${t("panel.viewOnly")}</span>`}
          </div>
        </div>

        ${this._saveState === "pending"
          ? html`<div class="status" role="status" aria-live="polite">${t("panel.pending")}</div>`
          : ""}
        ${this._saveState === "saving"
          ? html`<div class="status" role="status" aria-live="polite">${t("panel.saving")}</div>`
          : ""}
        ${this._notice
          ? html`<div class="status" role="status" aria-live="polite">${this._notice}</div>`
          : ""}
        ${this._error
          ? html`
              <div class="status error" role="alert">
                ${this._error}
                ${this._saveState === "failed"
                  ? this._saveConflict
                    ? html`
                        <button type="button" @click=${this._reloadAfterConflict}>
                          ${t("panel.reload")}
                        </button>
                      `
                    : html`<button type="button" @click=${this._retrySave}>
                        ${t("panel.retry")}
                      </button>`
                  : ""}
              </div>
            `
          : ""}
        <div class="workspace ${this._editMode ? "editing" : ""}">
          ${this._editMode
            ? this._renderEditor(currentPlan, currentView, selectedArea, selectedMarker)
            : ""}

          <input
            type="file"
            class="file-input"
            aria-label=${t("panel.upload")}
            accept="image/png,image/jpeg"
            @change=${this._handleFileUpload}
          />
          <input
            type="file"
            class="config-file-input"
            aria-label=${t("editor.import")}
            accept="application/json,.json"
            @change=${this._handleConfigImport}
          />

          <div
            class="canvas-container"
            role="application"
            tabindex="0"
            aria-label=${t("panel.canvas")}
            @keydown=${this._onCanvasKeydown}
            @dragover=${this._onCanvasDragOver}
            @dragleave=${this._onCanvasDragLeave}
            @drop=${this._onCanvasDrop}
          >
            ${this._loading
              ? html`<div class="loading" role="status">${t("panel.loading")}</div>`
              : html`<div class="canvas-wrapper"></div>`}
            <section class="canvas-accessibility" aria-label=${t("panel.objects")}>
              <ul>
                ${currentPlan?.areas.map(
                  (area) => html`
                    <li>
                      ${this._editMode
                        ? html`<button
                            type="button"
                            aria-pressed=${this._selectedAreaId === area.id ? "true" : "false"}
                            @click=${() => this._selectCanvasObject("area", area.id)}
                          >
                            ${t("panel.areaObject", { id: area.id })}
                          </button>`
                        : t("panel.areaObject", { id: area.id })}
                    </li>
                  `
                )}
                ${currentPlan?.markers.map(
                  (marker) => html`
                    <li>
                      <button
                        type="button"
                        aria-pressed=${this._editMode && this._selectedMarkerId === marker.id
                          ? "true"
                          : "false"}
                        @click=${() =>
                          this._editMode
                            ? this._selectCanvasObject("marker", marker.id)
                            : this._openMoreInfo(marker.entity_id)}
                      >
                        ${t("panel.markerObject", { entity: marker.entity_id })}
                      </button>
                    </li>
                  `
                )}
              </ul>
            </section>
          </div>
        </div>
        <floorplan-dialog
          .dialog=${this._dialog}
          .cancelLabel=${t("dialog.cancel")}
          @floorplan-dialog-resolve=${(event: CustomEvent<PanelDialogResult>) =>
            this._resolveDialog(event.detail)}
        ></floorplan-dialog>
      </div>
    `;
  }
}
