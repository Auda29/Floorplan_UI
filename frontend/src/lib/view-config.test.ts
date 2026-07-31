import { describe, expect, it } from "vitest";

import type { FloorplanConfig, View } from "../types/home-assistant";
import { createView, moveView, removeView, updateView } from "./view-config";

const views: View[] = [
  { id: "all", name: "All", filters: {} },
  { id: "rooms", name: "Rooms", filters: {} },
];

function config(): FloorplanConfig {
  return {
    version: 3,
    revision: 4,
    default_view: "rooms",
    plans: [],
    views,
  };
}

describe("view configuration helpers", () => {
  it("creates deterministic unique slugs", () => {
    expect(createView("Rooms", views).id).toBe("rooms-2");
  });

  it("updates and reorders without mutating the source", () => {
    const source = config();
    const renamed = updateView(source, "rooms", (view) => ({
      ...view,
      name: "Zones",
    }));
    const moved = moveView(renamed, "rooms", -1);

    expect(source.views[1].name).toBe("Rooms");
    expect(moved?.views.map((view) => view.id)).toEqual(["rooms", "all"]);
  });

  it("moves the default to a remaining view when deleting", () => {
    const result = removeView(config(), "rooms");

    expect(result?.nextViewId).toBe("all");
    expect(result?.config.default_view).toBe("all");
  });
});
