// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { FloorplanConfig, HomeAssistant } from "../types/home-assistant";

const mocks = vi.hoisted(() => ({
  loadFloorplanConfig: vi.fn(),
  loadRegistry: vi.fn(),
  saveFloorplanConfig: vi.fn(),
  validateFloorplanConfig: vi.fn(),
  uploadFloorplanImage: vi.fn(),
}));

vi.mock("konva", () => {
  class Node {
    add() {}
    destroy() {}
    draw() {}
  }
  return {
    default: {
      Stage: Node,
      Layer: Node,
      Transformer: Node,
      Rect: Node,
      Line: Node,
      Group: Node,
      Circle: Node,
      Text: Node,
      Image: Node,
    },
  };
});

vi.mock("../lib/config-api", async (importOriginal) => {
  const original = await importOriginal<typeof import("../lib/config-api")>();
  return {
    ...original,
    loadFloorplanConfig: mocks.loadFloorplanConfig,
    loadRegistry: mocks.loadRegistry,
    saveFloorplanConfig: mocks.saveFloorplanConfig,
    validateFloorplanConfig: mocks.validateFloorplanConfig,
  };
});

vi.mock("../lib/asset-api", async (importOriginal) => {
  const original = await importOriginal<typeof import("../lib/asset-api")>();
  return {
    ...original,
    uploadFloorplanImage: mocks.uploadFloorplanImage,
  };
});

import { FloorplanPanel } from "./floorplan-panel";

if (!customElements.get("floorplan-panel-test")) {
  customElements.define("floorplan-panel-test", FloorplanPanel);
}

function config(): FloorplanConfig {
  return {
    version: 3,
    revision: 4,
    default_view: "all",
    plans: [
      {
        plan_id: "ground",
        name: "Ground floor",
        background: { type: "image", width: 800, height: 600 },
        areas: [],
        markers: [],
        view: { minZoom: 0.1, maxZoom: 5 },
      },
    ],
    views: [{ id: "all", name: "All", filters: {} }],
  };
}

function hass(isAdmin: boolean, language = "en"): HomeAssistant {
  return {
    states: {},
    services: {},
    user: { id: "user", name: "Test User", is_admin: isAdmin },
    language,
    connection: { subscribeEvents: vi.fn() },
    callWS: vi.fn(),
    fetchWithAuth: vi.fn(),
    callService: vi.fn(),
  };
}

async function mount(isAdmin: boolean, language = "en", narrow = false): Promise<FloorplanPanel> {
  const panel = document.createElement("floorplan-panel-test") as FloorplanPanel;
  panel.hass = hass(isAdmin, language);
  panel.narrow = narrow;
  document.body.append(panel);
  await vi.waitFor(() => expect(panel.shadowRoot?.querySelector(".loading")).toBeNull());
  return panel;
}

function button(panel: FloorplanPanel, label: string): HTMLButtonElement {
  const candidates = panel.shadowRoot
    ? Array.from(panel.shadowRoot.querySelectorAll("button"))
    : [];
  const match = candidates.find((candidate) => candidate.textContent?.trim() === label);
  if (!(match instanceof HTMLButtonElement)) throw new Error(`Button not found: ${label}`);
  return match;
}

beforeEach(() => {
  mocks.loadFloorplanConfig.mockReset().mockResolvedValue(config());
  mocks.loadRegistry.mockReset().mockResolvedValue({
    areas: [{ id: "living", name: "Living room" }],
    entities: [
      {
        entity_id: "light.kitchen",
        name: "Kitchen light",
        icon: null,
        area_id: "living",
        device_id: null,
        domain: "light",
      },
    ],
  });
  mocks.saveFloorplanConfig.mockReset().mockImplementation(async (_hass, value, baseRevision) => {
    const next = structuredClone(value) as FloorplanConfig;
    next.revision = Number(baseRevision) + 1;
    mocks.loadFloorplanConfig.mockResolvedValue(next);
    return next.revision;
  });
  mocks.uploadFloorplanImage.mockReset().mockResolvedValue({
    asset_id: "a".repeat(64),
    content_type: "image/png",
    url: "/api/floorplan_ui/assets/signed",
  });
  mocks.validateFloorplanConfig.mockReset().mockImplementation(async (_hass, value) => value);
  vi.stubGlobal(
    "createImageBitmap",
    vi.fn().mockResolvedValue({ width: 640, height: 480, close: vi.fn() })
  );
  vi.spyOn(
    FloorplanPanel.prototype as unknown as { _initializeStage(): void },
    "_initializeStage"
  ).mockImplementation(() => undefined);
});

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("floorplan panel", () => {
  it("loads a persisted plan and exposes editing only to administrators", async () => {
    const admin = await mount(true);

    expect(admin.shadowRoot?.textContent).toContain("Ground floor");
    expect(button(admin, "Edit")).toBeDefined();
    admin.remove();

    const viewer = await mount(false);
    expect(viewer.shadowRoot?.textContent).toContain("View only");
    expect(
      Array.from(viewer.shadowRoot!.querySelectorAll("button")).some(
        (entry) => entry.textContent === "Edit"
      )
    ).toBe(false);
    expect(mocks.loadRegistry).toHaveBeenCalledTimes(1);
  });

  it("shows a comprehensible load error without enabling editing for viewers", async () => {
    mocks.loadFloorplanConfig.mockRejectedValueOnce(new Error("offline"));

    const panel = await mount(false);

    expect(panel.shadowRoot?.textContent).toContain("Floorplan configuration could not be loaded.");
    expect(panel.shadowRoot?.textContent).toContain("View only");
  });

  it("localizes the narrow panel and exposes an accessible keyboard canvas", async () => {
    const panel = await mount(true, "de-DE", true);

    expect(panel.shadowRoot?.querySelector(".container.narrow")).not.toBeNull();
    expect(button(panel, "Bearbeiten")).toBeDefined();
    const canvas = panel.shadowRoot?.querySelector(".canvas-container");
    expect(canvas?.getAttribute("role")).toBe("application");
    expect(canvas?.getAttribute("tabindex")).toBe("0");
    expect(canvas?.getAttribute("aria-label")).toBe("Interaktive Grundrissfläche");
  });

  it("uploads, edits, saves, reloads, and restores a plan with an area and marker", async () => {
    mocks.loadFloorplanConfig.mockResolvedValueOnce({ ...config(), plans: [] });
    const panel = await mount(true);
    const fileInput = panel.shadowRoot!.querySelector(".file-input") as HTMLInputElement;
    const file = new File(["png"], "ground.png", { type: "image/png" });
    Object.defineProperty(fileInput, "files", { configurable: true, value: [file] });

    fileInput.dispatchEvent(new Event("change"));
    await vi.waitFor(() => expect(mocks.uploadFloorplanImage).toHaveBeenCalledOnce());
    await vi.waitFor(() => expect(panel.shadowRoot?.textContent).toContain("Changes saved."));

    button(panel, "Edit").click();
    await panel.updateComplete;
    const savesBeforeArea = mocks.saveFloorplanConfig.mock.calls.length;
    button(panel, "+ Add rectangle").click();
    await vi.waitFor(() => {
      expect(mocks.saveFloorplanConfig.mock.calls.length).toBeGreaterThan(savesBeforeArea);
      const saved = mocks.saveFloorplanConfig.mock.calls.at(-1)?.[1] as FloorplanConfig;
      expect(saved.plans[0].areas).toHaveLength(1);
    });

    const entitySelect = Array.from(panel.shadowRoot!.querySelectorAll("select")).find((select) =>
      Array.from(select.options).some((option) => option.value === "light.kitchen")
    );
    if (!entitySelect) throw new Error("Entity select not found");
    entitySelect.value = "light.kitchen";
    entitySelect.dispatchEvent(new Event("change"));
    await panel.updateComplete;
    button(panel, "+ Add marker").click();
    await vi.waitFor(() => {
      const saved = mocks.saveFloorplanConfig.mock.calls.at(-1)?.[1] as FloorplanConfig;
      expect(saved.plans[0].markers).toHaveLength(1);
    });

    panel.remove();
    const reloaded = await mount(true);
    expect(
      Array.from(reloaded.shadowRoot!.querySelectorAll("option")).some(
        (option) => option.textContent?.trim() === "ground"
      )
    ).toBe(true);
    const restored = mocks.loadFloorplanConfig.mock.results.at(-1)
      ?.value as Promise<FloorplanConfig>;
    await expect(restored).resolves.toMatchObject({
      plans: [{ areas: [{ shape: { type: "rect" } }], markers: [{ entity_id: "light.kitchen" }] }],
    });
  });
});
