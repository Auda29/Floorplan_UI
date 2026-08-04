// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";

const mock = vi.hoisted(() => {
  class Node {
    add = vi.fn();
  }

  class Stage extends Node {
    handlers = new Map<string, (event: unknown) => void>();
    scaleValue = 1;
    positionValue = { x: 0, y: 0 };
    draggableValue = true;

    constructor(public config: Record<string, unknown>) {
      super();
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

import { createStageController } from "./stage-controller";

class ResizeObserverMock {
  observe(): void {}
  disconnect(): void {}
}

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", ResizeObserverMock);
});

describe("stage controller touch interaction", () => {
  it("pinch-zooms around the gesture center and restores one-finger panning", () => {
    const container = document.createElement("div");
    container.getBoundingClientRect = () =>
      ({ width: 800, height: 600, left: 0, top: 0 }) as DOMRect;
    const controller = createStageController(container, {
      isEditing: () => false,
      getZoomLimits: () => ({ minZoom: 0.5, maxZoom: 3 }),
      onEmptyCanvasClick: vi.fn(),
    });
    const stage = controller.stage as unknown as InstanceType<typeof mock.Stage>;
    const preventDefault = vi.fn();

    stage.emit("touchmove", {
      evt: {
        preventDefault,
        touches: [
          { clientX: 100, clientY: 100 },
          { clientX: 200, clientY: 100 },
        ],
      },
    });
    stage.emit("touchmove", {
      evt: {
        preventDefault,
        touches: [
          { clientX: 50, clientY: 100 },
          { clientX: 250, clientY: 100 },
        ],
      },
    });

    expect(preventDefault).toHaveBeenCalled();
    expect(stage.scaleValue).toBe(2);
    expect(stage.positionValue).toEqual({ x: -150, y: -100 });
    expect(stage.draggableValue).toBe(false);

    stage.emit("touchend", { evt: { touches: [] } });
    expect(stage.draggableValue).toBe(true);
  });
});
