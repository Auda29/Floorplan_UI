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
    width: bounds.width || 400,
    height: bounds.height || 300,
    draggable: true,
  });
  const backgroundLayer = new Konva.Layer({ listening: false });
  const areasLayer = new Konva.Layer();
  const markersLayer = new Konva.Layer();
  stage.add(backgroundLayer);
  stage.add(areasLayer);
  stage.add(markersLayer);

  stage.on("click tap", (event) => {
    if (options.isEditing() && event.target === stage && !event.evt?.defaultPrevented) {
      options.onEmptyCanvasClick();
    }
  });

  stage.on("wheel", (event) => {
    event.evt.preventDefault();
    const pointer = stage.getPointerPosition();
    if (!pointer || event.evt.deltaY === 0) return;

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

  let pinching = false;
  let lastTouchCenter: { x: number; y: number } | null = null;
  let lastTouchDistance = 0;

  // Konva suppresses its touchmove events while a node is being dragged.
  const onPinch = (event: TouchEvent): void => {
    const first = event.touches[0];
    const second = event.touches[1];
    if (!pinching && !second) return;
    event.preventDefault();
    event.stopPropagation();
    if (!first || !second) {
      lastTouchCenter = null;
      return;
    }
    if (!pinching) {
      pinching = true;
      stage.draggable(false);
    }

    const rect = stage.getContent().getBoundingClientRect();
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
  };

  const onPinchEnd = (event: TouchEvent): void => {
    if (!pinching) return;
    // Let Konva finish drag cleanup, but suppress taps for the whole gesture.
    event.preventDefault();
    lastTouchCenter = null;
    if (event.touches.length === 0) {
      pinching = false;
      stage.draggable(true);
    }
  };

  const touchOptions = { capture: true, passive: false };
  container.addEventListener("touchstart", onPinch, touchOptions);
  container.addEventListener("touchmove", onPinch, touchOptions);
  container.addEventListener("touchend", onPinchEnd, touchOptions);
  container.addEventListener("touchcancel", onPinchEnd, touchOptions);

  const resizeObserver = new ResizeObserver(([entry]) => {
    if (!entry) return;
    const { width, height } = entry.contentRect;
    if (width > 0 && height > 0) {
      stage.position({
        x: stage.x() + (width - stage.width()) / 2,
        y: stage.y() + (height - stage.height()) / 2,
      });
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
      container.removeEventListener("touchstart", onPinch, touchOptions);
      container.removeEventListener("touchmove", onPinch, touchOptions);
      container.removeEventListener("touchend", onPinchEnd, touchOptions);
      container.removeEventListener("touchcancel", onPinchEnd, touchOptions);
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
