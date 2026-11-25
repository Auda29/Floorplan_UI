import { beforeEach, describe, expect, it, vi } from "vitest";
import type { HassEntity, HassEntityRegistry, Marker, Plan, View } from "../types/home-assistant";
import { createAnchor3DArea, createArea, createMeshArea } from "./area-config";
import { getMdiIconPath, resolveDynamicMdiPath } from "./mdi-icons";

const { MockNode } = vi.hoisted(() => {
  class MockNode {
    public readonly attrs: Record<string, unknown>;
    public readonly children: MockNode[] = [];
    private parent: MockNode | null = null;
    public readonly handlers = new Map<
      string,
      (event: { cancelBubble: boolean; evt?: { defaultPrevented: boolean } }) => void
    >();

    public constructor(attrs: Record<string, unknown> = {}) {
      this.attrs = attrs;
    }
    public add(...nodes: MockNode[]) {
      for (const node of nodes) node.parent = this;
      this.children.push(...nodes);
    }
    public on(name: string, handler: () => void) {
      for (const event of name.split(" ")) this.handlers.set(event, handler);
    }
    public trigger(name: string, defaultPrevented = false) {
      this.handlers.get(name)?.({ cancelBubble: false, evt: { defaultPrevented } });
    }
    public destroyChildren() {
      for (const node of [...this.children]) node.destroy();
    }
    public destroy() {
      this.destroyChildren();
      if (!this.parent) return;
      this.parent.children.splice(this.parent.children.indexOf(this), 1);
      this.parent = null;
    }
    public getParent() {
      return this.parent;
    }
    public getLayer() {
      return this.parent;
    }
    public getClientRect() {
      return this.position();
    }
    public batchDraw() {}
    public scale() {}
    public size(size: { width: number; height: number }) {
      Object.assign(this.attrs, size);
    }
    public y(value?: number) {
      if (value !== undefined) this.attrs.y = value;
      return Number(this.attrs.y);
    }
    public text(value?: string) {
      if (value !== undefined) this.attrs.text = value;
      return this.attrs.text;
    }
    public fill(value: string) {
      this.attrs.fill = value;
    }
    public position() {
      return { x: Number(this.attrs.x ?? 0), y: Number(this.attrs.y ?? 0) };
    }
    public width() {
      return this.attrs.width;
    }
    public height() {
      return this.attrs.height;
    }
    public getAbsoluteScale() {
      return { x: 0.25, y: 0.25 };
    }
    public findOne(selector: string) {
      const name = selector.replace(".", "");
      return this.children.find((node) => node.attrs.name === name);
    }
  }
  return { MockNode };
});

type MockNodeInstance = InstanceType<typeof MockNode>;

vi.mock("konva", () => ({
  default: {
    Group: MockNode,
    Circle: MockNode,
    Text: MockNode,
    Rect: MockNode,
    Line: MockNode,
    Label: MockNode,
    Tag: MockNode,
    Transformer: MockNode,
    Path: MockNode,
  },
}));

vi.mock("./mdi-icons", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./mdi-icons")>()),
  resolveDynamicMdiPath: vi.fn(async () => null),
}));

import { refreshMarkerLiveValues, renderAreas, renderMarkers } from "./konva-renderer";

function marker(entityId = "light.kitchen"): Marker {
  return {
    id: "marker",
    entity_id: entityId,
    pos: { x: 10, y: 20 },
    icon: "mdi:lightbulb",
    label_mode: "auto",
    tags: ["lighting"],
    area_id: "living",
    bind: { primary: { source: "state" } },
    action: { tap: "more-info" },
  };
}

function plan(markers: Marker[]): Plan {
  return {
    plan_id: "ground",
    name: "Ground",
    background: { type: "image", width: 640, height: 480 },
    markers,
    areas: [],
    view: { minZoom: 0.1, maxZoom: 5 },
  };
}

function render(editMode: boolean, view?: View, sourceMarker = marker()) {
  const layer = new MockNode();
  const groups = new Map<string, MockNodeInstance>();
  const onSelect = vi.fn();
  const onActivate = vi.fn();
  renderMarkers({
    layer: layer as never,
    stage: null,
    plan: plan([sourceMarker]),
    view,
    states: {},
    entities: [],
    editMode,
    selectedMarkerId: null,
    groups: groups as never,
    onSelect,
    onActivate,
    onMove: vi.fn(),
  });
  return { layer, group: groups.get(sourceMarker.id)!, groups, onSelect, onActivate };
}

function entityState(entityId: string, state: string): HassEntity {
  return {
    entity_id: entityId,
    state,
    attributes: {},
    last_changed: "",
    last_updated: "",
    context: { id: "", parent_id: null, user_id: null },
  };
}

beforeEach(() => vi.clearAllMocks());

describe("Konva marker rendering", () => {
  it("renders and refreshes centered MDI paths as a light changes state", () => {
    const item = { ...marker(), icon: undefined };
    const { layer, group, groups } = render(false, undefined, item);
    expect(group.findOne(".marker-icon-path")?.attrs).toMatchObject({
      data: getMdiIconPath("mdi:lightbulb"),
      x: -9,
      y: -9,
      scale: { x: 0.75, y: 0.75 },
      fill: "#ffffff",
      listening: false,
    });
    expect(group.findOne(".marker-dot")?.attrs.radius).toBe(16);
    refreshMarkerLiveValues({
      layer: layer as never,
      plan: plan([item]),
      view: undefined,
      states: { [item.entity_id]: entityState(item.entity_id, "on") },
      entities: [],
      groups: groups as never,
    });
    expect(group.findOne(".marker-icon-path")?.attrs.data).toBe(getMdiIconPath("mdi:lightbulb-on"));
    expect(group.children.filter((node) => node.attrs.name === "marker-icon-path")).toHaveLength(1);
  });

  it("swaps a temporary domain glyph for a dynamically resolved path", async () => {
    const path = "M1 1L2 2";
    let finish!: (value: string) => void;
    vi.mocked(resolveDynamicMdiPath).mockReturnValueOnce(
      new Promise((resolve) => {
        finish = resolve;
      })
    );
    const { layer, group } = render(false, undefined, { ...marker(), icon: "mdi:custom-icon" });
    const draw = vi.spyOn(layer, "batchDraw");
    expect(group.findOne(".marker-icon-glyph")?.attrs.text).toBe("L");
    expect(group.findOne(".marker-icon-path")).toBeUndefined();
    expect(resolveDynamicMdiPath).toHaveBeenCalledWith("mdi:custom-icon");
    finish(path);
    await Promise.resolve();
    expect(group.findOne(".marker-icon-glyph")).toBeUndefined();
    expect(group.findOne(".marker-icon-path")?.attrs.data).toBe(path);
    expect(draw).toHaveBeenCalledOnce();
  });

  it("ignores a dynamic icon result that arrives after a live icon change", async () => {
    let finish!: (value: string) => void;
    vi.mocked(resolveDynamicMdiPath).mockReturnValueOnce(
      new Promise((resolve) => {
        finish = resolve;
      })
    );
    const item = marker();
    const { layer, group, groups } = render(false, undefined, { ...item, icon: "mdi:custom-icon" });
    refreshMarkerLiveValues({
      layer: layer as never,
      plan: plan([item]),
      view: undefined,
      states: {},
      entities: [],
      groups: groups as never,
    });
    finish("M1 1L2 2");
    await Promise.resolve();
    expect(group.findOne(".marker-icon-path")?.attrs.data).toBe(getMdiIconPath("mdi:lightbulb"));
    expect(group.children.filter((node) => node.attrs.name === "marker-icon-path")).toHaveLength(1);
  });

  it.each([false, true])("handles touch taps in edit mode %s", (editMode) => {
    const result = render(editMode);
    result.group.trigger("tap");
    expect(editMode ? result.onSelect : result.onActivate).toHaveBeenCalledOnce();
    expect(editMode ? result.onActivate : result.onSelect).not.toHaveBeenCalled();
  });

  it.each([false, true])("ignores taps suppressed by a pinch in edit mode %s", (editMode) => {
    const result = render(editMode);
    result.group.trigger("tap", true);
    expect(result.onSelect).not.toHaveBeenCalled();
    expect(result.onActivate).not.toHaveBeenCalled();
  });

  it("renders and refreshes per-view values and conditional marker badges", () => {
    const view: View = {
      id: "all",
      name: "All",
      filters: {},
      marker_overlay: {
        primary: {
          mode: "entity",
          entity_id: "sensor.temperature",
          source: "state",
          format: "{value} °C",
        },
        badges: [
          { entity_id: "binary_sensor.window", when: { state_is: "on" }, label: "Window open" },
        ],
      },
    };
    const rendered = render(false, view);
    const value = rendered.group.findOne(".marker-value")!;
    expect(value.attrs.text).toBe("Unavailable");
    const states = {
      "sensor.temperature": {
        entity_id: "sensor.temperature",
        state: "22",
        attributes: {},
        last_changed: "",
        last_updated: "",
        context: { id: "", parent_id: null, user_id: null },
      },
      "binary_sensor.window": {
        entity_id: "binary_sensor.window",
        state: "on",
        attributes: {},
        last_changed: "",
        last_updated: "",
        context: { id: "", parent_id: null, user_id: null },
      },
    };
    const options = {
      layer: rendered.layer as never,
      plan: plan([marker()]),
      view,
      states,
      entities: [],
      groups: new Map([["marker", rendered.group]]) as never,
    };
    refreshMarkerLiveValues(options);
    expect(value.attrs.text).toBe("22 °C\nWindow open");
    states["sensor.temperature"].state = "23";
    states["binary_sensor.window"].state = "off";
    refreshMarkerLiveValues(options);
    expect(value.attrs.text).toBe("23 °C");
  });

  it("keeps unavailable entities visible and opens More Info in view mode", () => {
    const result = render(false);

    expect(result.group).toBeDefined();
    expect(result.layer.children).toContain(result.group);
    result.group.trigger("click");
    expect(result.onActivate).toHaveBeenCalledWith(
      expect.objectContaining({ entity_id: "light.kitchen" })
    );
    expect(result.onSelect).not.toHaveBeenCalled();
  });

  it("selects instead of opening More Info in edit mode", () => {
    const result = render(true);

    result.group.trigger("click");
    expect(result.onSelect).toHaveBeenCalledWith("marker");
    expect(result.onActivate).not.toHaveBeenCalled();
  });

  it("honors view filters without mutating the plan", () => {
    const source = plan([marker()]);
    const original = structuredClone(source);
    const groups = new Map<string, MockNodeInstance>();
    renderMarkers({
      layer: new MockNode() as never,
      stage: null,
      plan: source,
      view: { id: "security", name: "Security", filters: { domains: ["binary_sensor"] } },
      states: {},
      entities: [],
      editMode: false,
      selectedMarkerId: null,
      groups: groups as never,
      onSelect: vi.fn(),
      onActivate: vi.fn(),
      onMove: vi.fn(),
    });

    expect(groups.size).toBe(0);
    expect(source).toEqual(original);
  });
});

describe("Konva area rendering", () => {
  it("renders area aggregates and applies view styling only outside edit mode", () => {
    const item = marker();
    const floor = plan([item]);
    const room = { ...createArea("room", "rect", { x: 0, y: 0 }), area_id: "living" };
    const office = { ...createArea("office", "polygon", { x: 0, y: 0 }), area_id: "office" };
    floor.areas = [
      room,
      office,
      createMeshArea("mesh", "Kitchen"),
      createAnchor3DArea("anchor", { x: 0, y: 0, z: 0 }),
    ];
    const officeSwitch: HassEntityRegistry = {
      entity_id: "switch.office",
      area_id: "office",
      domain: "switch",
      name: null,
      icon: null,
      device_id: null,
    };
    const view: View = {
      id: "lighting",
      name: "Lighting",
      filters: { domains: ["light"] },
      area_overlay: {
        primary: { mode: "aggregate", aggregation: "count_on", format: "{value} active" },
        secondary: {
          mode: "aggregate",
          aggregation: "count",
          domain: "light",
          format: "{value} lights",
        },
      },
      style: {
        highlight_active_areas: true,
        active_area_fill: "#ff0000",
        active_area_stroke: "#000000",
        active_area_opacity: 0.8,
        dim_inactive_areas: true,
      },
    };
    const layer = new MockNode();
    const shapes = new Map<string, MockNodeInstance>();
    const options = {
      layer: layer as never,
      plan: floor,
      view,
      states: {
        [item.entity_id]: entityState(item.entity_id, "on"),
        [officeSwitch.entity_id]: entityState(officeSwitch.entity_id, "on"),
      },
      areas: [{ id: "living", name: "Living room" }],
      entities: [officeSwitch],
      selectedAreaId: null,
      shapes: shapes as never,
      onSelect: vi.fn(),
      onUpdateShape: vi.fn(),
      onRerender: vi.fn(),
    };
    renderAreas({ ...options, editMode: false });
    expect([...shapes.keys()]).toEqual(["room", "office"]);
    expect(shapes.get(room.id)?.attrs).toMatchObject({
      fill: "#ff0000",
      stroke: "#000000",
      opacity: 0.8,
    });
    expect(shapes.get(office.id)?.attrs.opacity).toBe(0.15);
    expect(layer.children[1].children[1].attrs.text).toBe("Living room\n1 active\n1 lights");
    expect(layer.children[3].children[1].attrs.text).toBe("office\n1 active\n0 lights");

    renderAreas({ ...options, editMode: true });
    expect(shapes.get(room.id)?.attrs).toMatchObject({ fill: room.style.fill, opacity: 0.4 });
    expect(shapes.get(office.id)?.attrs.opacity).toBe(0.4);
  });

  it("keeps selection handles above overlapping areas and resizes in plan coordinates", () => {
    const floor = plan([]);
    const room = {
      id: "room",
      area_id: "",
      shape: { type: "rect" as const, x: 0, y: 0, width: 40, height: 30 },
      style: { fill: "#ffffff", stroke: "#000000", fillOpacity: 0.4, strokeWidth: 2 },
      tags: [],
    };
    floor.areas = [room, { ...room, id: "overlap" }];
    const layer = new MockNode();
    renderAreas({
      layer: layer as never,
      plan: floor,
      view: undefined,
      states: {},
      areas: [],
      editMode: true,
      selectedAreaId: room.id,
      shapes: new Map(),
      onSelect: vi.fn(),
      onUpdateShape: vi.fn(),
      onRerender: vi.fn(),
    });

    const transformer = layer.children.at(-1)?.attrs;
    expect(transformer?.nodes).toEqual([layer.children[0]]);
    const boundBox = transformer?.boundBoxFunc as (
      previous: { width: number; height: number },
      next: { width: number; height: number }
    ) => { width: number; height: number };
    const previous = { width: 10, height: 7.5 };
    const valid = { width: 8, height: 6 };
    expect(boundBox(previous, valid)).toBe(valid);
    expect(boundBox(previous, { width: 4, height: 6 })).toBe(previous);
  });
});
