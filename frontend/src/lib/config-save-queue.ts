import type { FloorplanConfig } from "../types/home-assistant";

export type SaveState = "idle" | "pending" | "saving" | "failed";

export interface SaveStatus {
  state: SaveState;
  dirty: boolean;
  error?: unknown;
}

interface PendingSave {
  config: FloorplanConfig;
  waiters: Array<(saved: boolean) => void>;
}

interface SaveQueueCallbacks {
  onStatus(status: SaveStatus): void;
  onSaved(revision: number): void;
}

type SaveOperation = (config: FloorplanConfig, baseRevision: number) => Promise<number>;

export class ConfigSaveQueue {
  private _revision = 0;
  private _pending: PendingSave | null = null;
  private _failed: FloorplanConfig | null = null;
  private _running = false;
  private _generation = 0;

  public constructor(
    private readonly _save: SaveOperation,
    private readonly _callbacks: SaveQueueCallbacks
  ) {}

  public reset(revision: number): void {
    this._generation += 1;
    for (const resolve of this._pending?.waiters ?? []) {
      resolve(false);
    }
    this._revision = revision;
    this._pending = null;
    this._failed = null;
    this._callbacks.onStatus({ state: "idle", dirty: false });
  }

  public enqueue(config: FloorplanConfig): Promise<boolean> {
    const snapshot = structuredClone(config);
    this._failed = null;
    const result = new Promise<boolean>((resolve) => {
      if (this._pending) {
        this._pending.config = snapshot;
        this._pending.waiters.push(resolve);
      } else {
        this._pending = { config: snapshot, waiters: [resolve] };
      }
    });
    this._callbacks.onStatus({ state: "pending", dirty: true });
    void this._drain();
    return result;
  }

  public retry(): Promise<boolean> {
    if (!this._failed) {
      return Promise.resolve(true);
    }
    return this.enqueue(this._failed);
  }

  private async _drain(): Promise<void> {
    if (this._running) {
      return;
    }
    this._running = true;
    try {
      while (this._pending) {
        const generation = this._generation;
        const pending = this._pending;
        this._pending = null;
        this._callbacks.onStatus({ state: "saving", dirty: true });
        try {
          const revision = await this._save(pending.config, this._revision);
          if (generation !== this._generation) {
            for (const resolve of pending.waiters) resolve(false);
            continue;
          }
          this._revision = revision;
          this._callbacks.onSaved(this._revision);
          for (const resolve of pending.waiters) {
            resolve(true);
          }
        } catch (error) {
          if (generation !== this._generation) {
            for (const resolve of pending.waiters) resolve(false);
            continue;
          }
          const queuedAfterFailure = this._pending as PendingSave | null;
          this._failed = queuedAfterFailure?.config ?? pending.config;
          const unresolved = queuedAfterFailure?.waiters ?? [];
          this._pending = null;
          for (const resolve of [...pending.waiters, ...unresolved]) {
            resolve(false);
          }
          this._callbacks.onStatus({ state: "failed", dirty: true, error });
          return;
        }
      }
      this._callbacks.onStatus({ state: "idle", dirty: false });
    } finally {
      this._running = false;
    }
  }
}
