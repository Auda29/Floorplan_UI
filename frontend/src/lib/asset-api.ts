import type { FloorplanBackground, FloorplanConfig, HomeAssistant } from "../types/home-assistant";
import { validateFloorplanConfig } from "./config-api";

export const MAX_IMAGE_FILE_BYTES = 4_000_000;
// 20 plans × 4 MB images with base64 overhead, plus 20 MB of configuration.
export const MAX_PORTABLE_CONFIG_BYTES = 128_000_000;
const ASSET_API_PATH = "/api/floorplan_ui/assets";

interface AssetUploadResult {
  asset_id: string;
  content_type: "image/png" | "image/jpeg";
  url: string;
}

function cloneConfig(config: FloorplanConfig): FloorplanConfig {
  return structuredClone(config);
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("The image could not be read."));
    reader.readAsDataURL(blob);
  });
}

function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  return fetch(dataUrl).then((response) => {
    if (!response.ok) {
      throw new Error("An embedded image could not be decoded.");
    }
    return response.blob();
  });
}

export async function uploadFloorplanImage(
  hass: HomeAssistant,
  image: Blob
): Promise<AssetUploadResult> {
  if (!["image/png", "image/jpeg"].includes(image.type)) {
    throw new Error("Only PNG and JPEG floorplans are supported.");
  }
  if (image.size > MAX_IMAGE_FILE_BYTES) {
    throw new Error("The floorplan image must not exceed 4 MB.");
  }

  const response = await hass.fetchWithAuth(ASSET_API_PATH, {
    method: "POST",
    headers: { "Content-Type": image.type },
    body: image,
  });
  let result: unknown;
  try {
    result = await response.json();
  } catch {
    throw new Error("Image upload failed. The server returned an invalid response.");
  }
  if (!result || typeof result !== "object" || Array.isArray(result)) {
    throw new Error("Image upload failed. The server returned an invalid response.");
  }
  if (!response.ok) {
    throw new Error(
      "error" in result && typeof result.error === "string" && result.error
        ? result.error
        : "Image upload failed."
    );
  }
  if (
    !("asset_id" in result) ||
    typeof result.asset_id !== "string" ||
    !/^[0-9a-f]{64}$/.test(result.asset_id) ||
    !("content_type" in result) ||
    (result.content_type !== "image/png" && result.content_type !== "image/jpeg") ||
    !("url" in result) ||
    typeof result.url !== "string" ||
    !result.url
  ) {
    throw new Error("Image upload failed. The server returned an invalid response.");
  }
  return { asset_id: result.asset_id, content_type: result.content_type, url: result.url };
}

export async function fetchFloorplanImage(
  hass: HomeAssistant,
  background: FloorplanBackground
): Promise<Blob> {
  const response = background.asset_id
    ? await hass.fetchWithAuth(`${ASSET_API_PATH}/${encodeURIComponent(background.asset_id)}`)
    : await fetch(background.url ?? "");
  if (!response.ok) throw new Error("The floorplan image could not be loaded.");
  return response.blob();
}

export async function createPortableConfig(
  hass: HomeAssistant,
  config: FloorplanConfig
): Promise<FloorplanConfig> {
  const portable = cloneConfig(config);
  const images = new Map<string, string>();
  for (const plan of portable.plans) {
    const background = plan.background;
    if (!background.asset_id) {
      continue;
    }
    let dataUrl = images.get(background.asset_id);
    if (!dataUrl) {
      dataUrl = await blobToDataUrl(await fetchFloorplanImage(hass, background));
      images.set(background.asset_id, dataUrl);
    }
    background.url = dataUrl;
    delete background.asset_id;
    delete background.content_type;
  }
  return portable;
}

export async function materializeImportedImages(
  hass: HomeAssistant,
  config: FloorplanConfig
): Promise<FloorplanConfig> {
  // Validate metadata before any upload, without sending large base64 images
  // over the configuration WebSocket (which retains its 20 MB limit).
  const metadata = cloneConfig(config);
  const images = new Map<string, string>();
  for (const plan of Array.isArray(metadata.plans) ? metadata.plans : []) {
    const background = plan?.background;
    if (typeof background?.url === "string" && background.url.startsWith("data:")) {
      images.set(plan.plan_id, background.url);
      delete background.url;
      delete background.asset_id;
      delete background.content_type;
    }
  }
  const materialized = await validateFloorplanConfig(hass, metadata);
  const uploads = new Map<string, AssetUploadResult>();
  for (const plan of materialized.plans) {
    const background = plan.background as FloorplanBackground | undefined;
    const dataUrl = images.get(plan.plan_id);
    if (!background || !dataUrl) {
      continue;
    }
    let uploaded = uploads.get(dataUrl);
    if (!uploaded) {
      uploaded = await uploadFloorplanImage(hass, await dataUrlToBlob(dataUrl));
      uploads.set(dataUrl, uploaded);
    }
    plan.background = {
      type: "image",
      asset_id: uploaded.asset_id,
      content_type: uploaded.content_type,
      url: uploaded.url,
      width: background.width,
      height: background.height,
    };
  }
  return materialized;
}
