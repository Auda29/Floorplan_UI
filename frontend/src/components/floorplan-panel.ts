/**
 * Floorplan Panel - Main HA panel component
 * Uses Lit for the panel shell and Konva for the canvas
 */

import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import Konva from "konva";
import type { HomeAssistant, FloorplanConfig, Plan } from "../types/home-assistant";

export class FloorplanPanel extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ type: Boolean }) public narrow = false;
  @property({ type: Object }) public panel?: { config: Record<string, unknown> };

  @state() private _config: FloorplanConfig | null = null;
  @state() private _loading = true;
  @state() private _editMode = false;
  @state() private _currentView = "all";
  @state() private _currentPlanId: string | null = null;

  private _stage: Konva.Stage | null = null;
  private _backgroundLayer: Konva.Layer | null = null;
  private _resizeObserver: ResizeObserver | null = null;

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
  }

  private _getCurrentPlan(): Plan | null {
    if (!this._config || !this._currentPlanId) return null;
    return this._config.plans.find((p) => p.plan_id === this._currentPlanId) || null;
  }

  private _renderFloorplan() {
    if (!this._stage || !this._backgroundLayer) return;

    this._backgroundLayer.destroyChildren();

    const plan = this._getCurrentPlan();
    const stageWidth = this._stage.width();
    const stageHeight = this._stage.height();

    if (!plan) {
      // Empty state - draw on canvas
      const bg = new Konva.Rect({
        x: 0,
        y: 0,
        width: stageWidth,
        height: stageHeight,
        fill: "#f5f5f5",
      });
      this._backgroundLayer.add(bg);

      const icon = new Konva.Text({
        x: stageWidth / 2,
        y: stageHeight / 2 - 50,
        text: "🏠",
        fontSize: 48,
      });
      icon.offsetX(icon.width() / 2);
      this._backgroundLayer.add(icon);

      const title = new Konva.Text({
        x: stageWidth / 2,
        y: stageHeight / 2 + 10,
        text: "No Floorplan Loaded",
        fontSize: 20,
        fontStyle: "bold",
        fill: "#333",
      });
      title.offsetX(title.width() / 2);
      this._backgroundLayer.add(title);

      const subtitle = new Konva.Text({
        x: stageWidth / 2,
        y: stageHeight / 2 + 40,
        text: 'Click "Edit" → "Upload Image" to get started',
        fontSize: 14,
        fill: "#666",
      });
      subtitle.offsetX(subtitle.width() / 2);
      this._backgroundLayer.add(subtitle);
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
        this._backgroundLayer!.draw();
        this._fitToScreen(imageObj.width, imageObj.height);
      };
      imageObj.src = plan.background.url;
    }

    this._backgroundLayer.draw();
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

    return html`
      <div class="container">
        <div class="toolbar">
          <div class="toolbar-left">
            <h1>Floorplan</h1>
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
              </div>
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
