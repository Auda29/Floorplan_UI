import { describe, expect, it } from "vitest";
import {
  GLB_CONTENT_TYPE,
  MAX_MODEL_FILE_BYTES,
  isGlbFileName,
  validateGlbHeader,
} from "./glb-utils";

function makeGlb(json = '{"asset":{"version":"2.0"}}', binaryBytes = 0): ArrayBuffer {
  const bytes = new TextEncoder().encode(json);
  const paddedLength = Math.ceil(bytes.length / 4) * 4;
  const buffer = new ArrayBuffer(20 + paddedLength + (binaryBytes ? 8 + binaryBytes : 0));
  const header = new DataView(buffer);
  header.setUint32(0, 0x46546c67, true);
  header.setUint32(4, 2, true);
  header.setUint32(8, buffer.byteLength, true);
  header.setUint32(12, paddedLength, true);
  header.setUint32(16, 0x4e4f534a, true);
  const contents = new Uint8Array(buffer, 20, paddedLength);
  contents.fill(0x20);
  contents.set(bytes);
  if (binaryBytes) {
    header.setUint32(20 + paddedLength, binaryBytes, true);
    header.setUint32(24 + paddedLength, 0x004e4942, true);
  }
  return buffer;
}

describe("GLB uploads", () => {
  it("recognizes the .glb extension case insensitively", () => {
    expect(GLB_CONTENT_TYPE).toBe("model/gltf-binary");
    expect(isGlbFileName("layout.GLB")).toBe(true);
    expect(isGlbFileName("layout.glb.tmp")).toBe(false);
    expect(isGlbFileName("layout.gltf")).toBe(false);
  });

  it("accepts JSON-only GLBs and embedded binary or data URI resources", () => {
    expect(validateGlbHeader(makeGlb())).toEqual({ valid: true });
    const embedded = makeGlb(
      JSON.stringify({
        asset: { version: "2.0" },
        buffers: [{ byteLength: 4 }],
        images: [{ uri: "data:image/png;base64,AA==" }],
      }),
      4
    );
    expect(validateGlbHeader(embedded)).toEqual({ valid: true });
  });

  it.each([
    [0, 0x11223344],
    [4, 1],
    [8, 28],
    [12, 9_999_996],
    [16, 0x004e4942],
  ])("rejects a bad header field at byte %i", (offset, value) => {
    const glb = makeGlb();
    new DataView(glb).setUint32(offset, value, true);
    expect(validateGlbHeader(glb)).toMatchObject({ valid: false });
  });

  it("rejects a truncated binary chunk even if the declared file size matches", () => {
    const glb = makeGlb(undefined, 4).slice(0, -4);
    new DataView(glb).setUint32(8, glb.byteLength, true);
    expect(validateGlbHeader(glb)).toMatchObject({ valid: false });
  });

  it.each(['{"asset": syntax error}', '{"asset":{"version":"1.0"}}', '{"asset":{}}'])(
    "rejects invalid asset JSON: %s",
    (json) => expect(validateGlbHeader(makeGlb(json))).toMatchObject({ valid: false })
  );

  it.each([
    ["buffers", "buffer.bin"],
    ["images", "https://example.test/map.png"],
    ["images", "blob:https://example.test/id"],
  ])("rejects the external %s URI %s", (key, uri) => {
    const glb = makeGlb(JSON.stringify({ asset: { version: "2.0" }, [key]: [{ uri }] }));
    expect(validateGlbHeader(glb)).toMatchObject({ valid: false });
  });

  it("rejects uploads outside the supported size range", () => {
    expect(validateGlbHeader(new ArrayBuffer(27))).toMatchObject({ valid: false });
    expect(validateGlbHeader(new ArrayBuffer(MAX_MODEL_FILE_BYTES + 1))).toMatchObject({
      valid: false,
    });
  });
});
