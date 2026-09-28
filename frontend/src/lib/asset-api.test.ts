import { afterEach, describe, expect, it, vi } from "vitest";
import { Buffer } from "node:buffer";

import type { FloorplanConfig, HomeAssistant } from "../types/home-assistant";
import {
  createPortableConfig,
  fetchFloorplanImage,
  materializeImportedImages,
  MAX_PORTABLE_CONFIG_BYTES,
  uploadFloorplanImage,
} from "./asset-api";

afterEach(() => vi.unstubAllGlobals());

function config(count = 1): FloorplanConfig {
  return {
    version: 3,
    revision: 0,
    default_view: "all",
    views: [{ id: "all", name: "All", filters: {} }],
    plans: Array.from({ length: count }, (_, i) => ({
      plan_id: `plan-${i}`,
      name: `Plan ${i}`,
      background: {
        type: "image",
        asset_id: "a".repeat(64),
        content_type: "image/png",
        url: "/expired",
        width: 800,
        height: 600,
      },
      areas: [],
      markers: [],
      view: { minZoom: 0.1, maxZoom: 5 },
    })),
  };
}

describe("asset API", () => {
  it("fetches canonical assets with authentication even when signed URLs have expired", async () => {
    const fetchWithAuth = vi.fn().mockResolvedValue(new Response("image"));
    const hass = { fetchWithAuth } as unknown as HomeAssistant;
    const blob = await fetchFloorplanImage(hass, config().plans[0].background);
    expect(await blob.text()).toBe("image");
    expect(fetchWithAuth).toHaveBeenCalledWith(`/api/floorplan_ui/assets/${"a".repeat(64)}`);
  });

  it("round-trips backups over 20 MB with bounded metadata messages and deduplicated transfers", async () => {
    vi.stubGlobal(
      "FileReader",
      class {
        result = "";
        onload?: () => void;
        readAsDataURL(blob: Blob) {
          void blob.arrayBuffer().then((bytes) => {
            this.result = `data:${blob.type};base64,${Buffer.from(bytes).toString("base64")}`;
            this.onload?.();
          });
        }
      }
    );
    const image = new Uint8Array(3_600_000).fill(42);
    const fetchWithAuth = vi.fn(async (_path: string, init?: { method?: string; body?: Blob }) => {
      if (init?.method === "POST") {
        expect(await (init.body as Blob).arrayBuffer()).toEqual(image.buffer);
        return new Response(
          JSON.stringify({ asset_id: "a".repeat(64), content_type: "image/png", url: "/fresh" })
        );
      }
      return new Response(image, { headers: { "Content-Type": "image/png" } });
    });
    const callWS = vi.fn(async (message: { config: FloorplanConfig }) => {
      expect(JSON.stringify(message.config).length).toBeLessThan(20_000_000);
      expect(message.config.plans.every((plan) => !plan.background.url)).toBe(true);
      return { config: structuredClone(message.config) };
    });
    const hass = { fetchWithAuth, callWS } as unknown as HomeAssistant;
    const original = config(5);
    const portable = await createPortableConfig(hass, original);
    const serialized = JSON.stringify(portable);
    expect(serialized.length).toBeGreaterThan(20_000_000);
    expect(serialized.length).toBeLessThan(MAX_PORTABLE_CONFIG_BYTES);
    const restored = await materializeImportedImages(hass, JSON.parse(serialized));
    expect(restored.plans).toHaveLength(5);
    expect(restored.plans.every((plan) => plan.background.asset_id === "a".repeat(64))).toBe(true);
    expect(fetchWithAuth).toHaveBeenCalledTimes(2);
    expect(original.plans[0].background.url).toBe("/expired");
  });

  it("rejects invalid metadata before uploading embedded images", async () => {
    const input = config();
    input.plans[0].background = {
      type: "image",
      url: "data:image/png;base64,YQ==",
      width: 0,
      height: 10,
    };
    const fetchWithAuth = vi.fn();
    const hass = {
      fetchWithAuth,
      callWS: vi.fn().mockRejectedValue(new Error("Invalid width")),
    } as unknown as HomeAssistant;
    await expect(materializeImportedImages(hass, input)).rejects.toThrow("Invalid width");
    expect(fetchWithAuth).not.toHaveBeenCalled();
  });

  it("uses Home Assistant's authenticated fetch helper for raw uploads", async () => {
    const requests: Array<{
      path: string;
      init?: Record<string, unknown>;
    }> = [];
    const hass = {
      fetchWithAuth: async (path: string, init?: Record<string, unknown>) => {
        requests.push({ path, init });
        return new Response(
          JSON.stringify({
            asset_id: "a".repeat(64),
            content_type: "image/png",
            url: "/api/floorplan_ui/assets/signed",
          }),
          {
            status: 201,
            headers: { "Content-Type": "application/json" },
          }
        );
      },
    } as unknown as HomeAssistant;
    const image = new Blob([new Uint8Array([137, 80, 78, 71])], {
      type: "image/png",
    });

    await expect(uploadFloorplanImage(hass, image)).resolves.toMatchObject({
      asset_id: "a".repeat(64),
      content_type: "image/png",
    });
    expect(requests[0].path).toBe("/api/floorplan_ui/assets");
    expect(requests[0].init?.method).toBe("POST");
    expect(requests[0].init?.body).toBe(image);
  });
});
