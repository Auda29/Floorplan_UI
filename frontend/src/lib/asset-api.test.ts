import { describe, expect, it } from "vitest";

import type { HomeAssistant } from "../types/home-assistant";
import { uploadFloorplanImage } from "./asset-api";

describe("asset API", () => {
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
