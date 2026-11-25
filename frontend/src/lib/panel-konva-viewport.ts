import Konva from "konva";
import type { HomeAssistant, Marker, Plan } from "../types/home-assistant";
import type { AreaGeometryUpdate } from "./area-config";
import { fetchFloorplanImage } from "./asset-api";
import {
  drawImageErrorState,
  refreshMarkerLiveValues,
  renderAreas,
  renderMarkers,
  syncCanvasInteractivity,
} from "./konva-renderer";
import {
  createStageController,
  fitStageToContent,
  getVisibleStageCenter,
  type StageController,
} from "./stage-controller";
import type { ViewportRenderState } from "./viewport-types";

interface KonvaCallbacks {
  isEditing(): boolean;
  getPlan(): Plan | null;
  getState(): ViewportRenderState;
  select(kind: "area" | "marker", id: string): void;
  activate(marker: Marker): void;
  move(id: string, pos: Marker["pos"]): void;
  resize(id: string, updates: AreaGeometryUpdate): void;
  onEmptyCanvasClick(): void;
  onImageError(kind: "load" | "render"): void;
}

export class PanelKonvaViewport {
  private readonly controller: StageController;
  private imageGeneration = 0;
  private imageLoading = false;
  private pendingFocus: { kind: "area" | "marker"; id: string } | null = null;

  constructor(
    container: HTMLDivElement,
    private readonly shapes: Map<string, Konva.Shape>,
    private readonly groups: Map<string, Konva.Group>,
    private readonly callbacks: KonvaCallbacks
  ) {
    this.controller = createStageController(container, {
      isEditing: callbacks.isEditing,
      getZoomLimits: () => {
        const view = callbacks.getPlan()?.view;
        return { minZoom: view?.minZoom ?? 0.1, maxZoom: view?.maxZoom ?? 5 };
      },
      onEmptyCanvasClick: callbacks.onEmptyCanvasClick,
    });
  }

  get stage(): Konva.Stage {
    return this.controller.stage;
  }

  destroy() {
    this.imageGeneration++;
    const content = this.stage.getContent();
    this.controller.destroy();
    content?.remove();
    this.shapes.clear();
    this.groups.clear();
  }

  renderPlan(hass: HomeAssistant, state: ViewportRenderState) {
    const { backgroundLayer, areasLayer, markersLayer } = this.controller;
    const generation = ++this.imageGeneration;
    this.pendingFocus = null;
    this.imageLoading = false;
    backgroundLayer.destroyChildren();
    this.renderMarkers(state);
    this.renderAreas(state);
    backgroundLayer.batchDraw();
    areasLayer.batchDraw();
    markersLayer.batchDraw();

    const background = state.plan?.background;
    if (background?.type !== "image" || !(background.asset_id || background.url)) return;
    this.imageLoading = true;
    const current = () =>
      generation === this.imageGeneration &&
      this.callbacks.getPlan()?.plan_id === state.plan?.plan_id &&
      this.callbacks.getPlan()?.background === background;
    const fail = (kind: "load" | "render") => {
      if (!current()) return;
      this.imageLoading = false;
      this.pendingFocus = null;
      backgroundLayer.destroyChildren();
      drawImageErrorState(backgroundLayer, this.stage.width(), this.stage.height());
      this.callbacks.onImageError(kind);
    };
    void fetchFloorplanImage(hass, background)
      .then((blob) => {
        if (!current()) return;
        const url = URL.createObjectURL(blob);
        const image = new Image();
        image.onerror = () => {
          URL.revokeObjectURL(url);
          fail("load");
        };
        image.onload = () => {
          URL.revokeObjectURL(url);
          if (!current()) return;
          try {
            const node = new Konva.Image({
              x: 0,
              y: 0,
              image,
              width: background.width || image.width,
              height: background.height || image.height,
            });
            backgroundLayer.add(node);
            backgroundLayer.batchDraw();
            this.fitToScreen(node.width(), node.height());
            this.imageLoading = false;
            const focus = this.pendingFocus;
            this.pendingFocus = null;
            if (focus) this.focusObject(focus.kind, focus.id);
          } catch {
            fail("render");
          }
        };
        image.src = url;
      })
      .catch(() => fail("load"));
  }

  fitToScreen(width: number, height: number) {
    fitStageToContent(this.stage, width, height, this.callbacks.getPlan()?.view);
  }

  center() {
    return getVisibleStageCenter(this.stage);
  }

  clientPoint(clientX: number, clientY: number, container: HTMLElement = this.stage.container()) {
    const bounds = container.getBoundingClientRect();
    return this.stage
      .getAbsoluteTransform()
      .copy()
      .invert()
      .point({
        x: clientX - bounds.left,
        y: clientY - bounds.top,
      });
  }

  zoomBy(factor: number) {
    const { stage } = this;
    const view = this.callbacks.getPlan()?.view;
    if (!view) return;
    const center = this.center();
    const scale = Math.min(view.maxZoom, Math.max(view.minZoom, stage.scaleX() * factor));
    stage.scale({ x: scale, y: scale });
    stage.position({
      x: stage.width() / 2 - center.x * scale,
      y: stage.height() / 2 - center.y * scale,
    });
  }

  focusObject(kind: "area" | "marker", id: string) {
    const object = (kind === "area" ? this.shapes : this.groups).get(id);
    if (!object) return;
    if (this.imageLoading) this.pendingFocus = { kind, id };
    const { stage } = this;
    const point = object.getAbsolutePosition();
    stage.position({
      x: stage.x() + stage.width() / 2 - point.x,
      y: stage.y() + stage.height() / 2 - point.y,
    });
  }

  renderAreas(state: ViewportRenderState) {
    renderAreas({
      ...state,
      view: state.view,
      layer: this.controller.areasLayer,
      shapes: this.shapes,
      onSelect: (id) => this.callbacks.select("area", id),
      onUpdateShape: this.callbacks.resize,
      onRerender: () => this.renderAreas(this.callbacks.getState()),
    });
    this.syncCanvasInteractivity(state);
  }

  renderMarkers(state: ViewportRenderState) {
    renderMarkers({
      ...state,
      view: state.view,
      layer: this.controller.markersLayer,
      stage: this.stage,
      groups: this.groups,
      onSelect: (id) => this.callbacks.select("marker", id),
      onActivate: this.callbacks.activate,
      onMove: this.callbacks.move,
    });
  }

  refreshMarkerLiveValues(state: ViewportRenderState) {
    if (!state.plan) return;
    refreshMarkerLiveValues({
      ...state,
      view: state.view,
      plan: state.plan,
      layer: this.controller.markersLayer,
      groups: this.groups,
    });
  }

  syncCanvasInteractivity(state: ViewportRenderState) {
    syncCanvasInteractivity({
      ...state,
      areasLayer: this.controller.areasLayer,
      markersLayer: this.controller.markersLayer,
      areaShapes: this.shapes,
      markerGroups: this.groups,
    });
  }
}
