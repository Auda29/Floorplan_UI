import { describe, expect, it } from "vitest";

import type { FloorplanConfig } from "../types/home-assistant";
import { ConfigHistory } from "./config-history";

function config(revision: number): FloorplanConfig {
  return {
    version: 3,
    revision,
    plans: [],
    views: [{ id: "all", name: `Revision ${revision}`, filters: {} }],
  };
}

describe("ConfigHistory", () => {
  it("supports undo and redo with independent snapshots", () => {
    const history = new ConfigHistory();
    const first = config(1);
    history.record(first);
    first.views[0].name = "mutated outside history";

    const previous = history.undo(config(2));
    expect(previous?.views[0].name).toBe("Revision 1");
    expect(history.canRedo).toBe(true);

    const next = history.redo(previous!);
    expect(next?.revision).toBe(2);
  });

  it("clears redo history after a new edit", () => {
    const history = new ConfigHistory();
    history.record(config(1));
    history.undo(config(2));
    history.record(config(3));

    expect(history.canRedo).toBe(false);
  });
});
