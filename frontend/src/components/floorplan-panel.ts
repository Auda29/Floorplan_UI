/**
 * Floorplan Panel - Main HA panel component
 * Uses Lit for the panel shell and Konva for the canvas
 */

import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import Konva from "konva";
import type {
  HomeAssistant,
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
import {
  defaultTagsForEntity,
  getActiveBadges,
  getDomainGlyph,
  getMarkerLabel,
  getMarkerColor,
  getMarkerValue,
  markerMatchesView,
  resolveValueSpec,
} from "../lib/marker-utils";

const MAX_IMAGE_FILE_BYTES = 4_000_000;
const MAX_CONFIG_FILE_BYTES = 20_000_000;
const LIVE_REFRESH_DELAY_MS = 500;

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

  private _stage: Konva.Stage | null = null;
  private _backgroundLayer: Konva.Layer | null = null;
  private _resizeObserver: ResizeObserver | null = null;
  private _areasLayer: Konva.Layer | null = null;
  private _markersLayer: Konva.Layer | null = null;
  private _areaShapes: Map<string, Konva.Shape> = new Map();
  private _markerGroups: Map<string, Konva.Group> = new Map();
  private _renderGeneration = 0;
  private _initializeTimer: number | null = null;
  private _liveRefreshTimer: number | null = null;

  private get _canEdit(): boolean {
    return this.hass?.user?.is_admin === true;
  }

  static styles = css`
    :host {
      display: block;
      height: 100%;
      background: var(--primary-background-color, #fafafa);
    }

    .container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: var(--app-header-background-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      min-height: 48px;
      box-sizing: border-box;
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
    }

    .plan-select {
      display: flex;
      align-items: center;
      gap: 8px;
      color: inherit;
      font-size: 14px;
    }

    .plan-select select {
      padding: 4px 8px;
      border-radius: 4px;
      border: none;
      font-size: 14px;
    }

    .view-tabs {
      display: flex;
      gap: 4px;
    }

    .view-tab {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.2);
      color: inherit;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }

    .view-tab:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .view-tab.active {
      background: rgba(255, 255, 255, 0.95);
      color: var(--app-header-background-color, #03a9f4);
    }

    .edit-toggle {
      padding: 6px 16px;
      border: 2px solid rgba(255, 255, 255, 0.8);
      border-radius: 4px;
      background: transparent;
      color: inherit;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
    }

    .edit-toggle:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .edit-toggle.active {
      background: rgba(255, 255, 255, 0.95);
      color: var(--app-header-background-color, #03a9f4);
      border-color: transparent;
    }

    .canvas-container {
      flex: 1;
      position: relative;
      overflow: hidden;
      background: #f5f5f5;
      min-height: 400px;
    }

    .canvas-wrapper {
      width: 100%;
      height: 100%;
    }

    .loading,
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      gap: 16px;
      color: var(--secondary-text-color, #666);
      text-align: center;
      padding: 20px;
    }

    .empty-state h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
      color: var(--primary-text-color, #333);
    }

    .empty-state p {
      margin: 0;
      font-size: 16px;
      max-width: 400px;
    }

    .empty-state .upload-btn {
      padding: 12px 24px;
      border: none;
      border-radius: 4px;
      background: var(--primary-color, #03a9f4);
      color: #fff;
      cursor: pointer;
      font-size: 16px;
      font-weight: 500;
    }

    .empty-state .upload-btn:hover {
      opacity: 0.9;
    }

    .file-input,
    .config-file-input {
      display: none;
    }

    .edit-toolbar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: #e8e8e8;
      border-bottom: 1px solid #ddd;
    }

    .edit-toolbar button {
      padding: 8px 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: #fff;
      cursor: pointer;
      font-size: 14px;
    }

    .edit-toolbar button:hover {
      background: #f0f0f0;
    }

    .edit-toolbar input,
    .edit-toolbar select {
      min-width: 140px;
      padding: 6px 8px;
      border: 1px solid #bbb;
      border-radius: 4px;
      background: #fff;
    }

    .edit-toolbar .grow {
      flex: 1;
      min-width: 180px;
    }

    .entity-palette {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding: 4px 0;
      flex: 1;
      min-width: 240px;
    }

    .entity-card {
      display: flex;
      flex-direction: column;
      min-width: 180px;
      max-width: 240px;
      padding: 7px 10px;
      border: 1px solid #bbb;
      border-radius: 6px;
      background: #fff;
      cursor: grab;
      font-size: 12px;
      user-select: none;
    }

    .entity-card strong,
    .entity-card span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .entity-card span {
      color: #666;
    }

    .canvas-container.drag-target {
      outline: 3px dashed var(--primary-color, #03a9f4);
      outline-offset: -6px;
    }

    .status {
      padding: 6px 16px;
      background: #e8f5e9;
      color: #1b5e20;
      font-size: 13px;
    }

    .status.error {
      background: #ffebee;
      color: #b71c1c;
    }

    .viewer-note {
      font-size: 12px;
      opacity: 0.85;
    }

    @media (max-width: 900px) {
      .toolbar,
      .toolbar-left,
      .edit-toolbar {
        align-items: flex-start;
        flex-wrap: wrap;
      }

      .view-tabs {
        flex-wrap: wrap;
      }
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    await this._loadConfig();
    if (this._canEdit) {
      await this._loadRegistry();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._initializeTimer !== null) {
      window.clearTimeout(this._initializeTimer);
      this._initializeTimer = null;
    }
    if (this._liveRefreshTimer !== null) {
      window.clearTimeout(this._liveRefreshTimer);
      this._liveRefreshTimer = null;
    }
    this._destroyStage();
  }

  private async _loadConfig() {
    this._loading = true;
    try {
      this._config = await this.hass.callWS<FloorplanConfig>({
        type: "floorplan_ui/get_config",
      });
      if (this._config.plans.length > 0) {
        this._currentPlanId = this._config.plans[0].plan_id;
      }
      if (
        this._config.default_view &&
        this._config.views.some((view) => view.id === this._config?.default_view)
      ) {
        this._currentView = this._config.default_view;
      }
    } catch (err) {
      console.error("Failed to load floorplan config:", err);
      this._config = { version: 1, plans: [], views: [] };
      this._setError("Floorplan configuration could not be loaded.");
    }
    this._loading = false;
  }

  public async saveConfig(): Promise<boolean> {
    if (!this._config || !this._canEdit) return false;
    try {
      await this.hass.callWS({
        type: "floorplan_ui/save_config",
        config: this._config,
      });
      this._setNotice("Changes saved.");
      return true;
    } catch (err) {
      console.error("Failed to save floorplan config:", err);
      this._setError("Changes could not be saved.");
      return false;
    }
  }

  protected async updated(changedProps: Map<string, unknown>) {
    // Initialize stage after loading completes
    if (changedProps.has("_loading") && !this._loading && !this._stage) {
      await this.updateComplete;
      // Small delay to ensure DOM is ready
      this._initializeTimer = window.setTimeout(() => {
        this._initializeTimer = null;
        this._initializeStage();
      }, 100);
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

  private _initializeStage() {
    const container = this.renderRoot.querySelector(".canvas-wrapper") as HTMLDivElement;
    if (!container) {
      console.warn("Canvas container not found");
      return;
    }

    const rect = container.getBoundingClientRect();
    const width = Math.max(rect.width, 400);
    const height = Math.max(rect.height, 300);

    console.info(`Initializing Konva stage: ${width}x${height}`);

    this._stage = new Konva.Stage({
      container,
      width,
      height,
      draggable: true,
    });

    this._backgroundLayer = new Konva.Layer();
    this._stage.add(this._backgroundLayer);

    this._areasLayer = new Konva.Layer();
    this._stage.add(this._areasLayer);

    this._markersLayer = new Konva.Layer();
    this._stage.add(this._markersLayer);

    // Clear selection when clicking on empty canvas in edit mode
    this._stage.on("click", (e) => {
      if (!this._editMode) return;
      // Ignore clicks on shapes (they handle their own selection)
      if (e.target === this._stage) {
        this._selectedAreaId = null;
        this._selectedMarkerId = null;
        this._renderAreas(this._getCurrentPlan());
        this._syncCanvasInteractivity();
      }
    });

    // Zoom with mouse wheel
    this._stage.on("wheel", (e) => {
      e.evt.preventDefault();
      const oldScale = this._stage!.scaleX();
      const pointer = this._stage!.getPointerPosition();
      if (!pointer) return;

      const mousePointTo = {
        x: (pointer.x - this._stage!.x()) / oldScale,
        y: (pointer.y - this._stage!.y()) / oldScale,
      };

      const currentPlan = this._getCurrentPlan();
      const minZoom = currentPlan?.view.minZoom ?? 0.1;
      const maxZoom = currentPlan?.view.maxZoom ?? 5;
      const direction = e.evt.deltaY > 0 ? -1 : 1;
      const newScale = direction > 0 ? oldScale * 1.1 : oldScale / 1.1;
      const clampedScale = Math.max(minZoom, Math.min(maxZoom, newScale));

      this._stage!.scale({ x: clampedScale, y: clampedScale });
      this._stage!.position({
        x: pointer.x - mousePointTo.x * clampedScale,
        y: pointer.y - mousePointTo.y * clampedScale,
      });
    });

    // Resize observer
    this._resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0 && this._stage) {
          this._stage.width(width);
          this._stage.height(height);
        }
      }
    });
    this._resizeObserver.observe(container);

    this._renderFloorplan();
  }

  private _destroyStage() {
    this._renderGeneration += 1;
    this._resizeObserver?.disconnect();
    this._stage?.destroy();
    this._stage = null;
    this._backgroundLayer = null;
    this._areasLayer = null;
    this._markersLayer = null;
    this._areaShapes.clear();
    this._markerGroups.clear();
  }

  private _getCurrentPlan(): Plan | null {
    if (!this._config || !this._currentPlanId) return null;
    const plan = this._config.plans.find((p) => p.plan_id === this._currentPlanId) || null;

    // If the current plan id no longer exists (e.g. after deletion), reset selection
    if (!plan && this._config.plans.length > 0) {
      this._currentPlanId = this._config.plans[0].plan_id;
      return this._config.plans[0];
    }

    return plan;
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
    } else if (plan.background?.url) {
      this._renderAreas(plan);
      this._renderMarkers(plan);

      // Load background image
      const imageObj = new Image();
      imageObj.onload = () => {
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
        } catch (err) {
          console.error("Error rendering floorplan image:", err);
          this._backgroundLayer!.destroyChildren();
          this._drawImageErrorState(stageWidth, stageHeight);
        }
      };
      imageObj.onerror = () => {
        if (generation !== this._renderGeneration) return;
        console.error("Failed to load floorplan image");
        this._backgroundLayer!.destroyChildren();
        this._drawImageErrorState(stageWidth, stageHeight);
      };
      imageObj.src = plan.background.url;
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
    const stageWidth = this._stage.width();
    const stageHeight = this._stage.height();
    const scale = Math.min(stageWidth / imgWidth, stageHeight / imgHeight) * 0.9;

    this._stage.scale({ x: scale, y: scale });
    this._stage.position({
      x: (stageWidth - imgWidth * scale) / 2,
      y: (stageHeight - imgHeight * scale) / 2,
    });
  }

  private _toggleEditMode() {
    if (!this._canEdit) return;
    this._editMode = !this._editMode;
    if (!this._editMode) {
      this._selectedAreaId = null;
      this._selectedMarkerId = null;
    }
    this._renderAreas(this._getCurrentPlan());
    this._syncCanvasInteractivity();
  }

  private _selectPlan(e: Event) {
    if (!this._config) return;
    const select = e.target as HTMLSelectElement;
    const planId = select.value || null;
    this._currentPlanId = planId;
  }

  private _renameCurrentPlan() {
    if (!this._canEdit || !this._config || !this._currentPlanId) return;
    const plan = this._config.plans.find((p) => p.plan_id === this._currentPlanId);
    if (!plan) return;

    const newName = window.prompt("Rename plan", plan.name);
    if (!newName) return;

    const trimmed = newName.trim();
    if (!trimmed || trimmed === plan.name) return;

    this._config = {
      ...this._config,
      plans: this._config.plans.map((p) =>
        p.plan_id === this._currentPlanId ? { ...p, name: trimmed } : p
      ),
    };
    void this.saveConfig();
  }

  private _deleteCurrentPlan() {
    if (!this._canEdit || !this._config || !this._currentPlanId) return;
    if (!window.confirm("Delete current plan? This cannot be undone.")) return;

    const remainingPlans = this._config.plans.filter((p) => p.plan_id !== this._currentPlanId);

    this._config = {
      ...this._config,
      plans: remainingPlans,
    };

    if (remainingPlans.length > 0) {
      this._currentPlanId = remainingPlans[0].plan_id;
    } else {
      this._currentPlanId = null;
    }

    void this.saveConfig();
    this._renderFloorplan();
  }

  private _renderAreas(plan: Plan | null) {
    if (!this._areasLayer || !plan) return;

    this._areasLayer.destroyChildren();
    this._areaShapes.clear();
    const currentView = this._getCurrentView();

    for (const area of plan.areas ?? []) {
      const areaFilter = currentView?.filters.area_ids;
      if (areaFilter?.length && (!area.area_id || !areaFilter.includes(area.area_id))) {
        continue;
      }
      const tagFilter = currentView?.filters.tags;
      if (tagFilter?.length && !tagFilter.some((tag) => area.tags.includes(tag))) {
        continue;
      }

      const { shape, style } = area;
      let areaShape: Konva.Shape;
      if (shape.type === "polygon" && (shape.points?.length ?? 0) >= 6) {
        areaShape = new Konva.Line({
          x: shape.x ?? 0,
          y: shape.y ?? 0,
          points: shape.points,
          closed: true,
          fill: style.fill ?? "#2196f3",
          stroke: style.stroke ?? "#1976d2",
          strokeWidth: style.strokeWidth ?? 2,
          opacity: style.fillOpacity ?? 0.4,
          draggable: this._editMode,
        });
      } else if (shape.type === "rect") {
        areaShape = new Konva.Rect({
          x: shape.x ?? 0,
          y: shape.y ?? 0,
          width: shape.width ?? 100,
          height: shape.height ?? 80,
          fill: style.fill ?? "#2196f3",
          stroke: style.stroke ?? "#1976d2",
          strokeWidth: style.strokeWidth ?? 2,
          opacity: style.fillOpacity ?? 0.4,
          draggable: this._editMode,
        });
      } else {
        continue;
      }

      areaShape.on("click", (evt) => {
        evt.cancelBubble = true;
        if (!this._editMode) return;
        this._onAreaSelected(area.id);
      });

      areaShape.on("dragend", () => {
        if (!this._editMode) return;
        const pos = areaShape.position();
        this._updateAreaShape(area.id, {
          x: pos.x,
          y: pos.y,
        });
        this._renderAreas(this._getCurrentPlan());
      });

      this._areasLayer.add(areaShape);
      this._areaShapes.set(area.id, areaShape);

      this._addAreaAnnotation(area, areaShape, currentView);

      if (this._editMode && this._selectedAreaId === area.id) {
        if (shape.type === "polygon" && areaShape instanceof Konva.Line) {
          this._addPolygonAnchors(area, areaShape);
        } else if (shape.type === "rect" && areaShape instanceof Konva.Rect) {
          this._addRectangleTransformer(area.id, areaShape);
        }
      }
    }

    this._syncCanvasInteractivity();
  }

  private _addAreaAnnotation(area: AreaShape, areaShape: Konva.Shape, view: View | undefined) {
    if (!this._areasLayer) return;
    const lines: string[] = [];
    const areaName = this._haAreas.find((entry) => entry.id === area.area_id)?.name;
    if (area.area_id) lines.push(areaName ?? area.area_id);

    const primary = resolveValueSpec(view?.area_overlay?.primary, this.hass.states);
    const secondary = resolveValueSpec(view?.area_overlay?.secondary, this.hass.states);
    if (primary) lines.push(primary);
    if (secondary) lines.push(secondary);
    for (const badge of getActiveBadges(view?.area_overlay?.badges, this.hass.states)) {
      lines.push(`${badge.icon ? `${badge.icon} ` : ""}${badge.label ?? badge.entity_id}`);
    }
    if (!lines.length) return;

    const bounds = areaShape.getClientRect({ relativeTo: this._areasLayer });
    const label = new Konva.Label({
      x: bounds.x + 8,
      y: bounds.y + 8,
      listening: false,
    });
    label.add(
      new Konva.Tag({
        fill: "rgba(255,255,255,0.88)",
        cornerRadius: 4,
        shadowColor: "rgba(0,0,0,0.25)",
        shadowBlur: 3,
      }),
      new Konva.Text({
        text: lines.join("\n"),
        fontSize: 13,
        fontStyle: "bold",
        fill: "#0d47a1",
        padding: 5,
        lineHeight: 1.2,
      })
    );
    this._areasLayer.add(label);
  }

  private _addPolygonAnchors(area: AreaShape, line: Konva.Line) {
    if (!this._areasLayer || !area.shape.points) return;
    const points = [...area.shape.points];
    const originX = area.shape.x ?? 0;
    const originY = area.shape.y ?? 0;

    for (let index = 0; index < points.length; index += 2) {
      const anchor = new Konva.Circle({
        x: originX + points[index],
        y: originY + points[index + 1],
        radius: 7,
        fill: "#ffffff",
        stroke: "#d32f2f",
        strokeWidth: 3,
        draggable: true,
      });
      anchor.on("dragmove", () => {
        points[index] = anchor.x() - originX;
        points[index + 1] = anchor.y() - originY;
        line.points(points);
        this._areasLayer?.batchDraw();
      });
      anchor.on("dragend", () => {
        this._updateAreaShape(area.id, { points: [...points] });
        this._renderAreas(this._getCurrentPlan());
      });
      this._areasLayer.add(anchor);
    }
  }

  private _addRectangleTransformer(areaId: string, rectangle: Konva.Rect) {
    if (!this._areasLayer) return;
    const transformer = new Konva.Transformer({
      nodes: [rectangle],
      rotateEnabled: false,
      keepRatio: false,
      anchorSize: 9,
      boundBoxFunc: (oldBox, newBox) => (newBox.width < 20 || newBox.height < 20 ? oldBox : newBox),
    });
    rectangle.on("transformend", () => {
      const width = Math.max(20, rectangle.width() * rectangle.scaleX());
      const height = Math.max(20, rectangle.height() * rectangle.scaleY());
      rectangle.scale({ x: 1, y: 1 });
      this._updateAreaShape(areaId, {
        x: rectangle.x(),
        y: rectangle.y(),
        width,
        height,
      });
      this._renderAreas(this._getCurrentPlan());
    });
    this._areasLayer.add(transformer);
  }

  private _syncCanvasInteractivity() {
    const areas = new Map(
      (this._getCurrentPlan()?.areas ?? []).map((area) => [area.id, area] as const)
    );
    for (const [id, areaShape] of this._areaShapes.entries()) {
      areaShape.draggable(this._editMode);
      const baseStrokeWidth = areas.get(id)?.style.strokeWidth ?? 2;
      areaShape.strokeWidth(baseStrokeWidth + (this._selectedAreaId === id ? 2 : 0));
    }

    for (const [id, markerGroup] of this._markerGroups.entries()) {
      markerGroup.draggable(this._editMode);
      const dot = markerGroup.findOne(".marker-dot") as Konva.Circle | undefined;
      dot?.strokeWidth(this._selectedMarkerId === id ? 4 : 2);
    }

    this._areasLayer?.batchDraw();
    this._markersLayer?.batchDraw();
  }

  private _drawEmptyState(stageWidth: number, stageHeight: number) {
    const bg = new Konva.Rect({
      x: 0,
      y: 0,
      width: stageWidth,
      height: stageHeight,
      fill: "#f5f5f5",
    });
    this._backgroundLayer!.add(bg);

    const icon = new Konva.Text({
      x: stageWidth / 2,
      y: stageHeight / 2 - 50,
      text: "🏠",
      fontSize: 48,
    });
    icon.offsetX(icon.width() / 2);
    this._backgroundLayer!.add(icon);

    const title = new Konva.Text({
      x: stageWidth / 2,
      y: stageHeight / 2 + 10,
      text: "No Floorplan Loaded",
      fontSize: 20,
      fontStyle: "bold",
      fill: "#333",
    });
    title.offsetX(title.width() / 2);
    this._backgroundLayer!.add(title);

    const subtitle = new Konva.Text({
      x: stageWidth / 2,
      y: stageHeight / 2 + 40,
      text: 'Click "Edit" → "Upload Image" to get started',
      fontSize: 14,
      fill: "#666",
    });
    subtitle.offsetX(subtitle.width() / 2);
    this._backgroundLayer!.add(subtitle);
  }

  private _drawImageErrorState(stageWidth: number, stageHeight: number) {
    const bg = new Konva.Rect({
      x: 0,
      y: 0,
      width: stageWidth,
      height: stageHeight,
      fill: "#fff3e0",
    });
    this._backgroundLayer!.add(bg);

    const title = new Konva.Text({
      x: stageWidth / 2,
      y: stageHeight / 2 - 10,
      text: "Failed to load floorplan image",
      fontSize: 18,
      fontStyle: "bold",
      fill: "#e65100",
    });
    title.offsetX(title.width() / 2);
    this._backgroundLayer!.add(title);

    const subtitle = new Konva.Text({
      x: stageWidth / 2,
      y: stageHeight / 2 + 20,
      text: "Try re-uploading the image in Edit mode.",
      fontSize: 14,
      fill: "#e65100",
    });
    subtitle.offsetX(subtitle.width() / 2);
    this._backgroundLayer!.add(subtitle);
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
    if (!this._canEdit || !this._config || !this._stage) return;
    const plan = this._getCurrentPlan();
    if (!plan) return;

    const center = this._getVisibleCanvasCenter();
    const id = this._newId("area");
    const newArea: AreaShape = {
      id,
      area_id: "",
      shape:
        type === "polygon"
          ? {
              type: "polygon",
              x: center.x,
              y: center.y,
              points: [-120, -70, 100, -90, 140, 60, -80, 90],
            }
          : {
              type: "rect",
              x: center.x - 120,
              y: center.y - 80,
              width: 240,
              height: 160,
            },
      tags: [],
      style: {
        fillOpacity: 0.4,
        strokeWidth: 2,
        fill: "#2196f3",
        stroke: "#2196f3",
      },
    };

    const updatedPlans = this._config.plans.map((p) =>
      p.plan_id === plan.plan_id ? { ...p, areas: [...(p.areas ?? []), newArea] } : p
    );

    this._config = {
      ...this._config,
      plans: updatedPlans,
    };

    this._selectedAreaId = id;
    this._selectedMarkerId = null;
    void this.saveConfig();
    this._renderFloorplan();
  }

  private _updateAreaShape(
    areaId: string,
    updates: { x?: number; y?: number; width?: number; height?: number; points?: number[] }
  ) {
    if (!this._canEdit || !this._config) return;
    const plan = this._getCurrentPlan();
    if (!plan) return;

    const updatedPlans = this._config.plans.map((p) => {
      if (p.plan_id !== plan.plan_id) return p;
      return {
        ...p,
        areas: (p.areas ?? []).map((area) =>
          area.id === areaId
            ? {
                ...area,
                shape: {
                  ...area.shape,
                  ...updates,
                },
              }
            : area
        ),
      };
    });

    this._config = {
      ...this._config,
      plans: updatedPlans,
    };

    void this.saveConfig();
  }

  private async _loadRegistry() {
    if (!this._canEdit) return;
    try {
      const result = await this.hass.callWS<{
        areas: HassArea[];
        entities: HassEntityRegistry[];
      }>({
        type: "floorplan_ui/list_registry",
      });
      this._haAreas = result.areas;
      this._haEntities = result.entities.sort((left, right) =>
        left.entity_id.localeCompare(right.entity_id)
      );
    } catch (err) {
      console.error("Failed to load Home Assistant registry:", err);
      this._haAreas = [];
      this._haEntities = [];
      this._setError("Home Assistant areas and entities could not be loaded.");
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
    const newAreaId = select.value;
    const plan = this._getCurrentPlan();
    if (!plan) return;

    const updatedPlans = this._config.plans.map((p) => {
      if (p.plan_id !== plan.plan_id) return p;
      return {
        ...p,
        areas: (p.areas ?? []).map((area) =>
          area.id === this._selectedAreaId ? { ...area, area_id: newAreaId } : area
        ),
      };
    });

    this._config = {
      ...this._config,
      plans: updatedPlans,
    };

    void this.saveConfig();
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
    this._config = {
      ...this._config,
      plans: this._config.plans.map((candidate) =>
        candidate.plan_id === plan.plan_id
          ? {
              ...candidate,
              areas: candidate.areas.map((candidateArea) =>
                candidateArea.id === area.id
                  ? { ...candidateArea, tags: [...new Set(tags)] }
                  : candidateArea
              ),
            }
          : candidate
      ),
    };
    void this.saveConfig();
    this._renderAreas(this._getCurrentPlan());
  }

  private _deleteSelectedArea() {
    if (!this._canEdit || !this._config || !this._selectedAreaId) return;
    const plan = this._getCurrentPlan();
    if (!plan) return;
    if (!window.confirm("Delete selected area? This cannot be undone.")) return;

    const updatedPlans = this._config.plans.map((p) => {
      if (p.plan_id !== plan.plan_id) return p;
      return {
        ...p,
        areas: (p.areas ?? []).filter((area) => area.id !== this._selectedAreaId),
      };
    });

    this._config = {
      ...this._config,
      plans: updatedPlans,
    };

    this._selectedAreaId = null;
    void this.saveConfig();
    this._renderFloorplan();
  }

  private _renderMarkers(plan: Plan | null) {
    if (!this._markersLayer) return;

    this._markersLayer.destroyChildren();
    this._markerGroups.clear();
    if (!plan) return;

    const currentView = this._getCurrentView();
    const registryByEntity = new Map(this._haEntities.map((entity) => [entity.entity_id, entity]));

    for (const marker of plan.markers ?? []) {
      if (!markerMatchesView(marker, currentView)) continue;

      const state = this.hass.states[marker.entity_id];
      const registryEntry = registryByEntity.get(marker.entity_id);
      const label = getMarkerLabel(marker, state, registryEntry);
      const showLabel = marker.label_mode !== "off";

      const group = new Konva.Group({
        x: marker.pos.x,
        y: marker.pos.y,
        draggable: this._editMode,
      });
      const dot = new Konva.Circle({
        name: "marker-dot",
        radius: 19,
        fill: getMarkerColor(state),
        stroke: "#ffffff",
        strokeWidth: this._selectedMarkerId === marker.id ? 4 : 2,
        shadowColor: "#000000",
        shadowBlur: 5,
        shadowOpacity: 0.25,
      });
      const glyph = new Konva.Text({
        x: -10,
        y: -10,
        width: 20,
        align: "center",
        text: getDomainGlyph(marker.entity_id),
        fill: "#ffffff",
        fontSize: 16,
        fontStyle: "bold",
        listening: false,
      });
      const nameLabel = new Konva.Text({
        name: "marker-label",
        x: 26,
        y: -17,
        text: showLabel ? label : "",
        fill: "#212121",
        fontSize: 13,
        fontStyle: "bold",
        padding: 2,
        listening: false,
      });
      const valueLabel = new Konva.Text({
        name: "marker-value",
        x: 26,
        y: 1,
        text: [getMarkerValue(marker, state), getMarkerValue(marker, state, "secondary")]
          .filter(Boolean)
          .join(" · "),
        fill: "#424242",
        fontSize: 12,
        padding: 2,
        listening: false,
      });

      group.add(dot, glyph, nameLabel, valueLabel);
      group.on("click", (event) => {
        event.cancelBubble = true;
        if (this._editMode) {
          this._selectedMarkerId = marker.id;
          this._selectedAreaId = null;
          this._syncCanvasInteractivity();
        } else {
          this._openMoreInfo(marker.entity_id);
        }
      });
      group.on("dragend", () => {
        if (!this._editMode) return;
        this._updateMarker(marker.id, { pos: group.position() });
      });
      group.on("mouseenter", () => {
        if (this._stage) this._stage.container().style.cursor = "pointer";
      });
      group.on("mouseleave", () => {
        if (this._stage) this._stage.container().style.cursor = "default";
      });

      this._markersLayer.add(group);
      this._markerGroups.set(marker.id, group);
    }

    this._markersLayer.batchDraw();
  }

  private _refreshMarkerLiveValues() {
    const plan = this._getCurrentPlan();
    if (!plan || !this._markersLayer) return;

    const registryByEntity = new Map(this._haEntities.map((entity) => [entity.entity_id, entity]));
    for (const marker of plan.markers ?? []) {
      const group = this._markerGroups.get(marker.id);
      if (!group) continue;

      const state = this.hass.states[marker.entity_id];
      const dot = group.findOne(".marker-dot") as Konva.Circle | undefined;
      const value = group.findOne(".marker-value") as Konva.Text | undefined;
      const label = group.findOne(".marker-label") as Konva.Text | undefined;
      dot?.fill(getMarkerColor(state));
      value?.text(
        [getMarkerValue(marker, state), getMarkerValue(marker, state, "secondary")]
          .filter(Boolean)
          .join(" · ")
      );
      label?.text(getMarkerLabel(marker, state, registryByEntity.get(marker.entity_id)));
    }
    this._markersLayer.batchDraw();
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
      this._setError("Select an existing Home Assistant entity.");
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

    this._config = {
      ...this._config,
      plans: this._config.plans.map((candidate) =>
        candidate.plan_id === plan.plan_id
          ? { ...candidate, markers: [...candidate.markers, marker] }
          : candidate
      ),
    };
    this._selectedMarkerId = marker.id;
    this._selectedAreaId = null;
    this._entityToAdd = "";
    void this.saveConfig();
    this._renderMarkers(this._getCurrentPlan());
  }

  private _onEntityDragStart(entityId: string, event: DragEvent) {
    event.dataTransfer?.setData("application/x-floorplan-entity", entityId);
    event.dataTransfer?.setData("text/plain", entityId);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = "copy";
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

    const bounds = container.getBoundingClientRect();
    const transform = this._stage.getAbsoluteTransform().copy().invert();
    const position = transform.point({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });
    this._addMarkerAt(entityId, position);
  }

  private _updateMarker(markerId: string, updates: Partial<Marker>) {
    if (!this._canEdit || !this._config) return;
    const plan = this._getCurrentPlan();
    if (!plan) return;

    this._config = {
      ...this._config,
      plans: this._config.plans.map((candidate) =>
        candidate.plan_id === plan.plan_id
          ? {
              ...candidate,
              markers: candidate.markers.map((marker) =>
                marker.id === markerId ? { ...marker, ...updates } : marker
              ),
            }
          : candidate
      ),
    };
    void this.saveConfig();
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

  private _deleteSelectedMarker() {
    if (!this._canEdit || !this._config || !this._selectedMarkerId) return;
    const plan = this._getCurrentPlan();
    if (!plan || !window.confirm("Delete selected marker?")) return;

    this._config = {
      ...this._config,
      plans: this._config.plans.map((candidate) =>
        candidate.plan_id === plan.plan_id
          ? {
              ...candidate,
              markers: candidate.markers.filter((marker) => marker.id !== this._selectedMarkerId),
            }
          : candidate
      ),
    };
    this._selectedMarkerId = null;
    void this.saveConfig();
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

  private _getCurrentView(): View | undefined {
    return this._config?.views.find((view) => view.id === this._currentView);
  }

  private _setView(viewId: string) {
    this._currentView = viewId;
  }

  private _addView() {
    if (!this._canEdit || !this._config) return;
    const name = window.prompt("New view name")?.trim();
    if (!name) return;

    const baseId =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "view";
    let id = baseId;
    let suffix = 2;
    while (this._config.views.some((view) => view.id === id)) {
      id = `${baseId}-${suffix++}`;
    }

    this._config = {
      ...this._config,
      views: [...this._config.views, { id, name, filters: {} }],
    };
    this._currentView = id;
    void this.saveConfig();
  }

  private _renameCurrentView() {
    if (!this._canEdit || !this._config) return;
    const view = this._getCurrentView();
    if (!view) return;
    const name = window.prompt("Rename view", view.name)?.trim();
    if (!name || name === view.name) return;
    this._config = {
      ...this._config,
      views: this._config.views.map((candidate) =>
        candidate.id === view.id ? { ...candidate, name } : candidate
      ),
    };
    void this.saveConfig();
  }

  private _moveCurrentView(direction: -1 | 1) {
    if (!this._canEdit || !this._config) return;
    const index = this._config.views.findIndex((view) => view.id === this._currentView);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= this._config.views.length) return;
    const views = [...this._config.views];
    [views[index], views[target]] = [views[target], views[index]];
    this._config = { ...this._config, views };
    void this.saveConfig();
  }

  private _setDefaultView() {
    if (!this._canEdit || !this._config) return;
    this._config = { ...this._config, default_view: this._currentView };
    void this.saveConfig();
    this._setNotice(`“${this._getCurrentView()?.name ?? this._currentView}” is the default view.`);
  }

  private _deleteCurrentView() {
    if (
      !this._canEdit ||
      !this._config ||
      this._currentView === "all" ||
      this._config.views.length <= 1
    )
      return;
    if (!window.confirm("Delete the current view?")) return;

    const deletedView = this._currentView;
    const remainingViews = this._config.views.filter((view) => view.id !== deletedView);
    const nextView = remainingViews.find((view) => view.id === "all")?.id ?? remainingViews[0].id;
    this._config = {
      ...this._config,
      default_view:
        this._config.default_view === deletedView ? nextView : this._config.default_view,
      views: remainingViews,
    };
    this._currentView = nextView;
    void this.saveConfig();
  }

  private _updateViewFilter(filterName: "domains" | "tags" | "area_ids", event: Event) {
    if (!this._canEdit || !this._config) return;
    const values = (event.target as HTMLInputElement).value
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    this._config = {
      ...this._config,
      views: this._config.views.map((view) => {
        if (view.id !== this._currentView) return view;
        const filters: View["filters"] = { ...view.filters };
        filters[filterName] = values.length ? [...new Set(values)] : undefined;
        return { ...view, filters };
      }),
    };
    void this.saveConfig();
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
    this._config = {
      ...this._config,
      views: this._config.views.map((view) => {
        if (view.id !== this._currentView) return view;
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
      }),
    };
    void this.saveConfig();
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

    this._config = {
      ...this._config,
      views: this._config.views.map((view) =>
        view.id === this._currentView
          ? {
              ...view,
              area_overlay: { ...view.area_overlay, badges: badges.length ? badges : undefined },
            }
          : view
      ),
    };
    void this.saveConfig();
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
    this._config = {
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
    };
    void this.saveConfig();
    this._renderAreas(this._getCurrentPlan());
  }

  private _exportConfig() {
    if (!this._config) return;
    const blob = new Blob([JSON.stringify(this._config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "floorplan-ui-0.1.0.json";
    link.click();
    URL.revokeObjectURL(url);
    this._setNotice("Configuration exported.");
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
    if (file.size > MAX_CONFIG_FILE_BYTES) {
      this._setError("The configuration file must not exceed 20 MB.");
      return;
    }

    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("The JSON root must be an object.");
      }
      const result = await this.hass.callWS<{ config: FloorplanConfig }>({
        type: "floorplan_ui/validate_config",
        config: parsed,
      });
      const planCount = result.config.plans.length;
      const viewCount = result.config.views.length;
      if (!window.confirm(`Import ${planCount} plan(s) and ${viewCount} view(s)?`)) return;

      this._config = result.config;
      this._currentPlanId = result.config.plans[0]?.plan_id ?? null;
      this._currentView = result.config.views.some((view) => view.id === result.config.default_view)
        ? (result.config.default_view ?? "all")
        : (result.config.views[0]?.id ?? "all");
      this._selectedAreaId = null;
      this._selectedMarkerId = null;
      const saved = await this.saveConfig();
      if (!saved) return;
      this._renderFloorplan();
      this._setNotice("Configuration imported and saved.");
    } catch (err) {
      console.error("Failed to import floorplan config:", err);
      const message = err instanceof Error ? err.message : "The file is not a valid configuration.";
      this._setError(`Import failed: ${message}`);
    }
  }

  private _handleFileUpload(e: Event) {
    if (!this._canEdit) return;
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      this._setError("Only PNG and JPEG floorplans are supported.");
      return;
    }
    if (file.size > MAX_IMAGE_FILE_BYTES) {
      this._setError("The floorplan image must not exceed 4 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        this._createNewPlan(file.name, dataUrl, img.width, img.height);
      };
      img.onerror = () => this._setError("The selected image could not be decoded.");
      img.src = dataUrl;
    };
    reader.onerror = () => this._setError("The selected image could not be read.");
    reader.readAsDataURL(file);
  }

  private _createNewPlan(name: string, imageUrl: string, width: number, height: number) {
    if (!this._canEdit || !this._config) return;

    const planId = this._newId("plan");
    const newPlan: Plan = {
      plan_id: planId,
      name: name.replace(/\.[^.]+$/, ""),
      background: { type: "image", url: imageUrl, width, height },
      areas: [],
      markers: [],
      view: { minZoom: 0.1, maxZoom: 5 },
    };

    this._config = {
      ...this._config,
      plans: [...this._config.plans, newPlan],
    };
    this._currentPlanId = planId;
    void this.saveConfig();
    this._renderFloorplan();
  }

  private _triggerFileUpload() {
    (this.renderRoot.querySelector(".file-input") as HTMLInputElement)?.click();
  }

  private _getVisibleCanvasCenter(): { x: number; y: number } {
    if (!this._stage) return { x: 0, y: 0 };
    const transform = this._stage.getAbsoluteTransform().copy().invert();
    return transform.point({
      x: this._stage.width() / 2,
      y: this._stage.height() / 2,
    });
  }

  private _newId(prefix: string): string {
    const randomPart = Math.random().toString(36).slice(2, 9);
    return `${prefix}_${Date.now().toString(36)}_${randomPart}`;
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

    return html`
      <div class="container">
        <div class="toolbar">
          <div class="toolbar-left">
            <h1>Floorplan</h1>
            <div class="plan-select">
              <span>Plan:</span>
              <select @change=${this._selectPlan} .value=${currentPlan?.plan_id ?? ""}>
                <option value="">${plans.length === 0 ? "No plans" : "Select plan"}</option>
                ${plans.map((plan) => html`<option value=${plan.plan_id}>${plan.name}</option>`)}
              </select>
            </div>
            <div class="view-tabs">
              ${views.map(
                (view) => html`
                  <button
                    class="view-tab ${this._currentView === view.id ? "active" : ""}"
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
                    @click=${this._toggleEditMode}
                  >
                    ${this._editMode ? "Done" : "Edit"}
                  </button>
                `
              : html`<span class="viewer-note">View only</span>`}
          </div>
        </div>

        ${this._notice ? html`<div class="status">${this._notice}</div>` : ""}
        ${this._error ? html`<div class="status error">${this._error}</div>` : ""}
        ${this._editMode
          ? html`
              <div class="edit-toolbar">
                <button @click=${this._triggerFileUpload}>Upload Image</button>
                <button ?disabled=${!currentPlan} @click=${this._renameCurrentPlan}>
                  Rename Plan
                </button>
                <button ?disabled=${!currentPlan} @click=${this._deleteCurrentPlan}>
                  Delete Plan
                </button>
                <button ?disabled=${!currentPlan} @click=${this._addAreaRect}>+ Rectangle</button>
                <button ?disabled=${!currentPlan} @click=${this._addAreaPolygon}>+ Polygon</button>
                <button @click=${this._addView}>+ View</button>
                <button @click=${this._renameCurrentView}>Rename View</button>
                <button @click=${() => this._moveCurrentView(-1)}>← View</button>
                <button @click=${() => this._moveCurrentView(1)}>View →</button>
                <button @click=${this._setDefaultView}>Set Default</button>
                <button ?disabled=${this._currentView === "all"} @click=${this._deleteCurrentView}>
                  Delete View
                </button>
                <button @click=${this._exportConfig}>Export JSON</button>
                <button @click=${this._triggerConfigImport}>Import JSON</button>
              </div>
              <div class="edit-toolbar">
                <label>
                  Search entity:
                  <input
                    class="grow"
                    type="search"
                    .value=${this._entitySearch}
                    @input=${(event: Event) =>
                      (this._entitySearch = (event.target as HTMLInputElement).value)}
                    placeholder="light.kitchen"
                  />
                </label>
                <label>
                  Domain:
                  <select
                    .value=${this._entityDomainFilter}
                    @change=${(event: Event) =>
                      (this._entityDomainFilter = (event.target as HTMLSelectElement).value)}
                  >
                    <option value="">All domains</option>
                    ${entityDomains.map(
                      (domain) => html`<option value=${domain}>${domain}</option>`
                    )}
                  </select>
                </label>
                <label>
                  HA Area:
                  <select
                    .value=${this._entityAreaFilter}
                    @change=${(event: Event) =>
                      (this._entityAreaFilter = (event.target as HTMLSelectElement).value)}
                  >
                    <option value="">All areas</option>
                    ${this._haAreas.map(
                      (area) => html`<option value=${area.id}>${area.name}</option>`
                    )}
                  </select>
                </label>
                <select
                  class="grow"
                  .value=${this._entityToAdd}
                  @change=${(event: Event) =>
                    (this._entityToAdd = (event.target as HTMLSelectElement).value)}
                >
                  <option value="">Select entity (${this._haEntities.length})</option>
                  ${entityOptions.map(
                    (entity) => html`
                      <option value=${entity.entity_id}>
                        ${entity.entity_id}${entity.name ? ` — ${entity.name}` : ""}
                      </option>
                    `
                  )}
                </select>
                <button ?disabled=${!currentPlan || !this._entityToAdd} @click=${this._addMarker}>
                  + Marker
                </button>
              </div>
              <div class="edit-toolbar">
                <strong>Drag entity onto plan:</strong>
                <div class="entity-palette">
                  ${entityOptions.slice(0, 80).map(
                    (entity) => html`
                      <div
                        class="entity-card"
                        draggable="true"
                        @dragstart=${(event: DragEvent) =>
                          this._onEntityDragStart(entity.entity_id, event)}
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
                <strong>View “${currentView?.name ?? this._currentView}” filters:</strong>
                <label>
                  Domains:
                  <input
                    .value=${currentView?.filters.domains?.join(", ") ?? ""}
                    @change=${(event: Event) => this._updateViewFilter("domains", event)}
                    placeholder="light, switch"
                  />
                </label>
                <label>
                  Tags:
                  <input
                    .value=${currentView?.filters.tags?.join(", ") ?? ""}
                    @change=${(event: Event) => this._updateViewFilter("tags", event)}
                    placeholder="heating"
                  />
                </label>
                <label>
                  Area IDs:
                  <input
                    .value=${currentView?.filters.area_ids?.join(", ") ?? ""}
                    @change=${(event: Event) => this._updateViewFilter("area_ids", event)}
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
                    @change=${(event: Event) =>
                      this._updateAreaOverlayValue("primary", "entity_id", event)}
                    placeholder="sensor.living_room_temperature"
                  />
                </label>
                <label>
                  Source:
                  <select
                    .value=${currentView?.area_overlay?.primary?.source ?? "state"}
                    @change=${(event: Event) =>
                      this._updateAreaOverlayValue("primary", "source", event)}
                  >
                    <option value="state">State</option>
                    <option value="attr">Attribute</option>
                  </select>
                </label>
                <label>
                  Attribute:
                  <input
                    .value=${currentView?.area_overlay?.primary?.attr ?? ""}
                    @change=${(event: Event) =>
                      this._updateAreaOverlayValue("primary", "attr", event)}
                  />
                </label>
                <label>
                  Format:
                  <input
                    .value=${currentView?.area_overlay?.primary?.format ?? ""}
                    @change=${(event: Event) =>
                      this._updateAreaOverlayValue("primary", "format", event)}
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
                    @change=${(event: Event) =>
                      this._updateAreaOverlayValue("secondary", "entity_id", event)}
                  />
                </label>
                <label>
                  Source:
                  <select
                    .value=${currentView?.area_overlay?.secondary?.source ?? "state"}
                    @change=${(event: Event) =>
                      this._updateAreaOverlayValue("secondary", "source", event)}
                  >
                    <option value="state">State</option>
                    <option value="attr">Attribute</option>
                  </select>
                </label>
                <label>
                  Attribute:
                  <input
                    .value=${currentView?.area_overlay?.secondary?.attr ?? ""}
                    @change=${(event: Event) =>
                      this._updateAreaOverlayValue("secondary", "attr", event)}
                  />
                </label>
                <label>
                  Format:
                  <input
                    .value=${currentView?.area_overlay?.secondary?.format ?? ""}
                    @change=${(event: Event) =>
                      this._updateAreaOverlayValue("secondary", "format", event)}
                  />
                </label>
                <label>
                  Badges:
                  <input
                    class="grow"
                    .value=${currentView?.area_overlay?.badges
                      ?.map(
                        (badge) =>
                          `${badge.entity_id}=${badge.when.state_is}${
                            badge.label ? `:${badge.label}` : ""
                          }`
                      )
                      .join(", ") ?? ""}
                    @change=${this._updateAreaBadges}
                    placeholder="binary_sensor.window=on:Window open"
                  />
                </label>
              </div>
              ${selectedArea
                ? html`
                    <div class="edit-toolbar">
                      <span>Selected area:</span>
                      <strong>${selectedArea.id}</strong>
                      <label>
                        HA Area:
                        <select
                          @change=${this._onBindAreaChange}
                          .value=${selectedArea.area_id ?? ""}
                        >
                          <option value="">Unbound</option>
                          ${this._haAreas.map(
                            (area) => html`<option value=${area.id}>${area.name}</option>`
                          )}
                        </select>
                      </label>
                      <label>
                        Tags:
                        <input
                          .value=${selectedArea.tags.join(", ")}
                          @change=${this._onAreaTagsChange}
                          placeholder="downstairs, heating"
                        />
                      </label>
                      <label>
                        Fill:
                        <input
                          type="color"
                          .value=${selectedArea.style.fill ?? "#2196f3"}
                          @change=${(event: Event) => this._updateAreaStyle("fill", event)}
                        />
                      </label>
                      <label>
                        Stroke:
                        <input
                          type="color"
                          .value=${selectedArea.style.stroke ?? "#1976d2"}
                          @change=${(event: Event) => this._updateAreaStyle("stroke", event)}
                        />
                      </label>
                      <label>
                        Opacity:
                        <input
                          type="number"
                          min="0"
                          max="1"
                          step="0.05"
                          .value=${String(selectedArea.style.fillOpacity)}
                          @change=${(event: Event) => this._updateAreaStyle("fillOpacity", event)}
                        />
                      </label>
                      <label>
                        Stroke width:
                        <input
                          type="number"
                          min="0"
                          max="20"
                          step="1"
                          .value=${String(selectedArea.style.strokeWidth)}
                          @change=${(event: Event) => this._updateAreaStyle("strokeWidth", event)}
                        />
                      </label>
                      <button @click=${this._deleteSelectedArea}>Delete Area</button>
                    </div>
                  `
                : ""}
              ${selectedMarker
                ? html`
                    <div class="edit-toolbar">
                      <span>Selected marker:</span>
                      <strong>${selectedMarker.entity_id}</strong>
                      <label>
                        Tags:
                        <input
                          .value=${selectedMarker.tags.join(", ")}
                          @change=${this._onMarkerTagsChange}
                          placeholder="heating, downstairs"
                        />
                      </label>
                      <label>
                        HA Area:
                        <select
                          .value=${selectedMarker.area_id ?? ""}
                          @change=${this._onMarkerAreaChange}
                        >
                          <option value="">Unbound</option>
                          ${this._haAreas.map(
                            (area) => html`<option value=${area.id}>${area.name}</option>`
                          )}
                        </select>
                      </label>
                      <label>
                        Label:
                        <select
                          .value=${selectedMarker.label_mode}
                          @change=${this._onMarkerLabelModeChange}
                        >
                          <option value="auto">Auto</option>
                          <option value="short">Short</option>
                          <option value="full">Full</option>
                          <option value="off">Off</option>
                        </select>
                      </label>
                      <label>
                        Primary:
                        <select
                          .value=${selectedMarker.bind.primary.source}
                          @change=${(event: Event) =>
                            this._updateMarkerBinding("primary", "source", event)}
                        >
                          <option value="state">State</option>
                          <option value="attr">Attribute</option>
                        </select>
                      </label>
                      <label>
                        Attribute:
                        <input
                          .value=${selectedMarker.bind.primary.attr ?? ""}
                          @change=${(event: Event) =>
                            this._updateMarkerBinding("primary", "attr", event)}
                        />
                      </label>
                      <label>
                        Format:
                        <input
                          .value=${selectedMarker.bind.primary.format ?? ""}
                          @change=${(event: Event) =>
                            this._updateMarkerBinding("primary", "format", event)}
                          placeholder="{value} °C"
                        />
                      </label>
                      ${selectedMarker.bind.secondary
                        ? html`
                            <label>
                              Secondary:
                              <select
                                .value=${selectedMarker.bind.secondary.source}
                                @change=${(event: Event) =>
                                  this._updateMarkerBinding("secondary", "source", event)}
                              >
                                <option value="state">State</option>
                                <option value="attr">Attribute</option>
                              </select>
                            </label>
                            <label>
                              Attribute:
                              <input
                                .value=${selectedMarker.bind.secondary.attr ?? ""}
                                @change=${(event: Event) =>
                                  this._updateMarkerBinding("secondary", "attr", event)}
                              />
                            </label>
                            <label>
                              Format:
                              <input
                                .value=${selectedMarker.bind.secondary.format ?? ""}
                                @change=${(event: Event) =>
                                  this._updateMarkerBinding("secondary", "format", event)}
                              />
                            </label>
                            <button @click=${this._removeMarkerSecondaryBinding}>
                              Remove Secondary
                            </button>
                          `
                        : html`
                            <button @click=${this._addMarkerSecondaryBinding}>+ Secondary</button>
                          `}
                      <button @click=${this._deleteSelectedMarker}>Delete Marker</button>
                    </div>
                  `
                : ""}
            `
          : ""}

        <input
          type="file"
          class="file-input"
          accept="image/png,image/jpeg"
          @change=${this._handleFileUpload}
        />
        <input
          type="file"
          class="config-file-input"
          accept="application/json,.json"
          @change=${this._handleConfigImport}
        />

        <div
          class="canvas-container"
          @dragover=${this._onCanvasDragOver}
          @dragleave=${this._onCanvasDragLeave}
          @drop=${this._onCanvasDrop}
        >
          ${this._loading
            ? html`<div class="loading">Loading...</div>`
            : html`<div class="canvas-wrapper"></div>`}
        </div>
      </div>
    `;
  }
}
