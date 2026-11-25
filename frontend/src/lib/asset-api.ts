import type {
  FloorplanBackground,
  FloorplanConfig,
  HomeAssistant,
  ModelBackground,
} from "../types/home-assistant";
import { validateFloorplanConfig } from "./config-api";
import { GLB_CONTENT_TYPE, MAX_MODEL_FILE_BYTES, validateGlbHeader } from "./glb-utils";

export const MAX_IMAGE_FILE_BYTES = 4_000_000;
export { MAX_MODEL_FILE_BYTES };
// 20 plans × 4 MB images with base64 overhead, plus 20 MB of configuration.
export const MAX_PORTABLE_CONFIG_BYTES = 128_000_000;
export const SUPPORTED_IMAGE_CONTENT_TYPES = ["image/png", "image/jpeg", "image/svg+xml"] as const;
const ASSET_API_PATH = "/api/floorplan_ui/assets";

type ImageContentType = (typeof SUPPORTED_IMAGE_CONTENT_TYPES)[number];

interface AssetUploadResult<ContentType extends string = ImageContentType> {
  asset_id: string;
  content_type: ContentType;
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

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl);
  if (!response.ok) throw new Error("An embedded image could not be decoded.");
  const blob = await response.blob();
  const [contentType] = blob.type.split(";", 1);
  return blob.type === contentType ? blob : blob.slice(0, blob.size, contentType);
}

function getImageContentType(image: Blob): string {
  if (
    !image.type &&
    "name" in image &&
    typeof image.name === "string" &&
    /\.svg$/i.test(image.name)
  ) {
    return "image/svg+xml";
  }
  return image.type;
}

export async function uploadFloorplanImage(
  hass: HomeAssistant,
  image: Blob
): Promise<AssetUploadResult> {
  const mime = getImageContentType(image);
  const contentType = SUPPORTED_IMAGE_CONTENT_TYPES.find((type) => type === mime);
  if (!contentType) {
    throw new Error("Only PNG, JPEG and SVG floorplans are supported.");
  }
  if (image.size > MAX_IMAGE_FILE_BYTES) {
    throw new Error("The floorplan image must not exceed 4 MB.");
  }

  return uploadAsset(hass, image, contentType, SUPPORTED_IMAGE_CONTENT_TYPES);
}

export async function uploadFloorplanModel(
  hass: HomeAssistant,
  file: Blob
): Promise<AssetUploadResult<typeof GLB_CONTENT_TYPE>> {
  if (file.size > MAX_MODEL_FILE_BYTES) {
    throw new Error("The GLB file exceeds 25 MB.");
  }
  const validation = validateGlbHeader(await file.arrayBuffer());
  if (!validation.valid) throw new Error(validation.reason);
  return uploadAsset(hass, file, GLB_CONTENT_TYPE, [GLB_CONTENT_TYPE]);
}

async function uploadAsset<ContentType extends string>(
  hass: HomeAssistant,
  asset: Blob,
  contentType: ContentType,
  supportedTypes: readonly ContentType[]
): Promise<AssetUploadResult<ContentType>> {
  const errorMessage =
    contentType === GLB_CONTENT_TYPE ? "Model upload failed." : "Image upload failed.";
  const invalidResponse = errorMessage + " The server returned an invalid response.";
  const response = await hass.fetchWithAuth(ASSET_API_PATH, {
    method: "POST",
    headers: { "Content-Type": contentType },
    body: asset,
  });
  let result: unknown;
  try {
    result = await response.json();
  } catch {
    throw new Error(invalidResponse);
  }
  if (!result || typeof result !== "object" || Array.isArray(result)) {
    throw new Error(invalidResponse);
  }
  if (!response.ok) {
    throw new Error(
      "error" in result && typeof result.error === "string" && result.error
        ? result.error
        : errorMessage
    );
  }
  const responseType = "content_type" in result ? result.content_type : undefined;
  const validatedType = supportedTypes.find((type) => type === responseType);
  if (
    !("asset_id" in result) ||
    typeof result.asset_id !== "string" ||
    !/^[0-9a-f]{64}$/.test(result.asset_id) ||
    !validatedType ||
    !("url" in result) ||
    typeof result.url !== "string" ||
    !result.url.trim()
  ) {
    throw new Error(invalidResponse);
  }
  return { asset_id: result.asset_id, content_type: validatedType, url: result.url };
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

export async function fetchFloorplanModel(
  hass: HomeAssistant,
  background: ModelBackground
): Promise<ArrayBuffer> {
  const response = background.asset_id
    ? await hass.fetchWithAuth(`${ASSET_API_PATH}/${encodeURIComponent(background.asset_id)}`)
    : background.url
      ? await fetch(background.url)
      : undefined;
  if (!response?.ok) throw new Error("The floorplan model could not be loaded.");
  return response.arrayBuffer();
}

function svgPixelLength(attribute: string | null): number {
  const match = attribute?.trim().match(/^([+-]?(?:\d*\.\d+|\d+\.?\d*)(?:e[+-]?\d+)?)(?:px)?$/i);
  return match ? Number(match[1]) : NaN;
}

const MAX_SVG_BACKGROUND_DIMENSION = 50_000;
const CLAMPED_SVG_MAX_DIMENSION = 4_000;

function normalizeSvgDimensions(width: number, height: number): { width: number; height: number } {
  const largest = Math.max(width, height);
  if (largest <= MAX_SVG_BACKGROUND_DIMENSION) return { width, height };
  const scale = CLAMPED_SVG_MAX_DIMENSION / largest;
  return {
    width: Math.max(1, Number((width * scale).toFixed(2))),
    height: Math.max(1, Number((height * scale).toFixed(2))),
  };
}

export async function readImageDimensions(file: Blob): Promise<{ width: number; height: number }> {
  if (getImageContentType(file) !== "image/svg+xml") {
    const bitmap = await createImageBitmap(file);
    try {
      return { width: bitmap.width, height: bitmap.height };
    } finally {
      bitmap.close();
    }
  }

  const root = new DOMParser().parseFromString(await file.text(), "image/svg+xml").documentElement;
  if (root.localName === "svg") {
    const viewBox = root
      .getAttribute("viewBox")
      ?.trim()
      .split(/[\s,]+/)
      .map(Number);
    if (
      viewBox?.length === 4 &&
      viewBox.every(Number.isFinite) &&
      viewBox[2] > 0 &&
      viewBox[3] > 0
    ) {
      return normalizeSvgDimensions(viewBox[2], viewBox[3]);
    }
    const width = svgPixelLength(root.getAttribute("width"));
    const height = svgPixelLength(root.getAttribute("height"));
    if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
      return normalizeSvgDimensions(width, height);
    }
  }
  return { width: 1000, height: 800 };
}

export async function createPortableConfig(
  hass: HomeAssistant,
  config: FloorplanConfig
): Promise<FloorplanConfig> {
  const portable = cloneConfig(config);
  const images = new Map<string, string>();
  for (const plan of portable.plans) {
    const background = plan.background;
    if (background.type === "model") {
      delete background.url;
      continue;
    }
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
    // Older backups can omit the image type before the server migrates them.
    if (
      background?.type !== "model" &&
      typeof background?.url === "string" &&
      background.url.startsWith("data:")
    ) {
      images.set(plan.plan_id, background.url);
      delete background.url;
      delete background.asset_id;
      delete background.content_type;
    }
  }
  const materialized = await validateFloorplanConfig(hass, metadata);
  const uploads = new Map<string, AssetUploadResult>();
  for (const plan of materialized.plans) {
    const background = plan.background;
    const dataUrl = images.get(plan.plan_id);
    if (background.type !== "image" || !dataUrl) {
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
