import { describe, expect, it } from "vitest";
import { computeVirtualWindow, clampScrollTop } from "./virtual-list";
const windowAt = (totalCount: number, scrollTop: number) =>
  computeVirtualWindow({ totalCount, scrollTop, viewportHeight: 520 });
describe("virtual row window", () => {
  it("renders empty, small and initial palettes", () => {
    for (const count of [0, 1, 30, 35, 5000]) {
      expect(windowAt(count, 0)).toEqual({
        startIndex: 0,
        endIndex: Math.min(count, 35),
        totalHeightPx: count * 52,
        topSpacerPx: 0,
        bottomSpacerPx: Math.max(0, count - 35) * 52,
      });
    }
  });
  it("keeps the visible middle and bottom rows mounted with accurate spacers", () => {
    const mid = windowAt(5000, 2500 * 52 + 1);
    expect(mid.startIndex).toBe(2485);
    expect(mid.endIndex).toBe(2526);
    expect(mid.topSpacerPx + 41 * 52 + mid.bottomSpacerPx).toBe(mid.totalHeightPx);
    expect(windowAt(5000, 1e8)).toMatchObject({
      startIndex: 4965,
      endIndex: 5000,
      bottomSpacerPx: 0,
    });
    expect(windowAt(8, 2500 * 52)).toEqual(windowAt(8, 0));
  });
  it("clamps bounds and supports fractional heights and no overscan", () => {
    expect(clampScrollTop(-1, 50, 15)).toBe(0);
    expect(clampScrollTop(70, 50, 15)).toBe(35);
    expect(
      computeVirtualWindow({
        totalCount: 45,
        scrollTop: 2,
        viewportHeight: 10,
        itemHeight: 2.5,
        overscan: 0,
        minRenderedItems: 0,
      })
    ).toMatchObject({ startIndex: 0, endIndex: 5 });
  });
});
