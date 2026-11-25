import Konva from "konva";
import type {
  AreaShape,
  HassArea,
  HassEntity,
  HassEntityRegistry,
  Marker,
  Plan,
  View,
} from "../types/home-assistant";
import type { AreaGeometryUpdate } from "./area-config";
import { areaHasActiveEntities } from "./area-aggregates";
import {
  getActiveBadges,
  getDomainGlyph,
  getMarkerColor,
  getMarkerLabel,
  getMarkerValue,
  markerMatchesView,
  resolveValueSpec,
} from "./marker-utils";
import { getMdiIconPath, resolveDynamicMdiPath, resolveMdiIconName } from "./mdi-icons";

interface AreaRenderOptions {
  layer: Konva.Layer;
  plan: Plan | null;
  view: View | undefined;
  states: Record<string, HassEntity>;
  areas: HassArea[];
  entities?: HassEntityRegistry[];
  editMode: boolean;
  selectedAreaId: string | null;
  shapes: Map<string, Konva.Shape>;
  onSelect(areaId: string): void;
  onUpdateShape(areaId: string, updates: AreaGeometryUpdate): void;
  onRerender(): void;
}

interface MarkerRenderOptions {
  layer: Konva.Layer;
  stage: Konva.Stage | null;
  plan: Plan | null;
  view: View | undefined;
  states: Record<string, HassEntity>;
  entities: HassEntityRegistry[];
  editMode: boolean;
  selectedMarkerId: string | null;
  groups: Map<string, Konva.Group>;
  onSelect(markerId: string): void;
  onActivate(marker: Marker): void;
  onMove(markerId: string, position: { x: number; y: number }): void;
}

interface InteractivityOptions {
  areasLayer: Konva.Layer | null;
  markersLayer: Konva.Layer | null;
  plan: Plan | null;
  editMode: boolean;
  selectedAreaId: string | null;
  selectedMarkerId: string | null;
  areaShapes: Map<string, Konva.Shape>;
  markerGroups: Map<string, Konva.Group>;
}

interface MarkerRefreshOptions {
  layer: Konva.Layer;
  plan: Plan;
  view: View | undefined;
  states: Record<string, HassEntity>;
  entities: HassEntityRegistry[];
  groups: Map<string, Konva.Group>;
}

export function renderAreas(options: AreaRenderOptions): void {
  const { layer, plan, shapes } = options;
  layer.destroyChildren();
  shapes.clear();
  if (!plan) return;
  const markers = plan.markers ?? [];

  for (const area of plan.areas ?? []) {
    if (!options.editMode && !areaMatchesView(area, options.view)) continue;

    const areaShape = createAreaShape(area, options, markers);
    if (!areaShape) continue;

    areaShape.on("click tap", (event) => {
      event.cancelBubble = true;
      if (options.editMode && !event.evt?.defaultPrevented) options.onSelect(area.id);
    });
    areaShape.on("dragend", () => {
      if (!options.editMode) return;
      const position = areaShape.position();
      options.onUpdateShape(area.id, { x: position.x, y: position.y });
      options.onRerender();
    });

    layer.add(areaShape);
    shapes.set(area.id, areaShape);
    addAreaAnnotation(area, areaShape, options, markers);
  }

  if (!options.editMode || !options.selectedAreaId) return;
  const selectedShape = shapes.get(options.selectedAreaId);
  const selectedArea = plan.areas?.find((area) => area.id === options.selectedAreaId);
  if (selectedArea?.shape.type === "polygon" && selectedShape instanceof Konva.Line) {
    addPolygonAnchors(layer, selectedArea, selectedShape, options);
  } else if (selectedArea?.shape.type === "rect" && selectedShape instanceof Konva.Rect) {
    addRectangleTransformer(layer, selectedArea.id, selectedShape, options);
  }
}

export function areaMatchesView(area: AreaShape, view: View | undefined): boolean {
  const areaFilter = view?.filters?.area_ids;
  if (areaFilter?.length && (!area.area_id || !areaFilter.includes(area.area_id))) {
    return false;
  }
  const tagFilter = view?.filters?.tags;
  return !tagFilter?.length || tagFilter.some((tag) => area.tags.includes(tag));
}

function createAreaShape(
  area: AreaShape,
  { editMode, view, states, entities = [] }: AreaRenderOptions,
  markers: Marker[]
): Konva.Shape | null {
  const { shape, style } = area;
  if (shape.type === "mesh" || shape.type === "anchor3d") return null;

  const appearance = {
    fill: style.fill ?? "#2196f3",
    stroke: style.stroke ?? "#1976d2",
    strokeWidth: style.strokeWidth ?? 2,
    opacity: style.fillOpacity ?? 0.4,
    draggable: editMode,
  };
  const viewStyle = view?.style;
  if (!editMode && (viewStyle?.highlight_active_areas || viewStyle?.dim_inactive_areas)) {
    const active =
      !!area.area_id &&
      areaHasActiveEntities(area.area_id, view?.filters?.domains, states, entities, markers);
    if (active && viewStyle.highlight_active_areas) {
      appearance.fill = viewStyle.active_area_fill ?? appearance.fill;
      appearance.stroke = viewStyle.active_area_stroke ?? appearance.stroke;
      appearance.opacity = viewStyle.active_area_opacity ?? appearance.opacity;
    } else if (!active && viewStyle.dim_inactive_areas) {
      appearance.opacity = viewStyle.inactive_area_opacity ?? 0.15;
    }
  }
  if (shape.type === "polygon" && (shape.points?.length ?? 0) >= 6) {
    return new Konva.Line({
      x: shape.x ?? 0,
      y: shape.y ?? 0,
      points: shape.points,
      closed: true,
      ...appearance,
    });
  }
  if (shape.type === "rect") {
    return new Konva.Rect({
      x: shape.x ?? 0,
      y: shape.y ?? 0,
      width: shape.width ?? 100,
      height: shape.height ?? 80,
      ...appearance,
    });
  }
  return null;
}

function addAreaAnnotation(
  area: AreaShape,
  areaShape: Konva.Shape,
  { layer, view, states, areas, entities = [] }: AreaRenderOptions,
  markers: Marker[]
): void {
  const lines: string[] = [];
  const areaName = areas.find((entry) => entry.id === area.area_id)?.name;
  if (area.area_id) lines.push(areaName ?? area.area_id);

  const valueOptions = { areaId: area.area_id, entities, markers };
  const primary = resolveValueSpec(view?.area_overlay?.primary, states, valueOptions);
  const secondary = resolveValueSpec(view?.area_overlay?.secondary, states, valueOptions);
  if (primary) lines.push(primary);
  if (secondary) lines.push(secondary);
  for (const badge of getActiveBadges(view?.area_overlay?.badges, states)) {
    lines.push(`${badge.icon ? `${badge.icon} ` : ""}${badge.label ?? badge.entity_id}`);
  }
  if (!lines.length) return;

  const bounds = areaShape.getClientRect({ relativeTo: layer });
  const label = new Konva.Label({
    x: bounds.x + 8,
    y: bounds.y + 8,
    listening: false,
  });
  label.add(
    new Konva.Tag({
      fill: "rgba(255,255,255,0.88)",
      cornerRadius: 4,
      shadowColor: "rgba(0,0,0,0.25)",
      shadowBlur: 3,
    }),
    new Konva.Text({
      text: lines.join("\n"),
      fontSize: 13,
      fontStyle: "bold",
      fill: "#0d47a1",
      padding: 5,
      lineHeight: 1.2,
    })
  );
  layer.add(label);
}

function addPolygonAnchors(
  layer: Konva.Layer,
  area: AreaShape,
  line: Konva.Line,
  options: AreaRenderOptions
): void {
  if (area.shape.type !== "polygon") return;
  const points = [...area.shape.points];
  const originX = area.shape.x ?? 0;
  const originY = area.shape.y ?? 0;

  for (let index = 0; index < points.length; index += 2) {
    const anchor = new Konva.Circle({
      x: originX + points[index],
      y: originY + points[index + 1],
      radius: 7,
      fill: "#ffffff",
      stroke: "#d32f2f",
      strokeWidth: 3,
      draggable: true,
    });
    anchor.on("dragmove", () => {
      points[index] = anchor.x() - originX;
      points[index + 1] = anchor.y() - originY;
      line.points(points);
      layer.batchDraw();
    });
    anchor.on("dragend", () => {
      options.onUpdateShape(area.id, { points: [...points] });
      options.onRerender();
    });
    layer.add(anchor);
  }
}

function addRectangleTransformer(
  layer: Konva.Layer,
  areaId: string,
  rectangle: Konva.Rect,
  options: AreaRenderOptions
): void {
  const minWidth = Math.min(20, rectangle.width());
  const minHeight = Math.min(20, rectangle.height());
  const transformer = new Konva.Transformer({
    nodes: [rectangle],
    rotateEnabled: false,
    keepRatio: false,
    flipEnabled: false,
    ignoreStroke: true,
    anchorSize: 9,
    boundBoxFunc: (oldBox, newBox) => {
      const scale = layer.getAbsoluteScale();
      return newBox.width < minWidth * scale.x || newBox.height < minHeight * scale.y
        ? oldBox
        : newBox;
    },
  });
  rectangle.on("transformend", () => {
    const width = Math.max(minWidth, rectangle.width() * rectangle.scaleX());
    const height = Math.max(minHeight, rectangle.height() * rectangle.scaleY());
    rectangle.scale({ x: 1, y: 1 });
    options.onUpdateShape(areaId, {
      x: rectangle.x(),
      y: rectangle.y(),
      width,
      height,
    });
    options.onRerender();
  });
  layer.add(transformer);
}

export function syncCanvasInteractivity(options: InteractivityOptions): void {
  const areas = new Map((options.plan?.areas ?? []).map((area) => [area.id, area] as const));
  for (const [id, areaShape] of options.areaShapes.entries()) {
    areaShape.draggable(options.editMode);
    const baseStrokeWidth = areas.get(id)?.style.strokeWidth ?? 2;
    areaShape.strokeWidth(baseStrokeWidth + (options.selectedAreaId === id ? 2 : 0));
  }

  for (const [id, markerGroup] of options.markerGroups.entries()) {
    markerGroup.draggable(options.editMode);
    const dot = markerGroup.findOne(".marker-dot") as Konva.Circle | undefined;
    dot?.strokeWidth(options.selectedMarkerId === id ? 4 : 2);
  }

  options.areasLayer?.batchDraw();
  options.markersLayer?.batchDraw();
}

export function renderMarkers(options: MarkerRenderOptions): void {
  const { layer, plan, groups } = options;
  layer.destroyChildren();
  groups.clear();
  options.stage?.off("scaleXChange.markerSize");
  if (!plan) return;
  const syncSize = () => {
    const scale = 1 / (options.stage?.scaleX() || 1);
    for (const group of groups.values()) group.scale({ x: scale, y: scale });
  };
  options.stage?.on("scaleXChange.markerSize", syncSize);

  const registryByEntity = new Map(options.entities.map((entity) => [entity.entity_id, entity]));
  for (const marker of plan.markers ?? []) {
    if (!options.editMode && !markerMatchesView(marker, options.view)) continue;

    const state = options.states[marker.entity_id];
    const registryEntry = registryByEntity.get(marker.entity_id);
    const group = createMarkerGroup(marker, state, registryEntry, options);

    group.on("click tap", (event) => {
      event.cancelBubble = true;
      if (event.evt?.defaultPrevented) return;
      if (options.editMode) {
        options.onSelect(marker.id);
      } else {
        options.onActivate(marker);
      }
    });
    group.on("dragend", () => {
      if (options.editMode) options.onMove(marker.id, group.position());
    });
    group.on("mouseenter", () => {
      if (options.stage) options.stage.container().style.cursor = "pointer";
    });
    group.on("mouseleave", () => {
      if (options.stage) options.stage.container().style.cursor = "default";
    });

    layer.add(group);
    groups.set(marker.id, group);
    updateMarkerIcon(layer, group, marker, state, registryEntry);
  }
  syncSize();
  layer.batchDraw();
}

function createMarkerGroup(
  marker: Marker,
  state: HassEntity | undefined,
  registryEntry: HassEntityRegistry | undefined,
  options: MarkerRenderOptions
): Konva.Group {
  const group = new Konva.Group({
    x: marker.pos.x,
    y: marker.pos.y,
    draggable: options.editMode,
  });
  group.add(
    new Konva.Circle({
      name: "marker-dot",
      radius: 16,
      fill: getMarkerColor(state),
      stroke: "#ffffff",
      strokeWidth: options.selectedMarkerId === marker.id ? 4 : 2,
      shadowColor: "#000000",
      shadowBlur: 5,
      shadowOpacity: 0.25,
    }),
    new Konva.Rect({
      name: "marker-plate",
      x: 17,
      y: -18,
      fill: "#202a30",
      cornerRadius: 5,
      stroke: "#fff",
      strokeWidth: 1,
      listening: false,
    }),
    new Konva.Text({
      name: "marker-label",
      x: 21,
      y: -17,
      text: marker.label_mode === "off" ? "" : getMarkerLabel(marker, state, registryEntry),
      fill: "#ffffff",
      fontSize: 13,
      fontStyle: "bold",
      padding: 2,
      listening: false,
    }),
    new Konva.Text({
      name: "marker-value",
      x: 21,
      y: 1,
      text: markerValues(
        marker,
        state,
        options.view,
        options.states,
        options.entities,
        options.plan?.markers ?? []
      ),
      fill: "#e0e8ed",
      fontSize: 12,
      padding: 2,
      listening: false,
    })
  );
  sizeMarkerPlate(group);
  return group;
}

const markerIconNames = new WeakMap<Konva.Group, string>();

function updateMarkerIcon(
  layer: Konva.Layer,
  group: Konva.Group,
  marker: Marker,
  state: HassEntity | undefined,
  registryEntry: HassEntityRegistry | undefined
): void {
  const iconName = resolveMdiIconName(marker.icon, state, registryEntry, marker.entity_id);
  if (markerIconNames.get(group) === iconName) return;
  markerIconNames.set(group, iconName);

  group.findOne(".marker-icon-path")?.destroy();
  group.findOne(".marker-icon-glyph")?.destroy();

  const addPath = (data: string) => {
    group.add(
      new Konva.Path({
        name: "marker-icon-path",
        x: -9,
        y: -9,
        scale: { x: 0.75, y: 0.75 },
        data,
        fill: "#ffffff",
        listening: false,
      })
    );
  };
  const bundledPath = getMdiIconPath(iconName);
  if (bundledPath) {
    addPath(bundledPath);
    return;
  }

  const fallback = new Konva.Text({
    name: "marker-icon-glyph",
    x: -10,
    y: -7,
    width: 20,
    align: "center",
    text: getDomainGlyph(marker.entity_id),
    fill: "#ffffff",
    fontSize: 14,
    fontStyle: "bold",
    listening: false,
  });
  group.add(fallback);
  void resolveDynamicMdiPath(iconName).then((path) => {
    if (!path || group.getLayer() !== layer || fallback.getParent() !== group) return;
    fallback.destroy();
    addPath(path);
    layer.batchDraw();
  });
}

function sizeMarkerPlate(group: Konva.Group) {
  const plate = group.findOne<Konva.Rect>(".marker-plate")!;
  const label = group.findOne<Konva.Text>(".marker-label")!;
  const value = group.findOne<Konva.Text>(".marker-value")!;
  const hasLabel = Boolean(label.text());
  const top = hasLabel ? -18 : -value.height() / 2 - 2;
  plate.y(top);
  value.y(hasLabel ? 0 : top + 2);
  plate.size({
    width: Math.max(hasLabel ? label.width() : 0, value.width()) + 8,
    height: value.y() - top + value.height() + 3,
  });
}

export function refreshMarkerLiveValues(options: MarkerRefreshOptions): void {
  const registryByEntity = new Map(options.entities.map((entity) => [entity.entity_id, entity]));
  for (const marker of options.plan.markers ?? []) {
    const group = options.groups.get(marker.id);
    if (!group) continue;

    const state = options.states[marker.entity_id];
    const registryEntry = registryByEntity.get(marker.entity_id);
    const dot = group.findOne(".marker-dot") as Konva.Circle | undefined;
    const value = group.findOne(".marker-value") as Konva.Text | undefined;
    const label = group.findOne(".marker-label") as Konva.Text | undefined;
    dot?.fill(getMarkerColor(state));
    value?.text(
      markerValues(
        marker,
        state,
        options.view,
        options.states,
        options.entities,
        options.plan.markers ?? []
      )
    );
    label?.text(marker.label_mode === "off" ? "" : getMarkerLabel(marker, state, registryEntry));
    updateMarkerIcon(options.layer, group, marker, state, registryEntry);
    sizeMarkerPlate(group);
  }
  options.layer.batchDraw();
}

function markerValues(
  marker: Marker,
  state: HassEntity | undefined,
  view: View | undefined,
  states: Record<string, HassEntity>,
  entities: HassEntityRegistry[],
  markers: Marker[]
): string {
  const overlay = view?.marker_overlay;
  const registryEntry = entities.find((entry) => entry.entity_id === marker.entity_id);
  const aggregateContext = {
    areaId: marker.area_id ?? registryEntry?.area_id ?? null,
    entities,
    markers,
  };
  const values = [
    overlay?.primary
      ? resolveValueSpec(overlay.primary, states, aggregateContext)
      : getMarkerValue(marker, state),
    overlay?.secondary
      ? resolveValueSpec(overlay.secondary, states, aggregateContext)
      : getMarkerValue(marker, state, "secondary"),
  ]
    .filter(Boolean)
    .join(" · ");
  const badges = getActiveBadges(overlay?.badges, states).map(
    (badge) => `${badge.icon ? `${badge.icon} ` : ""}${badge.label ?? badge.entity_id}`
  );
  return [values, ...badges].filter(Boolean).join("\n");
}

export function drawImageErrorState(
  layer: Konva.Layer,
  stageWidth: number,
  stageHeight: number
): void {
  layer.add(
    new Konva.Rect({
      x: 0,
      y: 0,
      width: stageWidth,
      height: stageHeight,
      fill: "#fff3e0",
    })
  );

  const title = new Konva.Text({
    x: stageWidth / 2,
    y: stageHeight / 2 - 10,
    text: "Failed to load floorplan image",
    fontSize: 18,
    fontStyle: "bold",
    fill: "#e65100",
  });
  title.offsetX(title.width() / 2);
  layer.add(title);

  const subtitle = new Konva.Text({
    x: stageWidth / 2,
    y: stageHeight / 2 + 20,
    text: "Try re-uploading the image in Edit mode.",
    fontSize: 14,
    fill: "#e65100",
  });
  subtitle.offsetX(subtitle.width() / 2);
  layer.add(subtitle);
}
