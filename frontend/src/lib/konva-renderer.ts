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
import {
  getActiveBadges,
  getDomainGlyph,
  getMarkerColor,
  getMarkerLabel,
  getMarkerValue,
  markerMatchesView,
  resolveValueSpec,
} from "./marker-utils";

interface AreaRenderOptions {
  layer: Konva.Layer;
  plan: Plan | null;
  view: View | undefined;
  states: Record<string, HassEntity>;
  areas: HassArea[];
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
  onOpenMoreInfo(entityId: string): void;
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
  states: Record<string, HassEntity>;
  entities: HassEntityRegistry[];
  groups: Map<string, Konva.Group>;
}

export function renderAreas(options: AreaRenderOptions): void {
  const { layer, plan, shapes } = options;
  layer.destroyChildren();
  shapes.clear();
  if (!plan) return;

  for (const area of plan.areas ?? []) {
    if (!areaMatchesView(area, options.view)) continue;

    const areaShape = createAreaShape(area, options.editMode);
    if (!areaShape) continue;

    areaShape.on("click", (event) => {
      event.cancelBubble = true;
      if (options.editMode) options.onSelect(area.id);
    });
    areaShape.on("dragend", () => {
      if (!options.editMode) return;
      const position = areaShape.position();
      options.onUpdateShape(area.id, { x: position.x, y: position.y });
      options.onRerender();
    });

    layer.add(areaShape);
    shapes.set(area.id, areaShape);
    addAreaAnnotation(layer, area, areaShape, options.view, options.states, options.areas);

    if (options.editMode && options.selectedAreaId === area.id) {
      if (area.shape.type === "polygon" && areaShape instanceof Konva.Line) {
        addPolygonAnchors(layer, area, areaShape, options);
      } else if (area.shape.type === "rect" && areaShape instanceof Konva.Rect) {
        addRectangleTransformer(layer, area.id, areaShape, options);
      }
    }
  }
}

function areaMatchesView(area: AreaShape, view: View | undefined): boolean {
  const areaFilter = view?.filters.area_ids;
  if (areaFilter?.length && (!area.area_id || !areaFilter.includes(area.area_id))) {
    return false;
  }
  const tagFilter = view?.filters.tags;
  return !tagFilter?.length || tagFilter.some((tag) => area.tags.includes(tag));
}

function createAreaShape(area: AreaShape, draggable: boolean): Konva.Shape | null {
  const { shape, style } = area;
  if (shape.type === "polygon" && (shape.points?.length ?? 0) >= 6) {
    return new Konva.Line({
      x: shape.x ?? 0,
      y: shape.y ?? 0,
      points: shape.points,
      closed: true,
      fill: style.fill ?? "#2196f3",
      stroke: style.stroke ?? "#1976d2",
      strokeWidth: style.strokeWidth ?? 2,
      opacity: style.fillOpacity ?? 0.4,
      draggable,
    });
  }
  if (shape.type === "rect") {
    return new Konva.Rect({
      x: shape.x ?? 0,
      y: shape.y ?? 0,
      width: shape.width ?? 100,
      height: shape.height ?? 80,
      fill: style.fill ?? "#2196f3",
      stroke: style.stroke ?? "#1976d2",
      strokeWidth: style.strokeWidth ?? 2,
      opacity: style.fillOpacity ?? 0.4,
      draggable,
    });
  }
  return null;
}

function addAreaAnnotation(
  layer: Konva.Layer,
  area: AreaShape,
  areaShape: Konva.Shape,
  view: View | undefined,
  states: Record<string, HassEntity>,
  areas: HassArea[]
): void {
  const lines: string[] = [];
  const areaName = areas.find((entry) => entry.id === area.area_id)?.name;
  if (area.area_id) lines.push(areaName ?? area.area_id);

  const primary = resolveValueSpec(view?.area_overlay?.primary, states);
  const secondary = resolveValueSpec(view?.area_overlay?.secondary, states);
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
  if (!area.shape.points) return;
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
  const transformer = new Konva.Transformer({
    nodes: [rectangle],
    rotateEnabled: false,
    keepRatio: false,
    anchorSize: 9,
    boundBoxFunc: (oldBox, newBox) => (newBox.width < 20 || newBox.height < 20 ? oldBox : newBox),
  });
  rectangle.on("transformend", () => {
    const width = Math.max(20, rectangle.width() * rectangle.scaleX());
    const height = Math.max(20, rectangle.height() * rectangle.scaleY());
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
  if (!plan) return;

  const registryByEntity = new Map(options.entities.map((entity) => [entity.entity_id, entity]));
  for (const marker of plan.markers ?? []) {
    if (!markerMatchesView(marker, options.view)) continue;

    const state = options.states[marker.entity_id];
    const registryEntry = registryByEntity.get(marker.entity_id);
    const group = createMarkerGroup(marker, state, registryEntry, options);

    group.on("click", (event) => {
      event.cancelBubble = true;
      if (options.editMode) {
        options.onSelect(marker.id);
      } else {
        options.onOpenMoreInfo(marker.entity_id);
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
  }
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
      radius: 19,
      fill: getMarkerColor(state),
      stroke: "#ffffff",
      strokeWidth: options.selectedMarkerId === marker.id ? 4 : 2,
      shadowColor: "#000000",
      shadowBlur: 5,
      shadowOpacity: 0.25,
    }),
    new Konva.Text({
      x: -10,
      y: -10,
      width: 20,
      align: "center",
      text: getDomainGlyph(marker.entity_id),
      fill: "#ffffff",
      fontSize: 16,
      fontStyle: "bold",
      listening: false,
    }),
    new Konva.Text({
      name: "marker-label",
      x: 26,
      y: -17,
      text: marker.label_mode === "off" ? "" : getMarkerLabel(marker, state, registryEntry),
      fill: "#212121",
      fontSize: 13,
      fontStyle: "bold",
      padding: 2,
      listening: false,
    }),
    new Konva.Text({
      name: "marker-value",
      x: 26,
      y: 1,
      text: markerValues(marker, state),
      fill: "#424242",
      fontSize: 12,
      padding: 2,
      listening: false,
    })
  );
  return group;
}

export function refreshMarkerLiveValues(options: MarkerRefreshOptions): void {
  const registryByEntity = new Map(options.entities.map((entity) => [entity.entity_id, entity]));
  for (const marker of options.plan.markers ?? []) {
    const group = options.groups.get(marker.id);
    if (!group) continue;

    const state = options.states[marker.entity_id];
    const dot = group.findOne(".marker-dot") as Konva.Circle | undefined;
    const value = group.findOne(".marker-value") as Konva.Text | undefined;
    const label = group.findOne(".marker-label") as Konva.Text | undefined;
    dot?.fill(getMarkerColor(state));
    value?.text(markerValues(marker, state));
    label?.text(
      marker.label_mode === "off"
        ? ""
        : getMarkerLabel(marker, state, registryByEntity.get(marker.entity_id))
    );
  }
  options.layer.batchDraw();
}

function markerValues(marker: Marker, state: HassEntity | undefined): string {
  return [getMarkerValue(marker, state), getMarkerValue(marker, state, "secondary")]
    .filter(Boolean)
    .join(" · ");
}

export function drawEmptyState(layer: Konva.Layer, stageWidth: number, stageHeight: number): void {
  layer.add(
    new Konva.Rect({
      x: 0,
      y: 0,
      width: stageWidth,
      height: stageHeight,
      fill: "#f5f5f5",
    })
  );

  const icon = new Konva.Text({
    x: stageWidth / 2,
    y: stageHeight / 2 - 50,
    text: "🏠",
    fontSize: 48,
  });
  icon.offsetX(icon.width() / 2);
  layer.add(icon);

  const title = new Konva.Text({
    x: stageWidth / 2,
    y: stageHeight / 2 + 10,
    text: "No Floorplan Loaded",
    fontSize: 20,
    fontStyle: "bold",
    fill: "#333",
  });
  title.offsetX(title.width() / 2);
  layer.add(title);

  const subtitle = new Konva.Text({
    x: stageWidth / 2,
    y: stageHeight / 2 + 40,
    text: 'Click "Edit" → "Upload Image" to get started',
    fontSize: 14,
    fill: "#666",
  });
  subtitle.offsetX(subtitle.width() / 2);
  layer.add(subtitle);
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
