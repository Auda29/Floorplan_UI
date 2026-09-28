import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { expect, test, type Page } from "@playwright/test";
import type Konva from "konva";
import type { FloorplanConfig, HomeAssistant } from "../src/types/home-assistant";

interface Panel extends HTMLElement {
  hass: HomeAssistant;
  _stage: Konva.Stage;
  _markerGroups: Map<string, Konva.Group>;
  _areaShapes: Map<string, Konva.Shape>;
  _selectedMarkerId: string | null;
  _selectedAreaId: string | null;
  _currentPlanId: string | null;
}

interface Harness {
  config: FloorplanConfig;
  conflict: boolean;
  moreInfo: number;
}

declare global {
  interface Window {
    regressionHarness: Harness;
  }
}

test.use({ hasTouch: true, viewport: { width: 1400, height: 900 } });

async function mount(page: Page): Promise<void> {
  await page.route("http://localhost/", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<!doctype html><html><body></body></html>",
    })
  );
  await page.goto("http://localhost/");
  await page.addStyleTag({
    content: "html, body { height: 100%; margin: 0; } floorplan-ui-panel { height: 100%; }",
  });
  await page.addScriptTag({
    content: await readFile(
      resolve(process.cwd(), "../custom_components/floorplan_ui/frontend/floorplan-ui.js"),
      "utf8"
    ),
    type: "module",
  });
  await page.waitForFunction(() => !!customElements.get("floorplan-ui-panel"));
  await page.evaluate(() => {
    const harness: Harness = {
      conflict: false,
      moreInfo: 0,
      config: {
        version: 3,
        revision: 1,
        default_view: "all",
        views: [{ id: "all", name: "All", filters: {} }],
        plans: [
          {
            plan_id: "ground",
            name: "Ground",
            background: {
              type: "image",
              asset_id: "a".repeat(64),
              content_type: "image/png",
              url: "/expired-signed-url",
              width: 800,
              height: 600,
            },
            areas: [],
            markers: [
              {
                id: "lamp",
                entity_id: "light.kitchen",
                pos: { x: 300, y: 250 },
                icon: "mdi:lightbulb",
                label_mode: "auto",
                tags: [],
                bind: { primary: { source: "state" } },
              },
            ],
            view: { minZoom: 0.1, maxZoom: 5 },
          },
        ],
      },
    };
    window.regressionHarness = harness;
    const panel = document.createElement("floorplan-ui-panel") as Panel;
    panel.hass = {
      states: {},
      user: { id: "admin", name: "Admin", is_admin: true },
      language: "en",
      callWS: async (message: Record<string, unknown>) => {
        switch (message.type) {
          case "floorplan_ui/get_config":
            return structuredClone(harness.config);
          case "floorplan_ui/list_registry":
            return { areas: [], entities: [] };
          case "floorplan_ui/validate_config":
            return { config: structuredClone(message.config) };
          case "floorplan_ui/save_config": {
            if (harness.conflict) throw { code: "config_conflict" };
            const config = structuredClone(message.config) as FloorplanConfig;
            config.revision = harness.config.revision + 1;
            harness.config = config;
            return { success: true, revision: config.revision };
          }
          default:
            throw new Error(`Unexpected command ${message.type}`);
        }
      },
      fetchWithAuth: async (path: string) => {
        if (path !== `/api/floorplan_ui/assets/${"a".repeat(64)}`)
          throw new Error(`Unexpected asset URL ${path}`);
        return fetch(
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAAFElEQVR4nGP8//8/AwwwMSAB3BwAlm4DBfIlvvkAAAAASUVORK5CYII="
        );
      },
    } as HomeAssistant;
    panel.addEventListener("hass-more-info", () => {
      harness.moreInfo += 1;
    });
    document.body.append(panel);
  });
  await expect(page.locator("floorplan-ui-panel canvas")).toHaveCount(3);
  await expect
    .poll(() =>
      page.locator("floorplan-ui-panel").evaluate((element) => (element as Panel)._stage.scaleX())
    )
    .not.toBe(1);
}

async function markerPosition(page: Page) {
  return page.locator("floorplan-ui-panel").evaluate((element) => {
    const panel = element as Panel;
    const position = panel._markerGroups.get("lamp")!.getAbsolutePosition();
    const bounds = panel._stage.container().getBoundingClientRect();
    return { x: bounds.x + position.x, y: bounds.y + position.y };
  });
}

test("existing markers support touch, edit-mode selection, and persisted dragging", async ({
  page,
}) => {
  await mount(page);
  let position = await markerPosition(page);
  await page.touchscreen.tap(position.x, position.y);
  await expect.poll(() => page.evaluate(() => window.regressionHarness.moreInfo)).toBe(1);
  const panel = page.locator("floorplan-ui-panel");
  await panel.getByRole("button", { name: "Edit", exact: true }).click();
  position = await markerPosition(page);
  await page.mouse.click(position.x, position.y);
  await expect
    .poll(() => panel.evaluate((element) => (element as Panel)._selectedMarkerId))
    .toBe("lamp");
  await page.mouse.move(position.x, position.y);
  await page.mouse.down();
  await page.mouse.move(position.x + 80, position.y + 40, { steps: 10 });
  await page.mouse.up();
  await expect
    .poll(() => page.evaluate(() => window.regressionHarness.config.plans[0].markers[0].pos.x))
    .toBeGreaterThan(300);
  await expect.poll(() => page.evaluate(() => window.regressionHarness.moreInfo)).toBe(1);
  await panel.getByRole("button", { name: "Done", exact: true }).click();
  position = await markerPosition(page);
  await page.touchscreen.tap(position.x, position.y);
  await expect.poll(() => page.evaluate(() => window.regressionHarness.moreInfo)).toBe(2);
});

test("adding an area preserves pan and zoom and supports touch selection", async ({ page }) => {
  await mount(page);
  const panel = page.locator("floorplan-ui-panel");
  await panel.getByRole("button", { name: "Edit", exact: true }).click();
  await panel.evaluate((element) => {
    const stage = (element as Panel)._stage;
    stage.scale({ x: 0.7, y: 0.7 });
    stage.position({ x: 123, y: 87 });
  });
  await panel.getByRole("button", { name: "+ Add rectangle", exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => window.regressionHarness.config.plans[0].areas.length))
    .toBe(1);
  const viewport = await panel.evaluate((element) => {
    const stage = (element as Panel)._stage;
    return { scale: stage.scaleX(), position: stage.position() };
  });
  expect(viewport).toEqual({ scale: 0.7, position: { x: 123, y: 87 } });
  // Allow any accidentally restarted background load to complete.
  await page.waitForTimeout(150);
  expect(await panel.evaluate((element) => (element as Panel)._stage.scaleX())).toBe(0.7);
  const points = await panel.evaluate((element) => {
    const current = element as Panel;
    const bounds = current._stage.container().getBoundingClientRect();
    const area = [...current._areaShapes.values()][0].getAbsolutePosition();
    return {
      empty: { x: bounds.x + 10, y: bounds.y + 10 },
      area: { x: bounds.x + area.x + 15, y: bounds.y + area.y + 15 },
    };
  });
  await page.touchscreen.tap(points.empty.x, points.empty.y);
  await expect
    .poll(() => panel.evaluate((element) => (element as Panel)._selectedAreaId))
    .toBeNull();
  await page.touchscreen.tap(points.area.x, points.area.y);
  await expect
    .poll(() => panel.evaluate((element) => (element as Panel)._selectedAreaId))
    .not.toBeNull();
});

test("conflict reload reconnects the canvas and undo restores the final plan", async ({ page }) => {
  await mount(page);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const panel = page.locator("floorplan-ui-panel");
  await panel.getByRole("button", { name: "Edit", exact: true }).click();
  await page.evaluate(() => {
    window.regressionHarness.conflict = true;
  });
  await panel.getByRole("button", { name: "+ Add rectangle", exact: true }).click();
  await panel.getByRole("button", { name: "Reload latest", exact: true }).click();
  await panel.getByRole("button", { name: "Reload", exact: true }).click();
  await expect
    .poll(() => panel.evaluate((element) => (element as Panel)._stage?.container().isConnected))
    .toBe(true);
  await expect(panel.locator("canvas")).toHaveCount(3);
  await page.evaluate(() => {
    window.regressionHarness.conflict = false;
  });
  await panel.locator("details.editor-plan-view > summary").click();
  await panel.getByRole("button", { name: "Delete plan", exact: true }).click();
  await panel.getByRole("dialog").getByRole("button", { name: "Delete plan", exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => window.regressionHarness.config.plans.length))
    .toBe(0);
  await panel.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(panel.locator(".plan-select select")).toHaveValue("ground");
  await expect
    .poll(() => panel.evaluate((element) => (element as Panel)._markerGroups.size))
    .toBe(1);
  await expect
    .poll(() => page.evaluate(() => window.regressionHarness.config.plans.length))
    .toBe(1);
  expect(errors).toEqual([]);
});
