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

test("production bundle completes upload, save, edit, and reload", async ({ page }) => {
  await page.route("http://localhost/", (route) =>
    route.fulfill({ contentType: "text/html", body: "<!doctype html><html><body></body></html>" })
  );
  await page.goto("http://localhost/");
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
            return { areas: [], entities: [] };
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
    panel.narrow = true;
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
        __floorplanHarness: { hass: Record<string, unknown> };
      }
    ).__floorplanHarness;
    document.querySelector("floorplan-ui-panel")?.remove();
    const panel = document.createElement("floorplan-ui-panel") as HTMLElement & {
      hass: Record<string, unknown>;
    };
    panel.hass = state.hass;
    document.body.append(panel);
  });

  const reloaded = page.locator("floorplan-ui-panel");
  await expect(reloaded.locator("option", { hasText: "ground" })).toHaveCount(1);
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
});
