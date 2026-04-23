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
} from "../types/home-assistant";

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
  @state() private _haAreas: HassArea[] = [];

  private _stage: Konva.Stage | null = null;
  private _backgroundLayer: Konva.Layer | null = null;
  private _resizeObserver: ResizeObserver | null = null;
  private _areasLayer: Konva.Layer | null = null;
  private _areaRects: Map<string, Konva.Rect> = new Map();

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
  `;

  async connectedCallback() {
    super.connectedCallback();
    await this._loadConfig();
    this._loadHAAreas();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
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
    }
    this._loading = false;
  }

  public async saveConfig() {
    if (!this._config) return;
    try {
      await this.hass.callWS({
        type: "floorplan_ui/save_config",
        config: this._config,
      });
      console.info("Floorplan config saved");
    } catch (err) {
      console.error("Failed to save floorplan config:", err);
    }
  }

  protected async updated(changedProps: Map<string, unknown>) {
    // Initialize stage after loading completes
    if (changedProps.has("_loading") && !this._loading && !this._stage) {
      await this.updateComplete;
      // Small delay to ensure DOM is ready
      setTimeout(() => this._initializeStage(), 100);
    }

    if (changedProps.has("_currentPlanId") && this._stage) {
      this._renderFloorplan();
    }
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

    // Clear selection when clicking on empty canvas in edit mode
    this._stage.on("click", (e) => {
      if (!this._editMode) return;
      // Ignore clicks on shapes (they handle their own selection)
      if (e.target === this._stage) {
        this._selectedAreaId = null;
        for (const rect of this._areaRects.values()) {
          rect.strokeWidth(2);
        }
        this._areasLayer?.draw();
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

      const direction = e.evt.deltaY > 0 ? -1 : 1;
      const newScale = direction > 0 ? oldScale * 1.1 : oldScale / 1.1;
      const clampedScale = Math.max(0.1, Math.min(5, newScale));

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
    this._resizeObserver?.disconnect();
    this._stage?.destroy();
    this._stage = null;
    this._areasLayer = null;
    this._areaRects.clear();
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

    this._backgroundLayer.destroyChildren();
    this._areasLayer?.destroyChildren();
    this._areaRects.clear();

    const plan = this._getCurrentPlan();
    const stageWidth = this._stage.width();
    const stageHeight = this._stage.height();

    if (!plan) {
      this._drawEmptyState(stageWidth, stageHeight);
    } else if (plan.background?.url) {
      // Load background image
      const imageObj = new Image();
      imageObj.onload = () => {
        const img = new Konva.Image({
          x: 0,
          y: 0,
          image: imageObj,
          width: plan.background.width || imageObj.width,
          height: plan.background.height || imageObj.height,
        });
        this._backgroundLayer!.add(img);
        try {
          this._backgroundLayer!.draw();
          this._fitToScreen(imageObj.width, imageObj.height);
          this._renderAreas(plan);
        } catch (err) {
          console.error("Error rendering floorplan image:", err);
          this._backgroundLayer!.destroyChildren();
          this._drawImageErrorState(stageWidth, stageHeight);
        }
      };
      imageObj.onerror = () => {
        console.error("Failed to load floorplan image");
        this._backgroundLayer!.destroyChildren();
        this._drawImageErrorState(stageWidth, stageHeight);
      };
      imageObj.src = plan.background.url;
      this._renderAreas(plan);
    } else if (plan) {
      // No background image but areas exist
      this._renderAreas(plan);
    }

    this._backgroundLayer.draw();
    this._areasLayer?.draw();
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
    this._editMode = !this._editMode;
    if (!this._editMode) {
      this._selectedAreaId = null;
    }
    this._syncAreaInteractivity();
  }

  private _selectPlan(e: Event) {
    if (!this._config) return;
    const select = e.target as HTMLSelectElement;
    const planId = select.value || null;
    this._currentPlanId = planId;
  }

  private _renameCurrentPlan() {
    if (!this._config || !this._currentPlanId) return;
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
    this.saveConfig();
  }

  private _deleteCurrentPlan() {
    if (!this._config || !this._currentPlanId) return;
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

    this.saveConfig();
    this._renderFloorplan();
  }

  private _renderAreas(plan: Plan | null) {
    if (!this._areasLayer || !plan) return;

    this._areasLayer.destroyChildren();
    this._areaRects.clear();

    for (const area of plan.areas ?? []) {
      const { shape, style } = area;
      if (shape.type !== "rect") continue;

      const rect = new Konva.Rect({
        x: shape.x ?? 0,
        y: shape.y ?? 0,
        width: shape.width ?? 100,
        height: shape.height ?? 80,
        fill: style.fill ?? "rgba(33, 150, 243, 0.2)",
        stroke: style.stroke ?? "#2196f3",
        strokeWidth: style.strokeWidth ?? 2,
        opacity: style.fillOpacity ?? 0.4,
        draggable: this._editMode,
      });

      rect.on("click", (evt) => {
        evt.cancelBubble = true;
        if (!this._editMode) return;
        this._onAreaSelected(area.id);
      });

      rect.on("dragend", () => {
        if (!this._editMode) return;
        const pos = rect.position();
        this._updateAreaShape(area.id, {
          x: pos.x,
          y: pos.y,
          width: rect.width(),
          height: rect.height(),
        });
      });

      this._areasLayer.add(rect);
      this._areaRects.set(area.id, rect);
    }

    this._syncAreaInteractivity();
  }

  private _syncAreaInteractivity() {
    if (!this._areasLayer) return;

    for (const [id, rect] of this._areaRects.entries()) {
      rect.draggable(this._editMode);
      rect.strokeWidth(this._selectedAreaId === id ? 4 : 2);
    }

    this._areasLayer.draw();
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

    // Simple visual selection: thicken stroke for selected area
    for (const [id, rect] of this._areaRects.entries()) {
      const isSelected = id === areaId;
      rect.strokeWidth(isSelected ? 4 : 2);
    }
    this._areasLayer?.draw();
  }

  private _addAreaRect() {
    if (!this._config || !this._stage) return;
    const plan = this._getCurrentPlan();
    if (!plan) return;

    const stageWidth = this._stage.width();
    const stageHeight = this._stage.height();
    const width = stageWidth * 0.25;
    const height = stageHeight * 0.2;
    const x = (stageWidth - width) / 2;
    const y = (stageHeight - height) / 2;

    const id = `area_${Date.now()}`;
    const newArea: AreaShape = {
      id,
      area_id: "",
      shape: {
        type: "rect",
        x,
        y,
        width,
        height,
      },
      tags: [],
      style: {
        fillOpacity: 0.4,
        strokeWidth: 2,
        fill: "rgba(33, 150, 243, 0.2)",
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

    this.saveConfig();
    this._renderFloorplan();
    this._selectedAreaId = id;
  }

  private _updateAreaShape(
    areaId: string,
    updates: { x?: number; y?: number; width?: number; height?: number }
  ) {
    if (!this._config) return;
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

    this.saveConfig();
  }

  private async _loadHAAreas() {
    try {
      const result = await this.hass.callWS<{ areas: HassArea[] }>({
        type: "floorplan_ui/list_registry",
      });
      this._haAreas = result.areas;
    } catch (err) {
      console.error("Failed to load HA areas for floorplan:", err);
      this._haAreas = [];
    }
  }

  private _getSelectedArea(): AreaShape | null {
    if (!this._config || !this._selectedAreaId) return null;
    const plan = this._getCurrentPlan();
    if (!plan) return null;
    return (plan.areas ?? []).find((a) => a.id === this._selectedAreaId) ?? null;
  }

  private _onBindAreaChange(e: Event) {
    if (!this._config || !this._selectedAreaId) return;
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

    this.saveConfig();
  }

  private _deleteSelectedArea() {
    if (!this._config || !this._selectedAreaId) return;
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
    this.saveConfig();
    this._renderFloorplan();
  }

  private _setView(viewId: string) {
    this._currentView = viewId;
  }

  private _handleFileUpload(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        this._createNewPlan(file.name, dataUrl, img.width, img.height);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  private _createNewPlan(name: string, imageUrl: string, width: number, height: number) {
    if (!this._config) return;

    const planId = `plan_${Date.now()}`;
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
    this.saveConfig();
    this._renderFloorplan();
  }

  private _triggerFileUpload() {
    (this.renderRoot.querySelector(".file-input") as HTMLInputElement)?.click();
  }

  protected render() {
    const views = this._config?.views ?? [
      { id: "all", name: "All" },
      { id: "heating", name: "Heating" },
      { id: "lights", name: "Lights" },
      { id: "network", name: "Network" },
    ];

    const plans = this._config?.plans ?? [];
    const currentPlan = this._getCurrentPlan();
    const selectedArea = this._getSelectedArea();

    return html`
      <div class="container">
        <div class="toolbar">
          <div class="toolbar-left">
            <h1>Floorplan</h1>
            <div class="plan-select">
              <span>Plan:</span>
              <select @change=${this._selectPlan} .value=${currentPlan?.plan_id ?? ""}>
                <option value="">${plans.length === 0 ? "No plans" : "Select plan"}</option>
                ${plans.map(
                  (plan) => html` <option value=${plan.plan_id}>${plan.name}</option> `
                )}
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
            <button
              class="edit-toggle ${this._editMode ? "active" : ""}"
              @click=${this._toggleEditMode}
            >
              ${this._editMode ? "Done" : "Edit"}
            </button>
          </div>
        </div>

        ${this._editMode
          ? html`
              <div class="edit-toolbar">
                <button @click=${this._triggerFileUpload}>📁 Upload Image</button>
                <button ?disabled=${!currentPlan} @click=${this._renameCurrentPlan}>
                  Rename Plan
                </button>
                <button ?disabled=${!currentPlan} @click=${this._deleteCurrentPlan}>
                  Delete Plan
                </button>
                <button ?disabled=${!currentPlan} @click=${this._addAreaRect}>
                  + Add Area (Rect)
                </button>
              </div>
              ${selectedArea
                ? html`
                    <div class="edit-toolbar">
                      <span>Selected area:</span>
                      <span><strong>${selectedArea.id}</strong></span>
                      <label>
                        HA Area:
                        <select
                          @change=${this._onBindAreaChange}
                          .value=${selectedArea.area_id ?? ""}
                        >
                          <option value="">Unbound</option>
                          ${this._haAreas.map(
                            (area) =>
                              html`<option value=${area.id}>
                                ${area.name}
                              </option>`
                          )}
                        </select>
                      </label>
                      <button @click=${this._deleteSelectedArea}>Delete Area</button>
                    </div>
                  `
                : ""}
            `
          : ""}

        <input type="file" class="file-input" accept="image/*" @change=${this._handleFileUpload} />

        <div class="canvas-container">
          ${this._loading
            ? html`<div class="loading">Loading...</div>`
            : html`<div class="canvas-wrapper"></div>`}
        </div>
      </div>
    `;
  }
}
