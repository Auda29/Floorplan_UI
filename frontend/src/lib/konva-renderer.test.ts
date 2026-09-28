import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Marker, Plan, View } from "../types/home-assistant";

const { MockNode } = vi.hoisted(() => {
  class MockNode {
    public readonly attrs: Record<string, unknown>;
    public readonly children: MockNode[] = [];
    public readonly handlers = new Map<string, (event?: { cancelBubble: boolean }) => void>();

    public constructor(attrs: Record<string, unknown> = {}) {
      this.attrs = attrs;
    }
    public add(...nodes: MockNode[]) {
      this.children.push(...nodes);
    }
    public on(name: string, handler: () => void) {
      for (const event of name.split(" ")) this.handlers.set(event, handler);
    }
    public trigger(name: string) {
      this.handlers.get(name)?.({ cancelBubble: false });
    }
    public destroyChildren() {
      this.children.length = 0;
    }
    public batchDraw() {}
    public text(value: string) {
      this.attrs.text = value;
    }
    public fill(value: string) {
      this.attrs.fill = value;
    }
    public position() {
      return { x: Number(this.attrs.x ?? 0), y: Number(this.attrs.y ?? 0) };
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
  },
}));

import { refreshMarkerLiveValues, renderMarkers } from "./konva-renderer";

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

function render(editMode: boolean, view?: View) {
  const layer = new MockNode();
  const groups = new Map<string, MockNodeInstance>();
  const onSelect = vi.fn();
  const onOpenMoreInfo = vi.fn();
  renderMarkers({
    layer: layer as never,
    stage: null,
    plan: plan([marker()]),
    view,
    states: {},
    entities: [],
    editMode,
    selectedMarkerId: null,
    groups: groups as never,
    onSelect,
    onOpenMoreInfo,
    onMove: vi.fn(),
  });
  return { layer, group: groups.get("marker")!, onSelect, onOpenMoreInfo };
}

beforeEach(() => vi.clearAllMocks());

describe("Konva marker rendering", () => {
  it.each([false, true])("handles touch taps in edit mode %s", (editMode) => {
    const result = render(editMode);
    result.group.trigger("tap");
    expect(editMode ? result.onSelect : result.onOpenMoreInfo).toHaveBeenCalledOnce();
    expect(editMode ? result.onOpenMoreInfo : result.onSelect).not.toHaveBeenCalled();
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
    expect(result.onOpenMoreInfo).toHaveBeenCalledWith("light.kitchen");
    expect(result.onSelect).not.toHaveBeenCalled();
  });

  it("selects instead of opening More Info in edit mode", () => {
    const result = render(true);

    result.group.trigger("click");
    expect(result.onSelect).toHaveBeenCalledWith("marker");
    expect(result.onOpenMoreInfo).not.toHaveBeenCalled();
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
      onOpenMoreInfo: vi.fn(),
      onMove: vi.fn(),
    });

    expect(groups.size).toBe(0);
    expect(source).toEqual(original);
  });
});
