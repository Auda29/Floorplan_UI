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
  const browserErrors: string[] = [];
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  await page.setViewportSize({ width: 1920, height: 946 });
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
              entities: [
                {
                  entity_id: "input_number.solltemperatur_flur",
                  name: "Solltemperatur_Flur",
                  icon: null,
                  area_id: "living",
                  device_id: null,
                  domain: "input_number",
                },
                ...Array.from({ length: 167 }, (_, index) => ({
                  entity_id: `light.editor_test_${index}`,
                  name: `Editor test light ${index}`,
                  icon: null,
                  area_id: "living",
                  device_id: null,
                  domain: "light",
                })),
              ],
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

  const draggedEntityId = "input_number.solltemperatur_flur";
  const draggedEntity = editor.locator(".entity-card", { hasText: draggedEntityId });
  const canvas = panel.locator(".canvas-container");
  await expect(draggedEntity).toBeVisible();
  await draggedEntity.dragTo(canvas, { targetPosition: { x: 360, y: 260 } });
  await page.waitForFunction((entityId) => {
    const state = (
      window as unknown as {
        __floorplanHarness: {
          config: {
            plans: Array<{
              markers: Array<{ entity_id: string; pos: { x: number; y: number } }>;
            }>;
          };
        };
      }
    ).__floorplanHarness;
    return state.config.plans[0]?.markers.some(
      (marker) =>
        marker.entity_id === entityId &&
        Number.isFinite(marker.pos.x) &&
        Number.isFinite(marker.pos.y)
    );
  }, draggedEntityId);
  await expect(panel.locator(".canvas-accessibility")).toContainText(draggedEntityId);
  const draggedMarkerRendering = await panel.evaluate((element, entityId) => {
    const marker = (
      window as unknown as {
        __floorplanHarness: {
          config: {
            plans: Array<{ markers: Array<{ id: string; entity_id: string }> }>;
          };
        };
      }
    ).__floorplanHarness.config.plans[0].markers.find((entry) => entry.entity_id === entityId);
    const panelInternals = element as HTMLElement & {
      _markerGroups: Map<
        string,
        {
          getClientRect(): { x: number; y: number; width: number; height: number };
          isVisible(): boolean;
        }
      >;
    };
    const group = marker ? panelInternals._markerGroups.get(marker.id) : undefined;
    const bounds = group?.getClientRect();
    const canvasBounds = element
      .shadowRoot!.querySelector<HTMLElement>(".canvas-container")!
      .getBoundingClientRect();
    return {
      exists: Boolean(group),
      visible: group?.isVisible() ?? false,
      insideCanvas:
        Boolean(bounds) &&
        bounds!.x + bounds!.width >= 0 &&
        bounds!.y + bounds!.height >= 0 &&
        bounds!.x <= canvasBounds.width &&
        bounds!.y <= canvasBounds.height,
    };
  }, draggedEntityId);
  expect(draggedMarkerRendering).toEqual({ exists: true, visible: true, insideCanvas: true });

  const manuallyDraggedEntityId = "light.editor_test_1";
  const manuallyDraggedEntity = editor
    .getByText(manuallyDraggedEntityId, { exact: true })
    .locator("..");
  await manuallyDraggedEntity.scrollIntoViewIfNeeded();
  const sourceBounds = await manuallyDraggedEntity.boundingBox();
  const targetBounds = await canvas.boundingBox();
  expect(sourceBounds).not.toBeNull();
  expect(targetBounds).not.toBeNull();
  await page.mouse.move(
    sourceBounds!.x + sourceBounds!.width / 2,
    sourceBounds!.y + sourceBounds!.height / 2
  );
  await page.mouse.down();
  await page.mouse.move(targetBounds!.x + 480, targetBounds!.y + 340, { steps: 24 });
  await expect(canvas).toHaveClass(/drag-target/);
  await page.mouse.up();
  await expect(canvas).not.toHaveClass(/drag-target/);
  await page.waitForFunction((entityId) => {
    const state = (
      window as unknown as {
        __floorplanHarness: {
          config: { plans: Array<{ markers: Array<{ entity_id: string }> }> };
        };
      }
    ).__floorplanHarness;
    return state.config.plans[0]?.markers.some((marker) => marker.entity_id === entityId);
  }, manuallyDraggedEntityId);
  await expect(panel.locator(".canvas-accessibility")).toContainText(manuallyDraggedEntityId);

  const captureFallbackEntityId = "light.editor_test_15";
  const captureFallbackEntity = editor
    .getByText(captureFallbackEntityId, { exact: true })
    .locator("..");
  await captureFallbackEntity.scrollIntoViewIfNeeded();
  await captureFallbackEntity.evaluate((element) => {
    (element as HTMLElement).draggable = false;
    Object.defineProperty(element, "setPointerCapture", {
      configurable: true,
      value: () => {
        throw new Error("Pointer capture unavailable");
      },
    });
  });
  const captureFallbackSourceBounds = await captureFallbackEntity.boundingBox();
  expect(captureFallbackSourceBounds).not.toBeNull();
  await page.mouse.move(
    captureFallbackSourceBounds!.x + captureFallbackSourceBounds!.width / 2,
    captureFallbackSourceBounds!.y + captureFallbackSourceBounds!.height / 2
  );
  await page.mouse.down();
  await page.mouse.move(targetBounds!.x + 520, targetBounds!.y + 380, { steps: 24 });
  await page.mouse.up();
  await expect
    .poll(
      () =>
        page.evaluate((entityId) => {
          const markers = (
            window as unknown as {
              __floorplanHarness: {
                config: { plans: Array<{ markers: Array<{ entity_id: string }> }> };
              };
            }
          ).__floorplanHarness.config.plans[0]?.markers;
          return markers?.some((marker) => marker.entity_id === entityId) ?? false;
        }, captureFallbackEntityId),
      { timeout: 2_000 }
    )
    .toBe(true);

  const partialHtmlDragEntityId = "light.editor_test_16";
  const partialHtmlDragEntity = editor
    .getByText(partialHtmlDragEntityId, { exact: true })
    .locator("..");
  await partialHtmlDragEntity.scrollIntoViewIfNeeded();
  const partialHtmlDragSourceBounds = await partialHtmlDragEntity.boundingBox();
  expect(partialHtmlDragSourceBounds).not.toBeNull();
  const partialPointer = {
    pointerId: 51,
    pointerType: "mouse",
    isPrimary: true,
    button: 0,
    buttons: 1,
  };
  await partialHtmlDragEntity.dispatchEvent("pointerdown", {
    ...partialPointer,
    clientX: partialHtmlDragSourceBounds!.x + partialHtmlDragSourceBounds!.width / 2,
    clientY: partialHtmlDragSourceBounds!.y + partialHtmlDragSourceBounds!.height / 2,
  });
  await partialHtmlDragEntity.dispatchEvent("dragstart");
  await partialHtmlDragEntity.dispatchEvent("pointermove", {
    ...partialPointer,
    clientX: targetBounds!.x + 540,
    clientY: targetBounds!.y + 400,
  });
  await partialHtmlDragEntity.dispatchEvent("pointerup", {
    ...partialPointer,
    buttons: 0,
    clientX: targetBounds!.x + 540,
    clientY: targetBounds!.y + 400,
  });
  await expect
    .poll(() =>
      page.evaluate((entityId) => {
        const markers = (
          window as unknown as {
            __floorplanHarness: {
              config: { plans: Array<{ markers: Array<{ entity_id: string }> }> };
            };
          }
        ).__floorplanHarness.config.plans[0]?.markers;
        return markers?.filter((marker) => marker.entity_id === entityId).length ?? 0;
      }, partialHtmlDragEntityId)
    )
    .toBe(1);

  const secondaryPenEntityId = "light.editor_test_17";
  const secondaryPenEntity = editor.getByText(secondaryPenEntityId, { exact: true }).locator("..");
  await secondaryPenEntity.scrollIntoViewIfNeeded();
  const secondaryPenSourceBounds = await secondaryPenEntity.boundingBox();
  expect(secondaryPenSourceBounds).not.toBeNull();
  const secondaryPenPointer = {
    pointerId: 52,
    pointerType: "pen",
    isPrimary: true,
    button: 2,
    buttons: 2,
  };
  await secondaryPenEntity.dispatchEvent("pointerdown", {
    ...secondaryPenPointer,
    clientX: secondaryPenSourceBounds!.x + secondaryPenSourceBounds!.width / 2,
    clientY: secondaryPenSourceBounds!.y + secondaryPenSourceBounds!.height / 2,
  });
  await secondaryPenEntity.dispatchEvent("pointermove", {
    ...secondaryPenPointer,
    clientX: targetBounds!.x + 580,
    clientY: targetBounds!.y + 440,
  });
  await secondaryPenEntity.dispatchEvent("pointerup", {
    ...secondaryPenPointer,
    buttons: 0,
    clientX: targetBounds!.x + 580,
    clientY: targetBounds!.y + 440,
  });
  const secondaryPenMarkerCount = await page.evaluate((entityId) => {
    const markers = (
      window as unknown as {
        __floorplanHarness: {
          config: { plans: Array<{ markers: Array<{ entity_id: string }> }> };
        };
      }
    ).__floorplanHarness.config.plans[0]?.markers;
    return markers?.filter((marker) => marker.entity_id === entityId).length ?? 0;
  }, secondaryPenEntityId);
  expect(secondaryPenMarkerCount).toBe(0);

  const touchDraggedEntityId = "light.editor_test_10";
  const touchDraggedEntity = editor.getByText(touchDraggedEntityId, { exact: true }).locator("..");
  await touchDraggedEntity.scrollIntoViewIfNeeded();
  const touchSourceBounds = await touchDraggedEntity.boundingBox();
  const touchTargetBounds = await canvas.boundingBox();
  expect(touchSourceBounds).not.toBeNull();
  expect(touchTargetBounds).not.toBeNull();
  const touchPointer = {
    pointerId: 42,
    pointerType: "touch",
    isPrimary: true,
    button: 0,
    buttons: 1,
  };
  await touchDraggedEntity.dispatchEvent("pointerdown", {
    ...touchPointer,
    clientX: touchSourceBounds!.x + touchSourceBounds!.width / 2,
    clientY: touchSourceBounds!.y + touchSourceBounds!.height / 2,
  });
  await page.waitForTimeout(300);
  await touchDraggedEntity.dispatchEvent("pointermove", {
    ...touchPointer,
    clientX: touchTargetBounds!.x + 560,
    clientY: touchTargetBounds!.y + 420,
  });
  await expect(canvas).toHaveClass(/drag-target/);
  await touchDraggedEntity.dispatchEvent("pointerup", {
    ...touchPointer,
    buttons: 0,
    clientX: touchTargetBounds!.x + 560,
    clientY: touchTargetBounds!.y + 420,
  });
  await page.waitForFunction((entityId) => {
    const state = (
      window as unknown as {
        __floorplanHarness: {
          config: { plans: Array<{ markers: Array<{ entity_id: string }> }> };
        };
      }
    ).__floorplanHarness;
    return state.config.plans[0]?.markers.some((marker) => marker.entity_id === entityId);
  }, touchDraggedEntityId);
  await expect(panel.locator(".canvas-accessibility")).toContainText(touchDraggedEntityId);
  await expect(editor.locator(".editor-selection-name")).toHaveText(touchDraggedEntityId);

  const cancelledEntityId = "light.editor_test_11";
  const cancelledEntity = editor.getByText(cancelledEntityId, { exact: true }).locator("..");
  await cancelledEntity.scrollIntoViewIfNeeded();
  const cancelledSourceBounds = await cancelledEntity.boundingBox();
  expect(cancelledSourceBounds).not.toBeNull();
  await cancelledEntity.dispatchEvent("pointerdown", {
    ...touchPointer,
    pointerId: 43,
    clientX: cancelledSourceBounds!.x + cancelledSourceBounds!.width / 2,
    clientY: cancelledSourceBounds!.y + cancelledSourceBounds!.height / 2,
  });
  await page.waitForTimeout(300);
  await cancelledEntity.dispatchEvent("pointermove", {
    ...touchPointer,
    pointerId: 43,
    clientX: touchTargetBounds!.x + 620,
    clientY: touchTargetBounds!.y + 460,
  });
  await expect(canvas).toHaveClass(/drag-target/);
  await cancelledEntity.dispatchEvent("pointercancel", {
    ...touchPointer,
    pointerId: 43,
    buttons: 0,
    clientX: touchTargetBounds!.x + 620,
    clientY: touchTargetBounds!.y + 460,
  });
  await expect(canvas).not.toHaveClass(/drag-target/);

  const tappedEntityId = "light.editor_test_12";
  const tappedEntity = editor.getByText(tappedEntityId, { exact: true }).locator("..");
  await tappedEntity.scrollIntoViewIfNeeded();
  const tappedBounds = await tappedEntity.boundingBox();
  expect(tappedBounds).not.toBeNull();
  await tappedEntity.dispatchEvent("pointerdown", {
    ...touchPointer,
    pointerId: 44,
    clientX: tappedBounds!.x + tappedBounds!.width / 2,
    clientY: tappedBounds!.y + tappedBounds!.height / 2,
  });
  await tappedEntity.dispatchEvent("pointerup", {
    ...touchPointer,
    pointerId: 44,
    buttons: 0,
    clientX: tappedBounds!.x + tappedBounds!.width / 2,
    clientY: tappedBounds!.y + tappedBounds!.height / 2,
  });

  const dragMarkerCounts = await page.evaluate(
    ([first, second, third, cancelled, tapped]) => {
      const markers = (
        window as unknown as {
          __floorplanHarness: {
            config: { plans: Array<{ markers: Array<{ entity_id: string }> }> };
          };
        }
      ).__floorplanHarness.config.plans[0].markers;
      return [first, second, third, cancelled, tapped].map(
        (entityId) => markers.filter((marker) => marker.entity_id === entityId).length
      );
    },
    [
      draggedEntityId,
      manuallyDraggedEntityId,
      touchDraggedEntityId,
      cancelledEntityId,
      tappedEntityId,
    ] as const
  );
  expect(dragMarkerCounts).toEqual([1, 1, 1, 0, 0]);
  expect(browserErrors).toEqual([]);

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
  await expect(reloaded.locator(".canvas-accessibility")).toContainText(draggedEntityId);
  await expect(reloaded.locator(".canvas-accessibility")).toContainText(manuallyDraggedEntityId);
  await expect(reloaded.locator(".canvas-accessibility")).toContainText(touchDraggedEntityId);

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

  await page.setViewportSize({ width: 600, height: 1000 });
  const narrowTouchEntityId = "light.editor_test_14";
  const narrowTouchEntity = reloaded.getByText(narrowTouchEntityId, { exact: true }).locator("..");
  const narrowCanvas = reloaded.locator(".canvas-container");
  const narrowPalette = reloaded.locator(".entity-palette");
  await narrowPalette.evaluate((element) => {
    element.scrollTop = 0;
  });
  const firstTouchCard = narrowPalette.locator(".entity-card").first();
  await firstTouchCard.scrollIntoViewIfNeeded();
  await expect(firstTouchCard).toBeInViewport();
  const firstTouchCardBounds = await firstTouchCard.boundingBox();
  expect(firstTouchCardBounds).not.toBeNull();
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 1 });
  const scrollTouchStart = {
    x: firstTouchCardBounds!.x + firstTouchCardBounds!.width / 2,
    y: firstTouchCardBounds!.y + firstTouchCardBounds!.height / 2,
  };
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ ...scrollTouchStart, id: 1 }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ ...scrollTouchStart, id: 1, y: scrollTouchStart.y - 96 }],
  });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect
    .poll(() => narrowPalette.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);

  await narrowTouchEntity.scrollIntoViewIfNeeded();
  const narrowTouchSourceBounds = await narrowTouchEntity.boundingBox();
  const narrowTouchCanvasBounds = await narrowCanvas.boundingBox();
  expect(narrowTouchSourceBounds).not.toBeNull();
  expect(narrowTouchCanvasBounds).not.toBeNull();
  const touchStart = {
    x: narrowTouchSourceBounds!.x + narrowTouchSourceBounds!.width / 2,
    y: narrowTouchSourceBounds!.y + narrowTouchSourceBounds!.height / 2,
  };
  const touchEnd = {
    x: narrowTouchCanvasBounds!.x + narrowTouchCanvasBounds!.width / 2,
    y: narrowTouchCanvasBounds!.y + 180,
  };
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ ...touchStart, id: 1 }],
  });
  await page.waitForTimeout(300);
  for (let step = 1; step <= 16; step += 1) {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [
        {
          id: 1,
          x: touchStart.x + ((touchEnd.x - touchStart.x) * step) / 16,
          y: touchStart.y + ((touchEnd.y - touchStart.y) * step) / 16,
        },
      ],
    });
  }
  await expect(narrowCanvas).toHaveClass(/drag-target/);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await page.waitForFunction((entityId) => {
    const markers = (
      window as unknown as {
        __floorplanHarness: {
          config: { plans: Array<{ markers: Array<{ entity_id: string }> }> };
        };
      }
    ).__floorplanHarness.config.plans[0]?.markers;
    return markers?.some((marker) => marker.entity_id === entityId);
  }, narrowTouchEntityId);

  const entitySelect = reloaded.locator(".editor-add-row select");
  await entitySelect.selectOption("light.editor_test_2");
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
      (marker) => marker.entity_id === "light.editor_test_2"
    );
  });

  await page.setViewportSize({ width: 600, height: 600 });
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
