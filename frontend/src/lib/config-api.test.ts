import { describe, expect, it } from "vitest";

import type { FloorplanConfig, HassWSMessage, HomeAssistant } from "../types/home-assistant";
import { saveFloorplanConfig } from "./config-api";

function config(): FloorplanConfig {
  return {
    version: 3,
    revision: 7,
    default_view: "all",
    plans: [
      {
        plan_id: "plan",
        name: "Plan",
        background: {
          type: "image",
          asset_id: "a".repeat(64),
          content_type: "image/png",
          url: "/api/floorplan_ui/assets/signed",
          width: 800,
          height: 600,
        },
        areas: [],
        markers: [],
        view: { minZoom: 0.1, maxZoom: 5 },
      },
    ],
    views: [{ id: "all", name: "All", filters: {} }],
  };
}

describe("configuration API", () => {
  it("sends a base revision without persisting transient signed URLs", async () => {
    const messages: HassWSMessage[] = [];
    const hass = {
      callWS: async (message: HassWSMessage) => {
        messages.push(message);
        return { success: true, revision: 8 };
      },
    } as unknown as HomeAssistant;
    const source = config();

    await expect(saveFloorplanConfig(hass, source, 7)).resolves.toBe(8);

    expect(messages[0].base_revision).toBe(7);
    const sent = messages[0].config as FloorplanConfig;
    expect(sent.plans[0].background.url).toBeUndefined();
    expect(source.plans[0].background.url).toContain("/signed");
  });
});
