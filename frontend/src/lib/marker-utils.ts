import type {
  BadgeSpec,
  HassEntity,
  HassEntityRegistry,
  Marker,
  ValueBinding,
  ValueSpec,
  View,
} from "../types/home-assistant";

export function getEntityDomain(entityId: string): string {
  return entityId.split(".", 1)[0] ?? "";
}

export function getEntityDisplayName(
  marker: Marker,
  state: HassEntity | undefined,
  registryEntry?: HassEntityRegistry
): string {
  const friendlyName = state?.attributes.friendly_name;
  if (typeof friendlyName === "string" && friendlyName.trim()) {
    return friendlyName;
  }

  if (registryEntry?.name) return registryEntry.name;
  return marker.entity_id;
}

export function getMarkerLabel(
  marker: Marker,
  state: HassEntity | undefined,
  registryEntry?: HassEntityRegistry
): string {
  if (marker.label_mode === "off") return "";
  if (marker.label_mode === "short") {
    return marker.entity_id.split(".").at(-1) ?? marker.entity_id;
  }
  return getEntityDisplayName(marker, state, registryEntry);
}

export function resolveValueBinding(
  binding: ValueBinding | undefined,
  state: HassEntity | undefined
): string {
  if (!binding) return "";
  if (!state) return "Unavailable";

  const rawValue =
    binding.source === "attr" && binding.attr ? state.attributes[binding.attr] : state.state;

  if (rawValue === undefined || rawValue === null || rawValue === "") {
    return "Unavailable";
  }

  const value = String(rawValue);
  return binding.format?.includes("{value}") ? binding.format.split("{value}").join(value) : value;
}

export function getMarkerValue(
  marker: Marker,
  state: HassEntity | undefined,
  slot: "primary" | "secondary" = "primary"
): string {
  return resolveValueBinding(marker.bind[slot], state);
}

export function resolveValueSpec(
  spec: ValueSpec | undefined,
  states: Record<string, HassEntity>
): string {
  if (!spec?.entity_id) return "";
  return resolveValueBinding(spec, states[spec.entity_id]);
}

export function getActiveBadges(
  badges: BadgeSpec[] | undefined,
  states: Record<string, HassEntity>
): BadgeSpec[] {
  return (badges ?? []).filter((badge) => states[badge.entity_id]?.state === badge.when.state_is);
}

export function markerMatchesView(marker: Marker, view: View | undefined): boolean {
  if (!view) return true;

  const { domains, tags, area_ids: areaIds } = view.filters ?? {};
  if (domains?.length && !domains.includes(getEntityDomain(marker.entity_id))) {
    return false;
  }

  if (tags?.length && !tags.some((tag) => marker.tags.includes(tag))) {
    return false;
  }

  if (areaIds?.length && (!marker.area_id || !areaIds.includes(marker.area_id))) {
    return false;
  }

  return true;
}

export function getMarkerColor(state: HassEntity | undefined): string {
  if (!state || ["unavailable", "unknown"].includes(state.state)) return "#9e9e9e";
  if (["on", "open", "playing", "home", "heat"].includes(state.state)) return "#ffb300";
  return "#1976d2";
}

export function getDomainGlyph(entityId: string): string {
  const glyphs: Record<string, string> = {
    binary_sensor: "B",
    climate: "T",
    device_tracker: "N",
    light: "L",
    media_player: "M",
    sensor: "S",
    switch: "P",
  };
  const domain = getEntityDomain(entityId);
  return glyphs[domain] ?? domain.slice(0, 1).toUpperCase() ?? "?";
}

export function defaultTagsForEntity(entityId: string): string[] {
  const domain = getEntityDomain(entityId);
  if (domain === "climate") return ["heating"];
  if (domain === "device_tracker") return ["network"];
  return [];
}
