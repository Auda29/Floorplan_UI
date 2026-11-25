// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EntityDragController } from "./panel-drag-controller";

describe("EntityDragController", () => {
  let controller: EntityDragController;
  const canvas = document.createElement("div");
  const palette = document.createElement("div");
  const card = document.createElement("button");
  const drop = vi.fn();
  function pointer(type: string, x: number, kind = "mouse", button = 0) {
    return Object.assign(
      new MouseEvent(type, { clientX: x, clientY: x, button, cancelable: true }),
      { isPrimary: true, pointerId: 1, pointerType: kind }
    );
  }
  beforeEach(() => {
    vi.useFakeTimers();
    drop.mockClear();
    palette.className = "entity-palette";
    palette.append(card);
    palette.scrollTop = 40;
    canvas.getBoundingClientRect = () => new DOMRect(0, 0, 100, 100);
    controller = new EntityDragController({
      isEnabled: () => true,
      getCanvasContainer: () => canvas,
      onDropEntity: drop,
    });
    controller.attach();
  });
  function start(kind = "mouse", button = 0) {
    card.addEventListener(
      "pointerdown",
      (event) => controller.onEntityPointerDown("light.test", event),
      { once: true }
    );
    card.dispatchEvent(pointer("pointerdown", 0, kind, button));
  }
  afterEach(() => {
    controller.detach();
    vi.useRealTimers();
  });
  it("drops only after crossing the threshold and consumes the following click", () => {
    start();
    window.dispatchEvent(pointer("pointermove", 3));
    expect(canvas.classList.contains("drag-target")).toBe(false);
    window.dispatchEvent(pointer("pointermove", 5));
    expect(canvas.classList.contains("drag-target")).toBe(true);
    window.dispatchEvent(pointer("pointerup", 5));
    expect(drop).toHaveBeenCalledWith("light.test", 5, 5, canvas);
    expect(controller.skipNextClick).toBe(true);
    expect(canvas.classList.contains("drag-target")).toBe(false);
  });
  it("scrolls when touch moves before the hold completes", () => {
    start("touch");
    vi.advanceTimersByTime(249);
    window.dispatchEvent(pointer("pointermove", 10, "touch"));
    vi.advanceTimersByTime(300);
    window.dispatchEvent(pointer("pointerup", 10, "touch"));
    expect(palette.scrollTop).toBe(30);
    expect(drop).not.toHaveBeenCalled();
    expect(controller.skipNextClick).toBe(true);
  });
  it("drops a held touch", () => {
    start("touch");
    vi.advanceTimersByTime(250);
    window.dispatchEvent(pointer("pointermove", 10, "touch"));
    window.dispatchEvent(pointer("pointerup", 10, "touch"));
    expect(drop).toHaveBeenCalledTimes(1);
  });
  it("ignores secondary pen buttons and releases listeners on detach", () => {
    start("pen", 2);
    window.dispatchEvent(pointer("pointermove", 15));
    window.dispatchEvent(pointer("pointerup", 15));
    expect(drop).not.toHaveBeenCalled();
    start();
    controller.detach();
    window.dispatchEvent(pointer("pointermove", 15));
    window.dispatchEvent(pointer("pointerup", 15));
    expect(drop).not.toHaveBeenCalled();
  });
});
