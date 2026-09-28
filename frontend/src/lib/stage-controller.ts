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

  stage.on("click tap", (event) => {
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

  let lastTouchCenter: { x: number; y: number } | null = null;
  let lastTouchDistance = 0;
  const resetPinch = (): void => {
    lastTouchCenter = null;
    lastTouchDistance = 0;
    stage.draggable(true);
  };

  stage.on("touchmove", (event) => {
    const first = event.evt.touches[0];
    const second = event.evt.touches[1];
    if (!first || !second) {
      resetPinch();
      return;
    }
    event.evt.preventDefault();
    stage.draggable(false);

    const rect = container.getBoundingClientRect();
    const firstPoint = { x: first.clientX - rect.left, y: first.clientY - rect.top };
    const secondPoint = { x: second.clientX - rect.left, y: second.clientY - rect.top };
    const center = {
      x: (firstPoint.x + secondPoint.x) / 2,
      y: (firstPoint.y + secondPoint.y) / 2,
    };
    const distance = Math.hypot(secondPoint.x - firstPoint.x, secondPoint.y - firstPoint.y);
    if (!lastTouchCenter || lastTouchDistance === 0) {
      lastTouchCenter = center;
      lastTouchDistance = distance;
      return;
    }

    const oldScale = stage.scaleX();
    const centerPoint = {
      x: (lastTouchCenter.x - stage.x()) / oldScale,
      y: (lastTouchCenter.y - stage.y()) / oldScale,
    };
    const { minZoom, maxZoom } = options.getZoomLimits();
    const requestedScale = oldScale * (distance / lastTouchDistance);
    const scale = Math.max(minZoom, Math.min(maxZoom, requestedScale));
    stage.scale({ x: scale, y: scale });
    stage.position({
      x: center.x - centerPoint.x * scale,
      y: center.y - centerPoint.y * scale,
    });
    lastTouchCenter = center;
    lastTouchDistance = distance;
  });

  stage.on("touchend", (event) => {
    if (event.evt.touches.length < 2) resetPinch();
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

export function fitStageToContent(
  stage: Konva.Stage,
  width: number,
  height: number,
  limits: StageZoomLimits = { minZoom: 0.1, maxZoom: 5 }
): void {
  if (
    ![width, height, stage.width(), stage.height()].every(
      (value) => Number.isFinite(value) && value > 0
    )
  )
    return;
  const requested = Math.min(stage.width() / width, stage.height() / height) * 0.9;
  const scale = Math.max(limits.minZoom, Math.min(limits.maxZoom, requested));
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
