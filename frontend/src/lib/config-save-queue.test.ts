import { describe, expect, it } from "vitest";

import type { FloorplanConfig } from "../types/home-assistant";
import { ConfigSaveQueue, type SaveStatus } from "./config-save-queue";

function config(name: string): FloorplanConfig {
  return {
    version: 3,
    revision: 0,
    default_view: "all",
    plans: [
      {
        plan_id: "plan",
        name,
        background: {
          type: "image",
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

describe("ConfigSaveQueue", () => {
  it.each([false, true])(
    "ignores stale save completion after reset (failure: %s)",
    async (fails) => {
      let finish!: () => void;
      const gate = new Promise<void>((resolve) => {
        finish = resolve;
      });
      const bases: number[] = [];
      const saved: number[] = [];
      const statuses: SaveStatus[] = [];
      const queue = new ConfigSaveQueue(
        async (_config, revision) => {
          bases.push(revision);
          if (bases.length === 1) {
            await gate;
            if (fails) throw new Error("stale failure");
          }
          return revision + 1;
        },
        { onSaved: (revision) => saved.push(revision), onStatus: (status) => statuses.push(status) }
      );
      const old = queue.enqueue(config("old"));
      const discarded = queue.enqueue(config("discarded"));
      queue.reset(10);
      const current = queue.enqueue(config("current"));
      finish();
      expect(await Promise.all([old, discarded, current])).toEqual([false, false, true]);
      expect(bases).toEqual([0, 10]);
      expect(saved).toEqual([11]);
      expect(statuses.some((status) => status.state === "failed")).toBe(false);
      expect(statuses.at(-1)).toEqual({ state: "idle", dirty: false });
    }
  );

  it("never overlaps saves and coalesces the newest pending snapshot", async () => {
    let active = 0;
    let maximumActive = 0;
    const savedNames: string[] = [];
    const revisions: number[] = [];
    const statuses: SaveStatus[] = [];
    const queue = new ConfigSaveQueue(
      async (candidate, baseRevision) => {
        active += 1;
        maximumActive = Math.max(maximumActive, active);
        savedNames.push(candidate.plans[0].name);
        await new Promise((resolve) => setTimeout(resolve, 5));
        active -= 1;
        return baseRevision + 1;
      },
      {
        onStatus: (status) => statuses.push(status),
        onSaved: (revision) => revisions.push(revision),
      }
    );

    const first = queue.enqueue(config("first"));
    const second = queue.enqueue(config("second"));
    const third = queue.enqueue(config("latest"));

    await expect(Promise.all([first, second, third])).resolves.toEqual([true, true, true]);
    expect(maximumActive).toBe(1);
    expect(savedNames).toEqual(["first", "latest"]);
    expect(revisions).toEqual([1, 2]);
    expect(statuses.at(-1)).toEqual({ state: "idle", dirty: false });
  });

  it("keeps a failed snapshot available for an explicit retry", async () => {
    let attempts = 0;
    const statuses: SaveStatus[] = [];
    const queue = new ConfigSaveQueue(
      async (_candidate, baseRevision) => {
        attempts += 1;
        if (attempts === 1) throw new Error("offline");
        return baseRevision + 1;
      },
      {
        onStatus: (status) => statuses.push(status),
        onSaved: () => undefined,
      }
    );

    await expect(queue.enqueue(config("retry me"))).resolves.toBe(false);
    expect(statuses.at(-1)?.state).toBe("failed");
    expect(statuses.at(-1)?.dirty).toBe(true);

    await expect(queue.retry()).resolves.toBe(true);
    expect(attempts).toBe(2);
    expect(statuses.at(-1)).toEqual({ state: "idle", dirty: false });
  });
});
