// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";

const mock = vi.hoisted(() => {
  class Node {
    add = vi.fn();

    constructor(public config: Record<string, unknown> = {}) {}
  }

  class Stage extends Node {
    handlers = new Map<string, (event: unknown) => void>();
    scaleValue = 1;
    positionValue = { x: 0, y: 0 };
    draggableValue = true;
    content = document.createElement("div");

    constructor(config: Record<string, unknown>) {
      super(config);
      if (config.container instanceof HTMLDivElement) config.container.append(this.content);
    }

    on(name: string, handler: (event: unknown) => void): void {
      this.handlers.set(name, handler);
    }

    emit(name: string, event: unknown): void {
      this.handlers.get(name)?.(event);
    }

    scaleX(): number {
      return this.scaleValue;
    }

    scale(value: { x: number; y: number }): void {
      this.scaleValue = value.x;
    }

    x(): number {
      return this.positionValue.x;
    }

    y(): number {
      return this.positionValue.y;
    }

    position(value: { x: number; y: number }): void {
      this.positionValue = value;
    }

    draggable(value?: boolean): boolean {
      if (value !== undefined) this.draggableValue = value;
      return this.draggableValue;
    }

    width(): number {
      return Number(this.config.width);
    }

    height(): number {
      return Number(this.config.height);
    }

    size(value: { width: number; height: number }): void {
      Object.assign(this.config, value);
    }

    getContent(): HTMLDivElement {
      return this.content;
    }

    getPointerPosition(): { x: number; y: number } | null {
      return null;
    }

    destroy(): void {}
  }

  return { Node, Stage };
});

vi.mock("konva", () => ({
  default: {
    Stage: mock.Stage,
    Layer: mock.Node,
  },
}));

import { createStageController, fitStageToContent } from "./stage-controller";

let notifyResize: (entries: Array<{ contentRect: { width: number; height: number } }>) => void;

class ResizeObserverMock {
  constructor(callback: typeof notifyResize) {
    notifyResize = callback;
  }
  observe(): void {}
  disconnect(): void {}
}

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", ResizeObserverMock);
});

function createController(width = 800, height = 600) {
  const container = document.createElement("div");
  container.getBoundingClientRect = () => ({ width, height, left: 0, top: 0 }) as DOMRect;
  const onEmptyCanvasClick = vi.fn();
  const controller = createStageController(container, {
    isEditing: () => true,
    getZoomLimits: () => ({ minZoom: 0.5, maxZoom: 3 }),
    onEmptyCanvasClick,
  });
  const stage = controller.stage as unknown as InstanceType<typeof mock.Stage>;
  return { controller, stage, onEmptyCanvasClick };
}

function touch(stage: InstanceType<typeof mock.Stage>, name: string, touches: number[]) {
  const event = Object.assign(new Event(name, { bubbles: true, cancelable: true }), {
    touches: touches.map((clientX) => ({ clientX, clientY: 100 })),
  });
  stage.content.dispatchEvent(event);
  return event;
}

describe("stage controller", () => {
  it("clamps initial fitting to plan limits and ignores zero-sized content", () => {
    const stage = new mock.Stage({});
    Object.assign(stage, { width: () => 800, height: () => 600 });
    fitStageToContent(stage as never, 4, 4, { minZoom: 0.5, maxZoom: 3 });
    expect(stage.scaleValue).toBe(3);
    fitStageToContent(stage as never, 50_000, 50_000, { minZoom: 0.5, maxZoom: 3 });
    expect(stage.scaleValue).toBe(0.5);
    const position = { ...stage.positionValue };
    fitStageToContent(stage as never, 0, 0);
    expect(stage.scaleValue).toBe(0.5);
    expect(stage.positionValue).toEqual(position);
  });

  it("makes background images and placeholders transparent to canvas hit testing", () => {
    const { controller, stage, onEmptyCanvasClick } = createController();
    expect(
      (controller.backgroundLayer as unknown as InstanceType<typeof mock.Node>).config
    ).toEqual({ listening: false });
    stage.emit("click tap", { target: stage, evt: new Event("click") });
    expect(onEmptyCanvasClick).toHaveBeenCalledOnce();
  });

  it("sizes a narrow canvas correctly on first fit and keeps its world center on resize", () => {
    const { stage } = createController(300, 240);
    fitStageToContent(stage as never, 600, 480);
    expect(stage.scaleValue).toBeCloseTo(0.45);
    expect(stage.positionValue).toEqual({ x: 15, y: 12 });

    notifyResize([{ contentRect: { width: 700, height: 400 } }]);
    expect(stage.width()).toBe(700);
    expect(stage.height()).toBe(400);
    expect(stage.positionValue).toEqual({ x: 215, y: 92 });
  });

  it.each(["touchend", "touchcancel"])(
    "keeps a pinch independent of Konva drag until %s",
    (end) => {
      const { controller, stage, onEmptyCanvasClick } = createController();
      const konvaTouchmove = vi.fn();
      stage.content.addEventListener("touchmove", konvaTouchmove);
      touch(stage, "touchmove", [100]);
      expect(konvaTouchmove).toHaveBeenCalledOnce();

      touch(stage, "touchstart", [100, 200]);
      expect(touch(stage, "touchmove", [50, 250]).defaultPrevented).toBe(true);
      expect(konvaTouchmove).toHaveBeenCalledOnce();
      expect(stage.scaleValue).toBe(2);
      expect(stage.positionValue).toEqual({ x: -150, y: -100 });
      expect(stage.draggableValue).toBe(false);

      const pinchRelease = touch(stage, end, []);
      expect(pinchRelease.defaultPrevented).toBe(true);
      stage.emit("click tap", { target: stage, evt: pinchRelease });
      expect(onEmptyCanvasClick).not.toHaveBeenCalled();
      expect(stage.draggableValue).toBe(true);
      const nextTap = touch(stage, "touchend", []);
      stage.emit("click tap", { target: stage, evt: nextTap });
      expect(onEmptyCanvasClick).toHaveBeenCalledOnce();

      controller.destroy();
      expect(touch(stage, "touchstart", [100, 200]).defaultPrevented).toBe(false);
    }
  );
});
