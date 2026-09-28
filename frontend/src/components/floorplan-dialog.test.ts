// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FloorplanDialog } from "./floorplan-dialog";

beforeEach(() => {
  // jsdom does not implement native dialog modality; browser tests cover focus/inertness.
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function () {
    this.open = false;
  };
});
afterEach(() => document.body.replaceChildren());

async function mount(kind: "text" | "confirm", value = "") {
  const dialog = new FloorplanDialog();
  dialog.dialog = { kind, title: "Test", value, confirmLabel: "Confirm", destructive: true };
  const resolved = vi.fn();
  dialog.addEventListener("floorplan-dialog-resolve", (event) =>
    resolved((event as CustomEvent).detail)
  );
  document.body.append(dialog);
  await dialog.updateComplete;
  return { dialog, resolved };
}

describe("floorplan dialog keyboard actions", () => {
  it("leaves Enter on Cancel to the button's native activation", async () => {
    const { dialog, resolved } = await mount("confirm");
    const cancel = dialog.shadowRoot!.querySelector("button")!;
    const event = new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true });
    cancel.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(resolved).not.toHaveBeenCalled();
    cancel.click();
    expect(resolved).toHaveBeenCalledExactlyOnceWith(null);
  });

  it("submits nonempty text on Enter but rejects empty text", async () => {
    const { dialog, resolved } = await mount("text", "   ");
    const input = dialog.shadowRoot!.querySelector("input")!;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(resolved).not.toHaveBeenCalled();
    input.value = "New name";
    input.dispatchEvent(new Event("input"));
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(resolved).toHaveBeenCalledExactlyOnceWith("New name");
  });

  it("handles native Escape cancellation without confirming", async () => {
    const { dialog, resolved } = await mount("confirm");
    dialog
      .shadowRoot!.querySelector("dialog")!
      .dispatchEvent(new Event("cancel", { cancelable: true }));
    expect(resolved).toHaveBeenCalledExactlyOnceWith(null);
  });
});
