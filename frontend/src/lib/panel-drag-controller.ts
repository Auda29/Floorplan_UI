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

interface DragCallbacks {
  isEnabled(): boolean;
  getCanvasContainer(): HTMLElement | null;
  onDropEntity(entityId: string, clientX: number, clientY: number, container: HTMLElement): void;
}
export class EntityDragController {
  private _entityPointerDrag: EntityPointerDrag | null = null;
  skipNextClick = false;
  constructor(private readonly callbacks: DragCallbacks) {}
  attach() {
    window.addEventListener("pointermove", this.onEntityPointerMove, { passive: false });
    window.addEventListener("pointerup", this.onEntityPointerUp);
    window.addEventListener("pointercancel", this.onEntityPointerCancel);
  }
  detach() {
    window.removeEventListener("pointermove", this.onEntityPointerMove);
    window.removeEventListener("pointerup", this.onEntityPointerUp);
    window.removeEventListener("pointercancel", this.onEntityPointerCancel);
    this.cancel();
    this.skipNextClick = false;
  }
  onCanvasDragOver = (event: DragEvent) => {
    if (!this.callbacks.isEnabled()) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
    (event.currentTarget as HTMLElement).classList.add("drag-target");
  };

  onCanvasDragLeave = (event: DragEvent) => {
    (event.currentTarget as HTMLElement).classList.remove("drag-target");
  };

  onCanvasDrop = (event: DragEvent) => {
    event.preventDefault();
    const container = event.currentTarget as HTMLElement;
    container.classList.remove("drag-target");
    if (!this.callbacks.isEnabled()) return;
    const entityId =
      event.dataTransfer?.getData("application/x-floorplan-entity") ||
      event.dataTransfer?.getData("text/plain");
    if (!entityId) return;

    this.callbacks.onDropEntity(entityId, event.clientX, event.clientY, container);
  };

  onEntityDragStart = (entityId: string, event: DragEvent) => {
    if (!event.dataTransfer) return;
    this.cancel();
    event.dataTransfer.setData("application/x-floorplan-entity", entityId);
    event.dataTransfer.setData("text/plain", entityId);
    event.dataTransfer.effectAllowed = "copy";
  };

  onEntityPointerDown = (entityId: string, event: PointerEvent) => {
    if (!this.callbacks.isEnabled() || !event.isPrimary || event.button !== 0) {
      return;
    }
    this.cancel();
    this.skipNextClick = false;
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
  };

  onEntityPointerMove = (event: PointerEvent) => {
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
    const canvas = this.callbacks.getCanvasContainer();
    canvas?.classList.toggle(
      "drag-target",
      this._clientPointIsInside(canvas, event.clientX, event.clientY)
    );
  };

  onEntityPointerUp = (event: PointerEvent) => {
    const drag = this._entityPointerDrag;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const canvas = this.callbacks.getCanvasContainer();
    this.skipNextClick = drag.active || drag.scrolling;
    const shouldAdd =
      this.callbacks.isEnabled() &&
      drag.active &&
      this._clientPointIsInside(canvas, event.clientX, event.clientY);
    this.cancel();
    if (shouldAdd && canvas) {
      this.callbacks.onDropEntity(drag.entityId, event.clientX, event.clientY, canvas);
    }
  };

  onEntityPointerCancel = (event: PointerEvent) => {
    if (this._entityPointerDrag?.pointerId !== event.pointerId) return;
    this.cancel();
  };

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

  cancel() {
    this.callbacks.getCanvasContainer()?.classList.remove("drag-target");
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
}
