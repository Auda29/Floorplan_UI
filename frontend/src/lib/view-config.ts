import type { FloorplanConfig, View } from "../types/home-assistant";

export function createView(name: string, existingViews: View[]): View {
  const baseId =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "view";
  let id = baseId;
  let suffix = 2;
  while (existingViews.some((view) => view.id === id)) {
    id = `${baseId}-${suffix++}`;
  }
  return { id, name, filters: {} };
}

export function updateView(
  config: FloorplanConfig,
  viewId: string,
  update: (view: View) => View
): FloorplanConfig {
  return {
    ...config,
    views: config.views.map((view) => (view.id === viewId ? update(view) : view)),
  };
}

export function moveView(
  config: FloorplanConfig,
  viewId: string,
  direction: -1 | 1
): FloorplanConfig | null {
  const index = config.views.findIndex((view) => view.id === viewId);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= config.views.length) {
    return null;
  }
  const views = [...config.views];
  [views[index], views[target]] = [views[target], views[index]];
  return { ...config, views };
}

export function removeView(
  config: FloorplanConfig,
  viewId: string
): { config: FloorplanConfig; nextViewId: string } | null {
  const views = config.views.filter((view) => view.id !== viewId);
  if (views.length === config.views.length || views.length === 0) {
    return null;
  }
  const nextViewId = views.find((view) => view.id === "all")?.id ?? views[0].id;
  return {
    nextViewId,
    config: {
      ...config,
      default_view: config.default_view === viewId ? nextViewId : config.default_view,
      views,
    },
  };
}
