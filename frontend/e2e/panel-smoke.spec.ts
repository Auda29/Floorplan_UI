import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { expect, test } from "@playwright/test";

const bundlePath = resolve(
  process.cwd(),
  "../custom_components/floorplan_ui/frontend/floorplan-ui.js"
);

const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAAFElEQVR4nGP8//8/AwwwMSAB3BwAlm4DBfIlvvkAAAAASUVORK5CYII=",
  "base64"
);
const pngDataUrl = `data:image/png;base64,${png.toString("base64")}`;

function contrastRatio(foreground: string, background: string): number {
  const luminance = (color: string): number => {
    const channels = color
      .match(/[\d.]+/g)
      ?.slice(0, 3)
      .map(Number);
    if (!channels || channels.length !== 3) throw new Error(`Unsupported color: ${color}`);
    const linear = channels.map((channel) => {
      const normalized = channel / 255;
      return normalized <= 0.04045
        ? normalized / 12.92
        : Math.pow((normalized + 0.055) / 1.055, 2.4);
    });
    return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
  };
  const light = Math.max(luminance(foreground), luminance(background));
  const dark = Math.min(luminance(foreground), luminance(background));
  return (light + 0.05) / (dark + 0.05);
}

test("production bundle completes upload, save, edit, and reload", async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.route("http://localhost/", (route) =>
    route.fulfill({ contentType: "text/html", body: "<!doctype html><html><body></body></html>" })
  );
  await page.goto("http://localhost/");
  await page.addStyleTag({
    content: "html, body { height: 100%; margin: 0; } floorplan-ui-panel { height: 100%; }",
  });
  await page.addScriptTag({ content: await readFile(bundlePath, "utf8"), type: "module" });
  await page.waitForFunction(() => customElements.get("floorplan-ui-panel") !== undefined);

  await page.evaluate((assetUrl) => {
    const config = {
      version: 3,
      revision: 0,
      default_view: "all",
      plans: [],
      views: [{ id: "all", name: "All", filters: {} }],
    };
    const harness = {
      config,
      saves: 0,
      hass: {} as Record<string, unknown>,
    };
    const hass = {
      states: {},
      services: {},
      user: { id: "admin", name: "Browser Admin", is_admin: true },
      language: "en",
      connection: { subscribeEvents: async () => () => undefined },
      callService: async () => undefined,
      callWS: async (message: Record<string, unknown>) => {
        switch (message.type) {
          case "floorplan_ui/get_config":
            return structuredClone(harness.config);
          case "floorplan_ui/list_registry":
            return {
              areas: [{ id: "living", name: "Living room" }],
              entities: Array.from({ length: 24 }, (_, index) => ({
                entity_id: `light.editor_test_${index}`,
                name: `Editor test light ${index}`,
                icon: null,
                area_id: "living",
                device_id: null,
                domain: "light",
              })),
            };
          case "floorplan_ui/validate_config":
            return { config: structuredClone(message.config) };
          case "floorplan_ui/save_config": {
            const saved = structuredClone(message.config) as typeof config;
            saved.revision = harness.config.revision + 1;
            harness.config = saved;
            harness.saves += 1;
            return { success: true, revision: saved.revision };
          }
          default:
            throw new Error(`Unexpected WebSocket command: ${String(message.type)}`);
        }
      },
      fetchWithAuth: async () =>
        new Response(
          JSON.stringify({
            asset_id: "a".repeat(64),
            content_type: "image/png",
            url: assetUrl,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        ),
    };
    harness.hass = hass;
    Object.assign(window, { __floorplanHarness: harness });
    const panel = document.createElement("floorplan-ui-panel") as HTMLElement & {
      hass: typeof hass;
      narrow: boolean;
    };
    panel.hass = hass;
    panel.narrow = false;
    document.body.append(panel);
  }, pngDataUrl);

  const panel = page.locator("floorplan-ui-panel");
  await expect(panel.locator("h1")).toHaveText("Floorplan");
  await panel.locator("input.file-input").setInputFiles({
    name: "ground.png",
    mimeType: "image/png",
    buffer: png,
  });
  await expect(panel.locator(".status")).toContainText("Changes saved.");

  await panel.getByRole("button", { name: "Edit" }).click();
  const editor = panel.locator(".editor-panel");
  await expect(editor).toBeVisible();
  await expect(editor.locator("details.editor-plan-view")).not.toHaveAttribute("open", "");
  await expect(editor.locator("details.editor-advanced")).not.toHaveAttribute("open", "");
  const layout = await panel.evaluate((element) => {
    const root = element.shadowRoot!;
    const editorElement = root.querySelector<HTMLElement>(".editor-panel")!;
    const canvasElement = root.querySelector<HTMLElement>(".canvas-container")!;
    const stageElement = root.querySelector<HTMLElement>(".konvajs-content")!;
    const editorBounds = editorElement.getBoundingClientRect();
    const canvasBounds = canvasElement.getBoundingClientRect();
    return {
      editorWidth: editorBounds.width,
      editorTop: editorBounds.top,
      canvasTop: canvasBounds.top,
      canvasWidth: canvasBounds.width,
      canvasHeight: canvasBounds.height,
      stageWidth: stageElement.getBoundingClientRect().width,
      stageHeight: stageElement.getBoundingClientRect().height,
      editorHasHorizontalOverflow: editorElement.scrollWidth > editorElement.clientWidth,
      editorColor: getComputedStyle(editorElement).color,
      editorBackground: getComputedStyle(editorElement).backgroundColor,
    };
  });
  expect(layout.editorWidth).toBeGreaterThanOrEqual(320);
  expect(layout.editorWidth).toBeLessThanOrEqual(420);
  expect(layout.canvasTop).toBeCloseTo(layout.editorTop, 0);
  expect(layout.canvasHeight).toBeGreaterThan(700);
  expect(layout.stageWidth).toBeCloseTo(layout.canvasWidth, 0);
  expect(layout.stageHeight).toBeCloseTo(layout.canvasHeight, 0);
  expect(layout.editorHasHorizontalOverflow).toBe(false);
  expect(contrastRatio(layout.editorColor, layout.editorBackground)).toBeGreaterThanOrEqual(4.5);

  const darkTheme = await panel.evaluate((element) => {
    element.style.setProperty("--card-background-color", "#1c1c1c");
    element.style.setProperty("--primary-background-color", "#111111");
    element.style.setProperty("--secondary-background-color", "#2a2a2a");
    element.style.setProperty("--primary-text-color", "#ffffff");
    element.style.setProperty("--secondary-text-color", "#c7c7c7");
    element.style.setProperty("--divider-color", "#4a4a4a");
    const root = element.shadowRoot!;
    const editorElement = root.querySelector<HTMLElement>(".editor-panel")!;
    const labelElement = root.querySelector<HTMLElement>(".editor-fields label")!;
    const inputElement = root.querySelector<HTMLInputElement>(".editor-fields input")!;
    return {
      editorColor: getComputedStyle(editorElement).color,
      editorBackground: getComputedStyle(editorElement).backgroundColor,
      labelColor: getComputedStyle(labelElement).color,
      cardBackground: getComputedStyle(root.querySelector<HTMLElement>(".editor-card")!)
        .backgroundColor,
      inputColor: getComputedStyle(inputElement).color,
      inputBackground: getComputedStyle(inputElement).backgroundColor,
    };
  });
  expect(contrastRatio(darkTheme.editorColor, darkTheme.editorBackground)).toBeGreaterThanOrEqual(
    4.5
  );
  expect(contrastRatio(darkTheme.labelColor, darkTheme.cardBackground)).toBeGreaterThanOrEqual(4.5);
  expect(contrastRatio(darkTheme.inputColor, darkTheme.inputBackground)).toBeGreaterThanOrEqual(
    4.5
  );

  const planViewSummary = editor.locator("details.editor-plan-view > summary");
  const advancedSummary = editor.locator("details.editor-advanced > summary");
  await planViewSummary.focus();
  await page.keyboard.press("Tab");
  await expect(advancedSummary).toBeFocused();
  expect(
    await advancedSummary.evaluate((element) => getComputedStyle(element).outlineStyle)
  ).not.toBe("none");
  await page.keyboard.press("Enter");
  await expect(editor.locator("details.editor-advanced")).toHaveAttribute("open", "");

  await panel.getByRole("button", { name: "+ Add rectangle", exact: true }).click();
  await page.waitForFunction(() => {
    const state = (
      window as unknown as {
        __floorplanHarness: { config: { plans: Array<{ areas: unknown[] }> }; saves: number };
      }
    ).__floorplanHarness;
    return state.saves >= 2 && state.config.plans[0]?.areas.length === 1;
  });

  await page.evaluate(() => {
    const state = (
      window as unknown as {
        __floorplanHarness: {
          config: {
            plans: Array<{ name: string }>;
            views: Array<{ name: string }>;
          };
          hass: Record<string, unknown>;
        };
      }
    ).__floorplanHarness;
    state.config.plans[0].name =
      "SehrLangerDeutscherGrundrissnameFürDasVollständigeErdgeschossMitWohnbereichKücheEsszimmerFlurArbeitszimmerTechnikraum";
    state.config.views[0].name =
      "SehrLangeDeutscheAnsichtFürBeleuchtungKlimatisierungBeschattungEnergieHeizungLüftungSicherheitMultimedia";
    document.querySelector("floorplan-ui-panel")?.remove();
    const panel = document.createElement("floorplan-ui-panel") as HTMLElement & {
      hass: Record<string, unknown>;
    };
    panel.hass = state.hass;
    document.body.append(panel);
  });

  const reloaded = page.locator("floorplan-ui-panel");
  await expect(
    reloaded.locator("option", { hasText: "SehrLangerDeutscherGrundrissname" })
  ).toHaveCount(1);
  const expectedPlanId = await page.evaluate(
    () =>
      (
        window as unknown as {
          __floorplanHarness: { config: { plans: Array<{ plan_id: string }> } };
        }
      ).__floorplanHarness.config.plans[0].plan_id
  );
  await expect(reloaded.locator(".plan-select select")).toHaveValue(expectedPlanId);
  await expect(reloaded.locator(".canvas-accessibility")).toContainText("Area area_");

  await page.setViewportSize({ width: 600, height: 600 });
  await page.evaluate(() => {
    const state = (
      window as unknown as {
        __floorplanHarness: { hass: Record<string, unknown> };
      }
    ).__floorplanHarness;
    const panel = document.querySelector("floorplan-ui-panel") as HTMLElement & {
      hass: Record<string, unknown>;
      narrow: boolean;
    };
    panel.hass = { ...state.hass, language: "de-DE" };
    panel.narrow = true;
  });
  await reloaded.getByRole("button", { name: "Bearbeiten" }).click();
  await expect(reloaded.getByRole("button", { name: "+ Rechteck hinzufügen" })).toBeVisible();
  await expect(
    reloaded.getByRole("tab", {
      name: "★ SehrLangeDeutscheAnsichtFürBeleuchtungKlimatisierungBeschattungEnergieHeizungLüftungSicherheitMultimedia",
    })
  ).toBeVisible();
  const narrowLayout = await reloaded.evaluate((element) => {
    const root = element.shadowRoot!;
    const containerElement = root.querySelector<HTMLElement>(".container")!;
    const toolbarElement = root.querySelector<HTMLElement>(".toolbar")!;
    const workspaceElement = root.querySelector<HTMLElement>(".workspace")!;
    const editorElement = root.querySelector<HTMLElement>(".editor-panel")!;
    const canvasElement = root.querySelector<HTMLElement>(".canvas-container")!;
    const stageElement = root.querySelector<HTMLElement>(".konvajs-content")!;
    const editorBounds = editorElement.getBoundingClientRect();
    const canvasBounds = canvasElement.getBoundingClientRect();
    const firstButton = editorElement.querySelector("button")!;
    const visibleTouchTargets = Array.from(
      root.querySelectorAll<HTMLElement>("button, select, input, details > summary, .entity-card")
    )
      .filter((target) => !target.closest(".canvas-accessibility"))
      .map((target) => target.getBoundingClientRect())
      .filter((bounds) => bounds.width > 0 && bounds.height > 0);
    return {
      editorWidth: editorBounds.width,
      canvasWidth: canvasBounds.width,
      editorBottom: editorBounds.bottom,
      canvasTop: canvasBounds.top,
      editorHeight: editorBounds.height,
      stageWidth: stageElement.getBoundingClientRect().width,
      stageHeight: stageElement.getBoundingClientRect().height,
      editorHasHorizontalOverflow: editorElement.scrollWidth > editorElement.clientWidth,
      buttonHeight: firstButton.getBoundingClientRect().height,
      minimumTouchTargetHeight: Math.min(...visibleTouchTargets.map((bounds) => bounds.height)),
      workspaceIsScrollable: workspaceElement.scrollHeight > workspaceElement.clientHeight,
      documentHasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
      containerHasHorizontalOverflow: containerElement.scrollWidth > containerElement.clientWidth,
      toolbarHasHorizontalOverflow: toolbarElement.scrollWidth > toolbarElement.clientWidth,
    };
  });
  expect(narrowLayout.editorWidth).toBeCloseTo(narrowLayout.canvasWidth, 0);
  expect(narrowLayout.canvasTop).toBeCloseTo(narrowLayout.editorBottom, 0);
  expect(narrowLayout.editorHeight).toBeGreaterThanOrEqual(260);
  expect(narrowLayout.editorHeight).toBeLessThanOrEqual(410);
  expect(narrowLayout.stageWidth).toBeCloseTo(narrowLayout.canvasWidth, 0);
  expect(narrowLayout.stageHeight).toBeCloseTo(400, 0);
  expect(narrowLayout.editorHasHorizontalOverflow).toBe(false);
  expect(narrowLayout.buttonHeight).toBeGreaterThanOrEqual(44);
  expect(narrowLayout.minimumTouchTargetHeight).toBeGreaterThanOrEqual(44);
  expect(narrowLayout.workspaceIsScrollable).toBe(true);
  expect(narrowLayout.documentHasHorizontalOverflow).toBe(false);
  expect(narrowLayout.containerHasHorizontalOverflow).toBe(false);
  expect(narrowLayout.toolbarHasHorizontalOverflow).toBe(false);

  const entitySelect = reloaded.locator(".editor-add-row select");
  await entitySelect.selectOption("light.editor_test_0");
  await reloaded.getByRole("button", { name: "+ Marker hinzufügen" }).click();
  await page.waitForFunction(() => {
    const state = (
      window as unknown as {
        __floorplanHarness: {
          config: { plans: Array<{ markers: Array<{ entity_id: string }> }> };
        };
      }
    ).__floorplanHarness;
    return state.config.plans[0]?.markers.some(
      (marker) => marker.entity_id === "light.editor_test_0"
    );
  });

  const narrowScrollTop = await reloaded.evaluate((element) => {
    const workspaceElement = element.shadowRoot!.querySelector<HTMLElement>(".workspace")!;
    workspaceElement.scrollTop = workspaceElement.scrollHeight;
    return workspaceElement.scrollTop;
  });
  expect(narrowScrollTop).toBeGreaterThan(0);

  await page.setViewportSize({ width: 899, height: 700 });
  await reloaded.evaluate((element) => {
    (element as HTMLElement & { narrow: boolean }).narrow = false;
  });
  const mediaLayout = await reloaded.evaluate((element) => {
    const root = element.shadowRoot!;
    const containerElement = root.querySelector<HTMLElement>(".container")!;
    const toolbarElement = root.querySelector<HTMLElement>(".toolbar")!;
    const editorElement = root.querySelector<HTMLElement>(".editor-panel")!;
    const canvasElement = root.querySelector<HTMLElement>(".canvas-container")!;
    const stageElement = root.querySelector<HTMLElement>(".konvajs-content")!;
    const firstButton = editorElement.querySelector("button")!;
    const visibleTouchTargets = Array.from(
      root.querySelectorAll<HTMLElement>("button, select, input, details > summary, .entity-card")
    )
      .filter((target) => !target.closest(".canvas-accessibility"))
      .map((target) => target.getBoundingClientRect())
      .filter((bounds) => bounds.width > 0 && bounds.height > 0);
    return {
      editorHeight: editorElement.getBoundingClientRect().height,
      buttonHeight: firstButton.getBoundingClientRect().height,
      minimumTouchTargetHeight: Math.min(...visibleTouchTargets.map((bounds) => bounds.height)),
      canvasWidth: canvasElement.getBoundingClientRect().width,
      canvasHeight: canvasElement.getBoundingClientRect().height,
      stageWidth: stageElement.getBoundingClientRect().width,
      stageHeight: stageElement.getBoundingClientRect().height,
      documentHasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
      containerHasHorizontalOverflow: containerElement.scrollWidth > containerElement.clientWidth,
      toolbarHasHorizontalOverflow: toolbarElement.scrollWidth > toolbarElement.clientWidth,
    };
  });
  expect(mediaLayout.editorHeight).toBeGreaterThanOrEqual(260);
  expect(mediaLayout.buttonHeight).toBeGreaterThanOrEqual(44);
  expect(mediaLayout.minimumTouchTargetHeight).toBeGreaterThanOrEqual(44);
  expect(mediaLayout.stageWidth).toBeCloseTo(mediaLayout.canvasWidth, 0);
  expect(mediaLayout.stageHeight).toBeCloseTo(mediaLayout.canvasHeight, 0);
  expect(mediaLayout.documentHasHorizontalOverflow).toBe(false);
  expect(mediaLayout.containerHasHorizontalOverflow).toBe(false);
  expect(mediaLayout.toolbarHasHorizontalOverflow).toBe(false);
});
