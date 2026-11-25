import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { expect, test, type Page } from "@playwright/test";
import type { FloorplanConfig, HomeAssistant } from "../src/types/home-assistant";
import { getMdiIconPath } from "../src/lib/mdi-icons";

declare global {
  interface Window {
    productionFloorplan: FloorplanConfig;
  }
}

test.use({ launchOptions: { args: ["--enable-unsafe-swiftshader"] } });

const origin = "http://floorplan.test";
const staticPath = "/floorplan_ui_static/";
const image =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480"><rect width="640" height="480" fill="#ddd"/></svg>';
const bundle = resolve(
  process.env.FLOORPLAN_TEST_BUNDLE ?? "../custom_components/floorplan_ui/frontend/floorplan-ui.js"
);

function cubeGlb(): Buffer {
  const positions = [
    -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,
  ];
  const indices = [
    0, 2, 1, 0, 3, 2, 4, 5, 6, 4, 6, 7, 0, 1, 5, 0, 5, 4, 3, 7, 6, 3, 6, 2, 0, 4, 7, 0, 7, 3, 1, 2,
    6, 1, 6, 5,
  ];
  const indexOffset = positions.length * 4;
  const bin = Buffer.alloc(indexOffset + indices.length * 2);
  positions.forEach((value, index) => bin.writeFloatLE(value, index * 4));
  indices.forEach((value, index) => bin.writeUInt16LE(value, indexOffset + index * 2));
  const json = JSON.stringify({
    asset: { version: "2.0" },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ name: "LivingCube", mesh: 0 }],
    meshes: [{ primitives: [{ attributes: { POSITION: 0 }, indices: 1 }] }],
    buffers: [{ byteLength: bin.length }],
    bufferViews: [
      { buffer: 0, byteOffset: 0, byteLength: indexOffset, target: 34962 },
      { buffer: 0, byteOffset: indexOffset, byteLength: bin.length - indexOffset, target: 34963 },
    ],
    accessors: [
      {
        bufferView: 0,
        componentType: 5126,
        count: 8,
        type: "VEC3",
        min: [-1, -1, -1],
        max: [1, 1, 1],
      },
      { bufferView: 1, componentType: 5123, count: 36, type: "SCALAR" },
    ],
  });
  const padded = Buffer.from(json.padEnd(Math.ceil(json.length / 4) * 4, " "));
  const glb = Buffer.alloc(28 + padded.length + bin.length);
  glb.write("glTF");
  glb.writeUInt32LE(2, 4);
  glb.writeUInt32LE(glb.length, 8);
  glb.writeUInt32LE(padded.length, 12);
  glb.write("JSON", 16);
  padded.copy(glb, 20);
  glb.writeUInt32LE(bin.length, 20 + padded.length);
  glb.write("BIN\0", 24 + padded.length);
  bin.copy(glb, 28 + padded.length);
  return glb;
}

async function mount(page: Page) {
  const requested: string[] = [];
  await page.route(`${origin}/**`, async (route) => {
    const { pathname } = new URL(route.request().url());
    if (pathname === "/") {
      return route.fulfill({
        contentType: "text/html",
        body: `<!doctype html><meta charset="utf-8"><style>body{margin:0}</style><script type="module" src="${staticPath}floorplan-ui.js"></script>`,
      });
    }
    if (pathname.startsWith(staticPath)) {
      requested.push(pathname.slice(staticPath.length));
      return route.fulfill({
        contentType: "text/javascript",
        body: await readFile(
          pathname === `${staticPath}floorplan-ui.js`
            ? bundle
            : resolve(dirname(bundle), pathname.slice(staticPath.length))
        ),
      });
    }
    return route.fulfill({ status: 404 });
  });
  await page.goto(origin);
  await page.waitForFunction(() => !!customElements.get("floorplan-ui-panel"));
  await page.evaluate((svg) => {
    const entity = (entity_id: string, state: string) => ({
      entity_id,
      state,
      attributes: { friendly_name: "Lamp" },
      last_changed: "",
      last_updated: "",
      context: { id: "", parent_id: null, user_id: null },
    });
    const initial: FloorplanConfig = {
      version: 4,
      revision: 1,
      default_view: "all",
      views: [
        { id: "all", name: "All", filters: {} },
        { id: "rooms", name: "Rooms", filters: {} },
      ],
      plans: [
        {
          plan_id: "ground",
          name: "Ground",
          markers: [],
          areas: [],
          background: {
            type: "image",
            width: 640,
            height: 480,
            asset_id: "a".repeat(64),
            content_type: "image/svg+xml",
          },
          view: { minZoom: 0.1, maxZoom: 5 },
        },
      ],
    };
    window.productionFloorplan = initial;
    const stored = new Map<string, Blob>([
      ["a".repeat(64), new Blob([svg], { type: "image/svg+xml" })],
    ]);
    const panel = document.createElement("floorplan-ui-panel") as HTMLElement & {
      hass: HomeAssistant;
    };
    panel.hass = {
      states: {
        "light.lamp": entity("light.lamp", "on"),
        "light.second": entity("light.second", "on"),
      },
      user: { id: "admin", name: "Admin", is_admin: true },
      language: "en",
      callWS: async (message: Record<string, unknown>) => {
        switch (message.type) {
          case "floorplan_ui/get_config":
            return structuredClone(window.productionFloorplan);
          case "floorplan_ui/list_registry":
            return {
              areas: [{ id: "living", name: "Living room" }],
              entities: ["light.lamp", "light.second"].map((entity_id) => ({
                entity_id,
                name: entity_id === "light.lamp" ? "Lamp" : "Second lamp",
                icon: "mdi:lightbulb",
                domain: "light",
                area_id: "living",
                device_id: null,
              })),
            };
          case "floorplan_ui/save_config": {
            const revision = window.productionFloorplan.revision + 1;
            window.productionFloorplan = {
              ...structuredClone(message.config as FloorplanConfig),
              revision,
            };
            return { success: true, revision };
          }
          default:
            throw new Error(`Unexpected command ${message.type}`);
        }
      },
      fetchWithAuth: async (
        path: string,
        init?: { body: Blob; headers: Record<string, string> }
      ) => {
        if (init?.body) {
          const content_type = init.headers["Content-Type"];
          const asset_id = (content_type === "model/gltf-binary" ? "b" : "c").repeat(64);
          const url = `/api/floorplan_ui/assets/${asset_id}`;
          stored.set(asset_id, new Blob([init.body], { type: content_type }));
          return Response.json({ asset_id, content_type, url });
        }
        return new Response(stored.get(path.split("/").at(-1) ?? ""));
      },
    } as HomeAssistant;
    document.body.append(panel);
  }, image);
  const panel = page.locator("floorplan-ui-panel");
  await expect(panel.locator(".canvas-wrapper .konvajs-content canvas").first()).toBeVisible();
  return { panel, requested };
}

test("production entry keeps SVG plans independent of the 3D chunk", async ({ page }) => {
  const { panel, requested } = await mount(page);
  await panel.getByRole("button", { name: "Edit", exact: true }).click();
  await panel.locator(".file-input").setInputFiles({
    name: "New SVG.svg",
    mimeType: "application/octet-stream",
    buffer: Buffer.from(image),
  });
  await expect(panel.locator(".plan-select select option:checked")).toHaveText("New SVG");
  await expect
    .poll(() => page.evaluate(() => window.productionFloorplan.plans.at(-1)?.background))
    .toMatchObject({
      type: "image",
      content_type: "image/svg+xml",
      width: 640,
      height: 480,
    });
  await expect(panel.locator(".floorplan-three-canvas")).toHaveCount(0);
  expect(requested).toEqual(["floorplan-ui.js"]);
});

async function openModelPlan(page: Page) {
  const { panel, requested } = await mount(page);
  expect(requested).toEqual(["floorplan-ui.js"]);
  await panel.getByRole("button", { name: "Edit", exact: true }).click();
  await panel.locator(".file-input").setInputFiles({
    name: "Cube.glb",
    mimeType: "application/octet-stream",
    buffer: cubeGlb(),
  });
  const canvas = panel.locator(".floorplan-three-canvas");
  await expect(canvas).toBeVisible();
  await expect(panel.locator(".konvajs-content")).toHaveCount(0);
  await expect
    .poll(() =>
      panel.evaluate((element) => {
        const viewport = (
          element as HTMLElement & { _threeViewport?: { getAvailableMeshes(): string[] } }
        )._threeViewport;
        return viewport?.getAvailableMeshes();
      })
    )
    .toContain("LivingCube");
  expect(requested).toEqual([
    "floorplan-ui.js",
    expect.stringMatching(/^chunks\/three-viewport-.*\.js$/),
  ]);
  return { panel, canvas };
}

test("3D keyboard placement focuses the canvas and respects Cancel", async ({ page }) => {
  const { panel } = await openModelPlan(page);
  const container = panel.locator(".canvas-container");
  await panel.locator(".map-dock").getByRole("button", { name: "Top", exact: true }).click();
  await panel.getByRole("button", { name: "Library", exact: true }).click();
  const lamp = panel.locator(".entity-card").filter({ hasText: "light.lamp" });
  const prompt = panel.locator(".placement-prompt");
  const markers = () => page.evaluate(() => window.productionFloorplan.plans.at(-1)?.markers);

  await lamp.click();
  await expect(container).toBeFocused();
  const cancel = prompt.getByRole("button", { name: "Cancel" });
  await cancel.focus();
  await page.keyboard.press("Enter");
  await expect(prompt).toHaveCount(0);
  await expect(panel.locator('[data-viewport-chip="marker"]')).toHaveCount(0);
  expect(await markers()).toEqual([]);

  await lamp.click();
  await expect(container).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(prompt).toHaveCount(0);
  await expect.poll(markers).toEqual([
    expect.objectContaining({
      entity_id: "light.lamp",
      pos: { x: expect.closeTo(0), y: expect.closeTo(1), z: expect.closeTo(0) },
    }),
  ]);
});

test("a native drop on the 3D canvas places only the dragged entity", async ({ page }) => {
  const { panel, canvas } = await openModelPlan(page);
  await panel.getByRole("button", { name: "Library", exact: true }).click();
  await panel.locator(".entity-card").filter({ hasText: "light.lamp" }).click();
  await expect(panel.locator(".placement-prompt")).toBeVisible();

  const target = (await canvas.boundingBox())!;
  const payload = await page.evaluateHandle(() => new DataTransfer());
  await panel
    .locator(".entity-card")
    .filter({ hasText: "light.second" })
    .dispatchEvent("dragstart", {
      dataTransfer: payload,
    });
  const drop = {
    dataTransfer: payload,
    clientX: target.x + target.width / 2,
    clientY: target.y + target.height / 2,
  };
  await canvas.dispatchEvent("dragover", drop);
  await canvas.dispatchEvent("drop", drop);
  await payload.dispose();
  await expect(panel.locator('[data-viewport-chip="marker"]')).toHaveCount(1);
  await expect
    .poll(() => page.evaluate(() => window.productionFloorplan.plans.at(-1)?.markers))
    .toEqual([
      expect.objectContaining({
        entity_id: "light.second",
        pos: { x: expect.any(Number), y: expect.any(Number), z: expect.any(Number) },
      }),
    ]);
});

test("production bundle loads GLB on demand and edits projected objects", async ({ page }) => {
  const { panel, canvas } = await openModelPlan(page);

  const dock = panel.locator(".map-dock");
  await dock.getByRole("button", { name: "Top", exact: true }).click();
  await dock.getByRole("button", { name: "Orthographic" }).click();
  await expect(dock.getByRole("button", { name: "Perspective" })).toBeVisible();
  await dock.getByRole("button", { name: "Front", exact: true }).click();

  await panel.getByRole("button", { name: "Settings", exact: true }).click();
  await panel.getByText("3D plan settings", { exact: true }).click();
  await panel.getByRole("button", { name: "Save current camera" }).click();
  await panel.getByRole("dialog").locator("input").fill("Front camera");
  await panel.getByRole("button", { name: "Save", exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(() => window.productionFloorplan.plans.at(-1)?.view.camera_presets?.[0])
    )
    .toMatchObject({ name: "Front camera", mode: "perspective" });
  await panel.getByRole("button", { name: "Rooms", exact: true }).click();
  await panel.getByText("View and overlays", { exact: true }).click();
  await panel.getByLabel("View camera preset").selectOption({ label: "Front camera" });
  await panel.getByRole("button", { name: /All$/ }).click();
  await dock.getByRole("button", { name: "Perspective" }).click();
  await panel.getByRole("button", { name: "Rooms", exact: true }).click();
  await expect(dock.getByRole("button", { name: "Perspective" })).toBeVisible();

  await panel.getByRole("button", { name: "Library", exact: true }).click();
  await panel.locator(".entity-card").filter({ hasText: "light.lamp" }).click();
  const surface = panel.locator(".placement-surface");
  await expect(surface).toHaveCount(0);
  const placeBounds = (await canvas.boundingBox())!;
  await page.mouse.click(
    placeBounds.x + placeBounds.width / 2,
    placeBounds.y + placeBounds.height / 2
  );
  await expect
    .poll(() => page.evaluate(() => window.productionFloorplan.plans.at(-1)?.markers[0]?.pos))
    .toEqual({ x: expect.any(Number), y: expect.any(Number), z: expect.any(Number) });
  const marker = panel.locator('[data-viewport-chip="marker"]');
  await expect(marker.locator("svg path")).toHaveAttribute("d", getMdiIconPath("mdi:lightbulb")!);
  const icon = panel.locator('input[list="floorplan-mdi-icons"]');
  await icon.fill("mdi:home");
  await icon.press("Tab");
  await expect(marker.locator("svg path")).toHaveAttribute("d", getMdiIconPath("mdi:home")!);

  const target = (await canvas.boundingBox())!;
  const payload = await page.evaluateHandle(() => {
    const transfer = new DataTransfer();
    transfer.setData("application/x-floorplan-entity", "light.second");
    return transfer;
  });
  await panel.locator(".canvas-container").dispatchEvent("drop", {
    dataTransfer: payload,
    clientX: target.x + target.width / 2 + 15,
    clientY: target.y + target.height / 2,
  });
  await payload.dispose();
  await expect
    .poll(() => page.evaluate(() => window.productionFloorplan.plans.at(-1)?.markers[1]))
    .toMatchObject({
      entity_id: "light.second",
      pos: { x: expect.any(Number), y: expect.any(Number), z: expect.any(Number) },
    });

  await panel.getByRole("button", { name: "Bind mesh" }).click();
  await expect(surface).toHaveCount(0);
  const bounds = (await canvas.boundingBox())!;
  await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await expect(panel.getByLabel("Mesh name")).toHaveValue("LivingCube");
  const planSelect = panel.locator(".plan-select select");
  await planSelect.selectOption("ground");
  await panel.locator(".warning-badge").click();
  await panel
    .locator(".warning-center li")
    .filter({ hasText: "has no Home Assistant area assigned" })
    .getByRole("button", { name: "Go to item" })
    .click();
  await expect(panel.locator(".warning-center")).toHaveCount(0);
  await expect(planSelect.locator("option:checked")).toHaveText("Cube");
  await expect(panel.getByLabel("Mesh name")).toHaveValue("LivingCube");
  await panel.getByLabel("HA area:").selectOption("living");

  await panel.getByRole("button", { name: "Settings", exact: true }).click();
  await panel.getByText("View and overlays", { exact: true }).click();
  await panel.getByLabel("Overlay mode").first().selectOption("aggregate");
  const area = panel.locator('[data-viewport-chip="area"]');
  await expect(area.locator(".floorplan-three-primary")).toHaveText("2");
  await panel.getByLabel("Highlight active areas").check();
  await expect
    .poll(() =>
      page.evaluate(
        () => window.productionFloorplan.views.find((view) => view.id === "rooms")?.style
      )
    )
    .toMatchObject({ highlight_active_areas: true });
  await planSelect.selectOption("ground");
  await expect(canvas).toHaveCount(0);
  await expect(panel.locator(".konvajs-content canvas").first()).toBeVisible();
});
