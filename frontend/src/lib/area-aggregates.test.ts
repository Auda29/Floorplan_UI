import { describe, it, expect } from "vitest";
import {
  resolveAreaAggregate,
  areaHasActiveEntities,
  isAggregateValueSpec,
  type AggregateValueSpec,
} from "./area-aggregates";
import type { HassEntity, HassEntityRegistry } from "../types/home-assistant";
function entity(
  entity_id: string,
  state: string,
  attributes: Record<string, unknown> = {}
): HassEntity {
  return {
    entity_id,
    state,
    attributes,
    last_changed: "",
    last_updated: "",
    context: { id: "", user_id: null, parent_id: null },
  };
}
const members = [
  entity("sensor.one", "21.25", {
    unit_of_measurement: "°C",
    device_class: "temperature",
    offset: 0,
  }),
  entity("sensor.two", "18", {
    unit_of_measurement: "°C",
    device_class: "temperature",
    offset: "1",
  }),
  entity("sensor.bad", "unknown", { offset: 200 }),
  entity("sensor.text", " ", { offset: false }),
  entity("binary_sensor.door", "on", { device_class: "door" }),
  entity("binary_sensor.motion", "on", { device_class: "motion" }),
  entity("cover.garage", "opening"),
  entity("light.lamp", "unavailable"),
];
const states = Object.fromEntries(members.map((state) => [state.entity_id, state]));
const markers = members.map(({ entity_id }) => ({ area_id: "room", entity_id }));
const registry: HassEntityRegistry[] = [
  {
    entity_id: "sensor.one",
    name: null,
    icon: null,
    area_id: "room",
    domain: "sensor",
    device_id: null,
  },
];
function result(
  aggregation: AggregateValueSpec["aggregation"],
  options: Partial<AggregateValueSpec> = {}
) {
  return resolveAreaAggregate(
    { mode: "aggregate", aggregation, ...options },
    "room",
    states,
    registry,
    markers.slice(1).concat(markers[1])
  );
}
describe("area aggregates", () => {
  it("validates the complete spec", () => {
    expect(isAggregateValueSpec({ mode: "aggregate", aggregation: "sum" })).toBe(true);
    for (const bad of [
      null,
      {},
      { mode: "entity", aggregation: "sum" },
      { mode: "aggregate", aggregation: "median" },
      { mode: "aggregate", aggregation: "avg", attr: 0 },
    ])
      expect(isAggregateValueSpec(bad)).toBe(false);
  });
  it("combines registry and marker membership and filters active/open states", () => {
    expect(result("count")).toBe("6");
    expect(result("count_on")).toBe("2");
    expect(result("count_open")).toBe("2");
    expect(result("count_on", { domain: "binary_sensor", device_class: "motion" })).toBe("1");
    expect(areaHasActiveEntities("room", undefined, states, registry, markers)).toBe(true);
    expect(areaHasActiveEntities("room", ["sensor"], states, registry, markers)).toBe(false);
    expect(areaHasActiveEntities("elsewhere", [], states, registry, markers)).toBe(false);
  });
  it("computes finite stats, shared units, repeated format tokens and empty results", () => {
    expect(result("avg", { domain: "sensor" })).toBe("19.6 °C");
    expect(result("sum", { domain: "sensor" })).toBe("39.3 °C");
    expect(result("min", { domain: "sensor" })).toBe("18 °C");
    expect(result("max", { domain: "sensor" })).toBe("21.25 °C");
    expect(result("avg", { attr: "offset", format: "{value} / {value}" })).toBe("0.5 / 0.5");
    expect(result("sum", { attr: "missing", format: "{value} W" })).toBe("");
    const mixed = { ...states, "sensor.two": entity("sensor.two", "18") };
    expect(
      resolveAreaAggregate(
        { mode: "aggregate", aggregation: "min" },
        "room",
        mixed,
        registry,
        markers
      )
    ).toBe("18");
  });
});
