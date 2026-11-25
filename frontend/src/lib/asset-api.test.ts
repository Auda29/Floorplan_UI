// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Blob as NodeBlob, Buffer, File as NodeFile } from "node:buffer";
import { URL as NodeURL } from "node:url";

import type { FloorplanConfig, HomeAssistant, ModelBackground } from "../types/home-assistant";
import {
  createPortableConfig,
  fetchFloorplanImage,
  fetchFloorplanModel,
  materializeImportedImages,
  MAX_IMAGE_FILE_BYTES,
  MAX_MODEL_FILE_BYTES,
  MAX_PORTABLE_CONFIG_BYTES,
  readImageDimensions,
  uploadFloorplanImage,
  uploadFloorplanModel,
} from "./asset-api";

beforeEach(() => {
  // Use jsdom's DOMParser and keep Node's fetch-related globals for binary and data URLs.
  vi.stubGlobal("Blob", NodeBlob);
  vi.stubGlobal("File", NodeFile);
  vi.stubGlobal("URL", NodeURL);
});
afterEach(() => vi.unstubAllGlobals());

function glb(version = 2): ArrayBuffer {
  const json = '{"asset":{"version":"2.0"}}';
  const chunkLength = Math.ceil(json.length / 4) * 4;
  const buffer = new ArrayBuffer(20 + chunkLength);
  const header = new DataView(buffer);
  header.setUint32(0, 0x46546c67, true);
  header.setUint32(4, version, true);
  header.setUint32(8, buffer.byteLength, true);
  header.setUint32(12, chunkLength, true);
  header.setUint32(16, 0x4e4f534a, true);
  new Uint8Array(buffer, 20).set(new TextEncoder().encode(json.padEnd(chunkLength)));
  return buffer;
}

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
  it.each([
    [200, "null"],
    [200, '"text"'],
    [200, "[]"],
    [200, "{}"],
    [502, "<html>Bad gateway</html>"],
    [400, '{"error":42}'],
    [200, '{"asset_id":"invalid","content_type":"image/png","url":"/image"}'],
  ])(
    "reports an understandable error for an unexpected upload response (%s, %s)",
    async (status, body) => {
      const hass = {
        fetchWithAuth: vi.fn().mockResolvedValue(new Response(body, { status })),
      } as unknown as HomeAssistant;
      await expect(
        uploadFloorplanImage(hass, new Blob(["image"], { type: "image/png" }))
      ).rejects.toThrow("Image upload failed.");
    }
  );

  it("preserves the backend's image validation message", async () => {
    const hass = {
      fetchWithAuth: vi
        .fn()
        .mockResolvedValue(
          new Response('{"error":"The image dimensions are unsafe"}', { status: 400 })
        ),
    } as unknown as HomeAssistant;
    await expect(
      uploadFloorplanImage(hass, new Blob(["image"], { type: "image/png" }))
    ).rejects.toThrow("The image dimensions are unsafe");
  });

  it("fetches canonical assets with authentication even when signed URLs have expired", async () => {
    const fetchWithAuth = vi.fn().mockResolvedValue(new Response("image"));
    const hass = { fetchWithAuth } as unknown as HomeAssistant;
    const blob = await fetchFloorplanImage(hass, config().plans[0].background);
    expect(await blob.text()).toBe("image");
    expect(fetchWithAuth).toHaveBeenCalledWith(`/api/floorplan_ui/assets/${"a".repeat(64)}`);
  });

  it("uploads an SVG selected without a MIME type using the .svg extension", async () => {
    const result = { asset_id: "b".repeat(64), content_type: "image/svg+xml", url: "/signed" };
    const fetchWithAuth = vi.fn().mockResolvedValue(new Response(JSON.stringify(result)));
    const hass = { fetchWithAuth } as unknown as HomeAssistant;
    const file = new File(["<svg/>"], "Floor.SVG");
    await expect(uploadFloorplanImage(hass, file)).resolves.toEqual(result);
    expect(fetchWithAuth).toHaveBeenCalledWith("/api/floorplan_ui/assets", {
      method: "POST",
      headers: { "Content-Type": "image/svg+xml" },
      body: file,
    });
    await expect(
      uploadFloorplanImage(
        hass,
        new Blob([new Uint8Array(MAX_IMAGE_FILE_BYTES + 1)], { type: "image/svg+xml" })
      )
    ).rejects.toThrow("must not exceed 4 MB");
    expect(fetchWithAuth).toHaveBeenCalledOnce();
  });

  it("uploads a valid GLB as model/gltf-binary and validates the response type", async () => {
    const result = {
      asset_id: "b".repeat(64),
      content_type: "model/gltf-binary",
      url: "/signed",
    };
    const fetchWithAuth = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(result)))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ...result, content_type: "image/png" }))
      );
    const hass = { fetchWithAuth } as unknown as HomeAssistant;
    const file = new Blob([glb()]);
    await expect(uploadFloorplanModel(hass, file)).resolves.toEqual(result);
    expect(fetchWithAuth).toHaveBeenCalledWith("/api/floorplan_ui/assets", {
      method: "POST",
      headers: { "Content-Type": "model/gltf-binary" },
      body: file,
    });
    await expect(uploadFloorplanModel(hass, file)).rejects.toThrow("Model upload failed.");
  });

  it("rejects wrong GLB magic, version and oversized files before uploading", async () => {
    const fetchWithAuth = vi.fn();
    const hass = { fetchWithAuth } as unknown as HomeAssistant;
    const wrongMagic = glb();
    new DataView(wrongMagic).setUint32(0, 0, true);
    await expect(uploadFloorplanModel(hass, new Blob([wrongMagic]))).rejects.toThrow("signature");
    await expect(uploadFloorplanModel(hass, new Blob([glb(1)]))).rejects.toThrow("version 2");
    const oversized = new Blob([new Uint8Array(MAX_MODEL_FILE_BYTES + 1)]);
    const read = vi.spyOn(oversized, "arrayBuffer");
    await expect(uploadFloorplanModel(hass, oversized)).rejects.toThrow("exceeds 25 MB");
    expect(read).not.toHaveBeenCalled();
    expect(fetchWithAuth).not.toHaveBeenCalled();
  });

  it("downloads model bytes with authentication and handles HTTP errors", async () => {
    const buffer = glb();
    const fetchWithAuth = vi
      .fn()
      .mockResolvedValueOnce(new Response(buffer))
      .mockResolvedValueOnce(new Response(null, { status: 404 }));
    const hass = { fetchWithAuth } as unknown as HomeAssistant;
    const model: ModelBackground = { type: "model", asset_id: "test/id", url: "/expired" };
    await expect(fetchFloorplanModel(hass, model)).resolves.toEqual(buffer);
    expect(fetchWithAuth).toHaveBeenCalledWith("/api/floorplan_ui/assets/test%2Fid");
    await expect(fetchFloorplanModel(hass, model)).rejects.toThrow("could not be loaded");
  });

  it.each([
    ['viewBox="-10 20,600 400" width="100%"', { width: 600, height: 400 }],
    ['width="456.5px" height="3e2"', { width: 456.5, height: 300 }],
    ['width="100%" height="300px"', { width: 1000, height: 800 }],
    ["", { width: 1000, height: 800 }],
  ])("reads SVG dimensions from root attributes (%s)", async (attrs, dimensions) => {
    const file = new File(
      [`<?xml version="1.0"?><svg ${attrs}><rect width="20" height="30"/></svg>`],
      "floor.svg"
    );
    await expect(readImageDimensions(file)).resolves.toEqual(dimensions);
  });

  it.each(["image/png", "image/jpeg"])(
    "closes the decoded %s bitmap after measuring it",
    async (type) => {
      const close = vi.fn();
      const bitmap = vi.fn().mockResolvedValue({ width: 320, height: 280, close });
      vi.stubGlobal("createImageBitmap", bitmap);
      const file = new Blob([], { type });
      await expect(readImageDimensions(file)).resolves.toEqual({ width: 320, height: 280 });
      expect(bitmap).toHaveBeenCalledWith(file);
      expect(close).toHaveBeenCalledOnce();
    }
  );

  it("keeps portable GLB references and uploads embedded SVG with its saved dimensions", async () => {
    const source = config(2);
    source.version = 4;
    const model: ModelBackground = {
      type: "model",
      asset_id: "b".repeat(64),
      content_type: "model/gltf-binary",
      width: 800,
      height: 600,
      unit_scale: 0.5,
    };
    source.plans[0].background = { ...model, url: "/signed-glb" };
    source.plans[1].background = {
      type: "image",
      url: "data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%27100%25%27%2F%3E",
      width: 1920,
      height: 1080,
    };
    const svgUpload = {
      asset_id: "c".repeat(64),
      content_type: "image/svg+xml",
      url: "/signed-svg",
    };
    const fetchWithAuth = vi.fn().mockResolvedValue(new Response(JSON.stringify(svgUpload)));
    const callWS = vi.fn(async (message: { config: FloorplanConfig }) => ({
      config: structuredClone(message.config),
    }));
    const hass = { fetchWithAuth, callWS } as unknown as HomeAssistant;
    const portable = await createPortableConfig(hass, source);
    expect(fetchWithAuth).not.toHaveBeenCalled();
    expect(portable.plans[0].background).toEqual(model);
    expect(source.plans[0].background.url).toBe("/signed-glb");

    const restored = await materializeImportedImages(hass, portable);
    expect(restored.plans[0]).toEqual(portable.plans[0]);
    expect(restored.plans[1].background).toEqual({
      type: "image",
      ...svgUpload,
      width: 1920,
      height: 1080,
    });
    expect(fetchWithAuth).toHaveBeenCalledOnce();
    expect(fetchWithAuth.mock.calls[0][1].headers).toEqual({ "Content-Type": "image/svg+xml" });
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
        const uploadedBytes = Buffer.from(await (init.body as Blob).arrayBuffer());
        expect(uploadedBytes.equals(Buffer.from(image.buffer))).toBe(true);
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
      callWS: vi.fn().mockRejectedValue({ code: "invalid_config", message: "Invalid width" }),
    } as unknown as HomeAssistant;
    await expect(materializeImportedImages(hass, input)).rejects.toThrow("Invalid width");
    expect(fetchWithAuth).not.toHaveBeenCalled();
  });

  it("lets the server migrate a legacy backup with no plans field", async () => {
    const legacy = { version: 1 };
    const normalized = config(0);
    const callWS = vi.fn().mockResolvedValue({ config: normalized });
    const fetchWithAuth = vi.fn();
    const hass = { callWS, fetchWithAuth } as unknown as HomeAssistant;

    await expect(materializeImportedImages(hass, legacy as FloorplanConfig)).resolves.toEqual(
      normalized
    );
    expect(callWS).toHaveBeenCalledWith({ type: "floorplan_ui/validate_config", config: legacy });
    expect(fetchWithAuth).not.toHaveBeenCalled();
  });

  it("materializes embedded images when a legacy backup omits the background type", async () => {
    const raw = config();
    const background = { width: 800, height: 600, url: "data:image/jpeg;base64,YQ==" };
    raw.plans[0].background = background as FloorplanConfig["plans"][number]["background"];
    const normalized = config();
    normalized.plans[0].background = { type: "image", width: 800, height: 600 };
    const callWS = vi.fn().mockResolvedValue({ config: normalized });
    const upload = { asset_id: "c".repeat(64), content_type: "image/jpeg", url: "/signed-jpeg" };
    const fetchWithAuth = vi.fn().mockResolvedValue(new Response(JSON.stringify(upload)));
    const hass = { callWS, fetchWithAuth } as unknown as HomeAssistant;

    const restored = await materializeImportedImages(hass, raw);
    expect(callWS.mock.calls[0][0].config.plans[0].background).toEqual({ width: 800, height: 600 });
    expect(restored.plans[0].background).toEqual({
      type: "image",
      width: 800,
      height: 600,
      ...upload,
    });
  });

  it.each([null, {}])("forwards an invalid plan to the metadata validator (%s)", async (plan) => {
    const raw = { version: 3, plans: [plan] };
    const callWS = vi.fn().mockRejectedValue(new Error("Invalid plan"));
    const hass = { callWS } as unknown as HomeAssistant;

    await expect(
      materializeImportedImages(hass, raw as unknown as FloorplanConfig)
    ).rejects.toThrow("Invalid plan");
    expect(callWS).toHaveBeenCalledWith({ type: "floorplan_ui/validate_config", config: raw });
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
