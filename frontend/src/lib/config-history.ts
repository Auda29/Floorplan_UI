import type { FloorplanConfig } from "../types/home-assistant";

export class ConfigHistory {
  private _undo: FloorplanConfig[] = [];
  private _redo: FloorplanConfig[] = [];

  public constructor(private readonly _limit = 50) {}

  public get canUndo(): boolean {
    return this._undo.length > 0;
  }

  public get canRedo(): boolean {
    return this._redo.length > 0;
  }

  public reset(): void {
    this._undo = [];
    this._redo = [];
  }

  public record(config: FloorplanConfig): void {
    this._undo = [...this._undo.slice(-(this._limit - 1)), structuredClone(config)];
    this._redo = [];
  }

  public undo(current: FloorplanConfig): FloorplanConfig | null {
    const previous = this._undo.at(-1);
    if (!previous) return null;
    this._undo = this._undo.slice(0, -1);
    this._redo = [...this._redo.slice(-(this._limit - 1)), structuredClone(current)];
    return structuredClone(previous);
  }

  public redo(current: FloorplanConfig): FloorplanConfig | null {
    const next = this._redo.at(-1);
    if (!next) return null;
    this._redo = this._redo.slice(0, -1);
    this._undo = [...this._undo.slice(-(this._limit - 1)), structuredClone(current)];
    return structuredClone(next);
  }
}
