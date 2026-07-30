import type { HassEntity, HassEntityRegistry, Marker, View } from "../types/home-assistant";

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

export function getMarkerValue(marker: Marker, state: HassEntity | undefined): string {
  if (!state) return "Unavailable";

  const binding = marker.bind.primary;
  const rawValue =
    binding.source === "attr" && binding.attr ? state.attributes[binding.attr] : state.state;

  if (rawValue === undefined || rawValue === null || rawValue === "") {
    return "Unavailable";
  }

  const value = String(rawValue);
  return binding.format?.includes("{value}") ? binding.format.split("{value}").join(value) : value;
}

export function markerMatchesView(marker: Marker, view: View | undefined): boolean {
  if (!view) return true;

  const { domains, tags, area_ids: areaIds } = view.filters;
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
