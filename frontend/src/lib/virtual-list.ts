interface VirtualWindowOptions {
  totalCount: number;
  scrollTop: number;
  viewportHeight: number;
  itemHeight?: number;
  overscan?: number;
  minRenderedItems?: number;
}
function nonnegative(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}
export function clampScrollTop(
  scrollTop: number,
  totalHeightPx: number,
  viewportHeight: number
): number {
  return Math.min(
    nonnegative(scrollTop),
    Math.max(0, nonnegative(totalHeightPx) - nonnegative(viewportHeight))
  );
}
/** endIndex is exclusive, matching Array.slice. */
export function computeVirtualWindow({
  totalCount,
  scrollTop,
  viewportHeight,
  itemHeight = 52,
  overscan = 15,
  minRenderedItems = 35,
}: VirtualWindowOptions) {
  const count = Math.floor(nonnegative(totalCount));
  const height = nonnegative(itemHeight) || 52;
  const buffer = Math.floor(nonnegative(overscan));
  const totalHeightPx = count * height;
  const viewport = nonnegative(viewportHeight);
  const top = clampScrollTop(scrollTop, totalHeightPx, viewport);
  let startIndex = Math.max(0, Math.floor(top / height) - buffer);
  const endIndex = Math.min(
    count,
    Math.max(
      Math.ceil((top + viewport) / height) + buffer,
      startIndex + Math.floor(nonnegative(minRenderedItems))
    )
  );
  startIndex = Math.max(
    0,
    Math.min(startIndex, endIndex - Math.floor(nonnegative(minRenderedItems)))
  );
  return {
    startIndex,
    endIndex,
    topSpacerPx: startIndex * height,
    bottomSpacerPx: (count - endIndex) * height,
    totalHeightPx,
  };
}
