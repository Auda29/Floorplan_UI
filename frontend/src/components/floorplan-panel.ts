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
  HassArea,
  HassEntityRegistry,
  Marker,
  View,
} from "../types/home-assistant";
import {
  defaultTagsForEntity,
  getDomainGlyph,
  getMarkerLabel,
  getMarkerColor,
  getMarkerValue,
  markerMatchesView,
} from "../lib/marker-utils";

const MAX_IMAGE_FILE_BYTES = 4_000_000;

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

    .file-input {
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
    } catch (err) {
      console.error("Failed to load floorplan config:", err);
      this._config = { version: 1, plans: [], views: [] };
      this._setError("Floorplan configuration could not be loaded.");
    }
    this._loading = false;
  }

  public async saveConfig() {
    if (!this._config || !this._canEdit) return;
    try {
      await this.hass.callWS({
        type: "floorplan_ui/save_config",
        config: this._config,
      });
      this._setNotice("Changes saved.");
    } catch (err) {
      console.error("Failed to save floorplan config:", err);
      this._setError("Changes could not be saved.");
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
      this._renderMarkers(this._getCurrentPlan());
    }

    if (changedProps.has("hass")) {
      if (!this._canEdit && this._editMode) {
        this._editMode = false;
        this._selectedAreaId = null;
        this._selectedMarkerId = null;
        this._syncCanvasInteractivity();
      }
      this._refreshMarkerLiveValues();
    }
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

    for (const area of plan.areas ?? []) {
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
      });

      this._areasLayer.add(areaShape);
      this._areaShapes.set(area.id, areaShape);

      const areaName = this._haAreas.find((entry) => entry.id === area.area_id)?.name;
      if (area.area_id) {
        const bounds = areaShape.getClientRect({ skipTransform: false });
        this._areasLayer.add(
          new Konva.Text({
            x: bounds.x + 8,
            y: bounds.y + 8,
            text: areaName ?? area.area_id,
            fontSize: 14,
            fontStyle: "bold",
            fill: "#0d47a1",
            listening: false,
          })
        );
      }
    }

    this._syncCanvasInteractivity();
  }

  private _syncCanvasInteractivity() {
    for (const [id, areaShape] of this._areaShapes.entries()) {
      areaShape.draggable(this._editMode);
      areaShape.strokeWidth(this._selectedAreaId === id ? 4 : 2);
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
    updates: { x?: number; y?: number; width?: number; height?: number }
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
        text: showLabel ? getMarkerValue(marker, state) : "",
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
      value?.text(marker.label_mode === "off" ? "" : getMarkerValue(marker, state));
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
    const plan = this._getCurrentPlan();
    if (!plan) return;

    const entityId = this._entityToAdd.trim();
    const registryEntry = this._haEntities.find((entity) => entity.entity_id === entityId);
    if (!registryEntry && !this.hass.states[entityId]) {
      this._setError("Select an existing Home Assistant entity.");
      return;
    }

    const marker: Marker = {
      id: this._newId("marker"),
      entity_id: entityId,
      area_id: registryEntry?.area_id ?? null,
      pos: this._getVisibleCanvasCenter(),
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

  private _onMarkerLabelModeChange(event: Event) {
    const marker = this._getSelectedMarker();
    if (!marker) return;
    const labelMode = (event.target as HTMLSelectElement).value as Marker["label_mode"];
    this._updateMarker(marker.id, { label_mode: labelMode });
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

  private _deleteCurrentView() {
    if (!this._canEdit || !this._config || this._currentView === "all") return;
    if (!window.confirm("Delete the current view?")) return;

    this._config = {
      ...this._config,
      views: this._config.views.filter((view) => view.id !== this._currentView),
    };
    this._currentView = "all";
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
    ];
    const views = this._config?.views.length ? this._config.views : fallbackViews;
    const plans = this._config?.plans ?? [];
    const currentPlan = this._getCurrentPlan();
    const currentView = this._getCurrentView();
    const selectedArea = this._getSelectedArea();
    const selectedMarker = this._getSelectedMarker();
    const entitySearch = this._entitySearch.trim().toLowerCase();
    const entityOptions = this._haEntities
      .filter((entity) => {
        if (!entitySearch) return true;
        return (
          entity.entity_id.toLowerCase().includes(entitySearch) ||
          entity.name?.toLowerCase().includes(entitySearch)
        );
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
                    ${view.name}
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
                <button ?disabled=${this._currentView === "all"} @click=${this._deleteCurrentView}>
                  Delete View
                </button>
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

        <div class="canvas-container">
          ${this._loading
            ? html`<div class="loading">Loading...</div>`
            : html`<div class="canvas-wrapper"></div>`}
        </div>
      </div>
    `;
  }
}
