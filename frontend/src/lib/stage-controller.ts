import Konva from "konva";

export interface StageZoomLimits {
  minZoom: number;
  maxZoom: number;
}

export interface StageController {
  stage: Konva.Stage;
  backgroundLayer: Konva.Layer;
  areasLayer: Konva.Layer;
  markersLayer: Konva.Layer;
  destroy(): void;
}

interface StageControllerOptions {
  isEditing(): boolean;
  getZoomLimits(): StageZoomLimits;
  onEmptyCanvasClick(): void;
}

export function createStageController(
  container: HTMLDivElement,
  options: StageControllerOptions
): StageController {
  const bounds = container.getBoundingClientRect();
  const stage = new Konva.Stage({
    container,
    width: Math.max(bounds.width, 400),
    height: Math.max(bounds.height, 300),
    draggable: true,
  });
  const backgroundLayer = new Konva.Layer();
  const areasLayer = new Konva.Layer();
  const markersLayer = new Konva.Layer();
  stage.add(backgroundLayer);
  stage.add(areasLayer);
  stage.add(markersLayer);

  stage.on("click", (event) => {
    if (options.isEditing() && event.target === stage) {
      options.onEmptyCanvasClick();
    }
  });

  stage.on("wheel", (event) => {
    event.evt.preventDefault();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const oldScale = stage.scaleX();
    const mousePoint = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
    const { minZoom, maxZoom } = options.getZoomLimits();
    const requestedScale = event.evt.deltaY > 0 ? oldScale / 1.1 : oldScale * 1.1;
    const scale = Math.max(minZoom, Math.min(maxZoom, requestedScale));
    stage.scale({ x: scale, y: scale });
    stage.position({
      x: pointer.x - mousePoint.x * scale,
      y: pointer.y - mousePoint.y * scale,
    });
  });

  const resizeObserver = new ResizeObserver(([entry]) => {
    if (!entry) return;
    const { width, height } = entry.contentRect;
    if (width > 0 && height > 0) {
      stage.size({ width, height });
    }
  });
  resizeObserver.observe(container);

  return {
    stage,
    backgroundLayer,
    areasLayer,
    markersLayer,
    destroy: () => {
      resizeObserver.disconnect();
      stage.destroy();
    },
  };
}

export function fitStageToContent(stage: Konva.Stage, width: number, height: number): void {
  const scale = Math.min(stage.width() / width, stage.height() / height) * 0.9;
  stage.scale({ x: scale, y: scale });
  stage.position({
    x: (stage.width() - width * scale) / 2,
    y: (stage.height() - height * scale) / 2,
  });
}

export function getVisibleStageCenter(stage: Konva.Stage): {
  x: number;
  y: number;
} {
  const transform = stage.getAbsoluteTransform().copy().invert();
  return transform.point({
    x: stage.width() / 2,
    y: stage.height() / 2,
  });
}
