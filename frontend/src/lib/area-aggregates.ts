import type { HassEntity, HassEntityRegistry } from "../types/home-assistant";
import { getEntityDomain } from "./marker-utils";
const aggregations = ["count_on", "count_open", "count", "avg", "min", "max", "sum"] as const;
export type AreaAggregationType = (typeof aggregations)[number];
export interface AggregateValueSpec {
  mode: "aggregate";
  aggregation: AreaAggregationType;
  domain?: string;
  device_class?: string;
  attr?: string;
  format?: string;
}
export function isAggregateValueSpec(spec: unknown): spec is AggregateValueSpec {
  if (!spec || typeof spec !== "object") return false;
  const fields = spec as Record<string, unknown>;
  return (
    fields.mode === "aggregate" &&
    aggregations.some((type) => type === fields.aggregation) &&
    ["domain", "device_class", "attr", "format"].every(
      (key) => fields[key] === undefined || typeof fields[key] === "string"
    )
  );
}

type Membership = { entity_id: string; area_id?: string | null };
const activeStates = new Set([
  "on",
  "open",
  "playing",
  "heat",
  "cool",
  "heat_cool",
  "cleaning",
  "unlocked",
]);
function* areaStates(
  areaId: string,
  states: Record<string, HassEntity>,
  entities: Membership[],
  markers: Membership[]
) {
  const seen = new Set<string>();
  for (const source of [entities, markers]) {
    for (const entry of source) {
      if (!areaId || entry.area_id !== areaId || seen.has(entry.entity_id)) continue;
      seen.add(entry.entity_id);
      const state = states[entry.entity_id];
      if (state && state.state !== "unknown" && state.state !== "unavailable") yield state;
    }
  }
}
function isOpen(state: HassEntity): boolean {
  const domain = getEntityDomain(state.entity_id);
  if (domain === "binary_sensor")
    return (
      state.state === "on" &&
      ["door", "window", "opening", "garage_door"].includes(String(state.attributes.device_class))
    );
  return (
    (domain === "cover" || domain === "lock") &&
    (state.state === "open" || state.state === "opening")
  );
}
export function resolveAreaAggregate(
  spec: AggregateValueSpec,
  areaId: string,
  states: Record<string, HassEntity>,
  entities: HassEntityRegistry[],
  markers: Membership[] = []
): string {
  let count = 0,
    sum = 0,
    min = Infinity,
    max = -Infinity;
  const units = new Set<unknown>();
  const numeric = ["avg", "sum", "min", "max"].includes(spec.aggregation);
  for (const state of areaStates(areaId, states, entities, markers)) {
    if (spec.domain && getEntityDomain(state.entity_id) !== spec.domain) continue;
    if (spec.device_class && state.attributes.device_class !== spec.device_class) continue;
    if (spec.aggregation === "count_on" && !activeStates.has(state.state)) continue;
    if (spec.aggregation === "count_open" && !isOpen(state)) continue;
    if (numeric) {
      const raw = spec.attr ? state.attributes[spec.attr] : state.state;
      if (typeof raw !== "number" && !(typeof raw === "string" && raw.trim())) continue;
      const value = Number(raw);
      if (!Number.isFinite(value)) continue;
      sum += value;
      min = Math.min(min, value);
      max = Math.max(max, value);
      if (!spec.attr) units.add(state.attributes.unit_of_measurement);
    }
    count++;
  }
  if (numeric && !count) return "";
  const results = { avg: sum / count, sum, min, max, count, count_on: count, count_open: count };
  const result = results[spec.aggregation];
  const value = String(
    ["avg", "sum"].includes(spec.aggregation) ? Number(result.toFixed(1)) : result
  );
  if (spec.format !== undefined) return spec.format.split("{value}").join(value);
  const [unit] = units;
  return units.size === 1 && typeof unit === "string" && unit.trim()
    ? value + " " + unit.trim()
    : value;
}
export function areaHasActiveEntities(
  areaId: string,
  domainFilter: string[] | undefined,
  states: Record<string, HassEntity>,
  entities: HassEntityRegistry[],
  markers: Membership[] = []
): boolean {
  for (const state of areaStates(areaId, states, entities, markers)) {
    if (
      activeStates.has(state.state) &&
      (!domainFilter?.length || domainFilter.includes(getEntityDomain(state.entity_id)))
    )
      return true;
  }
  return false;
}
