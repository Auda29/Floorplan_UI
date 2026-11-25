export const MAX_MODEL_FILE_BYTES = 25_000_000;
export const GLB_CONTENT_TYPE = "model/gltf-binary";

const GLB_MAGIC = 0x46546c67;
const JSON_CHUNK = 0x4e4f534a;
const HEADER_BYTES = 12;
const CHUNK_HEADER_BYTES = 8;
// Keep in sync with _GLB_SUPPORTED_REQUIRED_EXTENSIONS in asset_store.py.
const SUPPORTED_REQUIRED_EXTENSIONS = new Set([
  "EXT_materials_bump",
  "EXT_mesh_gpu_instancing",
  "EXT_texture_webp",
  "KHR_lights_punctual",
  "KHR_materials_anisotropy",
  "KHR_materials_clearcoat",
  "KHR_materials_diffuse_roughness",
  "KHR_materials_dispersion",
  "KHR_materials_emissive_strength",
  "KHR_materials_ior",
  "KHR_materials_iridescence",
  "KHR_materials_sheen",
  "KHR_materials_specular",
  "KHR_materials_transmission",
  "KHR_materials_unlit",
  "KHR_materials_volume",
  "KHR_mesh_quantization",
  "KHR_texture_transform",
]);

export function isGlbFileName(name: string): boolean {
  return /\.(glb)$/i.test(name);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validateGlbHeader(
  buffer: ArrayBuffer
): { valid: true } | { valid: false; reason: string } {
  const { byteLength } = buffer;
  if (byteLength < 28) return { valid: false, reason: "The GLB file is too short." };
  if (byteLength > MAX_MODEL_FILE_BYTES) {
    return { valid: false, reason: "The GLB file exceeds 25 MB." };
  }

  const header = new DataView(buffer);
  if (header.getUint32(0, true) !== GLB_MAGIC) {
    return { valid: false, reason: "The GLB signature is missing." };
  }
  if (header.getUint32(4, true) !== 2) {
    return { valid: false, reason: "Only GLB version 2 is supported." };
  }
  if (header.getUint32(8, true) !== byteLength) {
    return { valid: false, reason: "The GLB length does not match its header." };
  }
  if (header.getUint32(16, true) !== JSON_CHUNK) {
    return { valid: false, reason: "The first GLB chunk must contain JSON." };
  }

  for (let offset = HEADER_BYTES; offset < byteLength; ) {
    if (offset + CHUNK_HEADER_BYTES > byteLength) {
      return { valid: false, reason: "A GLB chunk header is truncated." };
    }
    const chunkLength = header.getUint32(offset, true);
    offset += CHUNK_HEADER_BYTES + chunkLength;
    if (offset > byteLength || chunkLength % 4 !== 0) {
      return { valid: false, reason: "A GLB chunk is truncated or misaligned." };
    }
  }

  let json: unknown;
  try {
    const bytes = new Uint8Array(
      buffer,
      HEADER_BYTES + CHUNK_HEADER_BYTES,
      header.getUint32(12, true)
    );
    json = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    return { valid: false, reason: "The GLB JSON chunk is invalid." };
  }

  if (
    !isObject(json) ||
    !isObject(json.asset) ||
    typeof json.asset.version !== "string" ||
    !json.asset.version.startsWith("2.")
  ) {
    return { valid: false, reason: "The GLB must contain a glTF 2.x asset." };
  }

  for (const key of ["buffers", "images"]) {
    const resources = json[key];
    if (resources === undefined) continue;
    if (!Array.isArray(resources) || resources.some((resource) => !isObject(resource))) {
      return { valid: false, reason: `The GLB ${key} list is invalid.` };
    }
    if (key === "buffers" && resources.some((resource) => "uri" in resource)) {
      return { valid: false, reason: "GLB buffers must use the BIN chunk without a URI." };
    }
    if (
      key === "images" &&
      resources.some(
        ({ uri }) => uri !== undefined && (typeof uri !== "string" || !/^data:/i.test(uri))
      )
    ) {
      return { valid: false, reason: "The GLB must embed its images." };
    }
  }

  const extensions = json.extensionsRequired;
  if (extensions !== undefined) {
    if (!Array.isArray(extensions) || !extensions.every((ext) => typeof ext === "string")) {
      return { valid: false, reason: "GLB extensionsRequired must be a list of strings." };
    }
    const unsupported = extensions.filter((ext) => !SUPPORTED_REQUIRED_EXTENSIONS.has(ext));
    if (unsupported.length) {
      return {
        valid: false,
        reason: `GLB requires unsupported extension(s): ${unsupported.join(", ")}`,
      };
    }
  }

  return { valid: true };
}
