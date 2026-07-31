import type { FloorplanBackground, FloorplanConfig, HomeAssistant } from "../types/home-assistant";

export const MAX_IMAGE_FILE_BYTES = 4_000_000;
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
  const result = (await response.json()) as AssetUploadResult | { error?: string };
  if (!response.ok || !("asset_id" in result)) {
    throw new Error("error" in result && result.error ? result.error : "Image upload failed.");
  }
  return result;
}

export async function createPortableConfig(config: FloorplanConfig): Promise<FloorplanConfig> {
  const portable = cloneConfig(config);
  for (const plan of portable.plans) {
    const background = plan.background;
    if (!background.asset_id || !background.url) {
      continue;
    }
    const response = await fetch(background.url);
    if (!response.ok) {
      throw new Error(`The image for "${plan.name}" could not be exported.`);
    }
    const image = await response.blob();
    background.url = await blobToDataUrl(image);
    delete background.asset_id;
    delete background.content_type;
  }
  return portable;
}

export async function materializeImportedImages(
  hass: HomeAssistant,
  config: FloorplanConfig
): Promise<FloorplanConfig> {
  const materialized = cloneConfig(config);
  for (const plan of materialized.plans ?? []) {
    const background = plan.background as FloorplanBackground | undefined;
    if (!background?.url?.startsWith("data:")) {
      continue;
    }
    const uploaded = await uploadFloorplanImage(hass, await dataUrlToBlob(background.url));
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
