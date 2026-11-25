import type {
  AggregateValueSpec,
  AreaShape,
  BadgeSpec,
  Marker,
  ValueBinding,
  ValueSpec,
  View,
  ViewStyle,
} from "../types/home-assistant";

type Slot = "primary" | "secondary";
type BindingField = "source" | "attr" | "format";

export function parseTags(raw: string): string[] {
  return [
    ...new Set(
      raw
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
    ),
  ];
}

export function updateViewFilter(view: View, field: keyof View["filters"], raw: string): View {
  const values = parseTags(raw);
  return { ...view, filters: { ...view.filters, [field]: values.length ? values : undefined } };
}

function withBindingField<T extends ValueBinding>(
  binding: T,
  field: BindingField,
  value: string
): T {
  const updated = { ...binding, [field]: value || undefined };
  if (updated.source === "attr" && !updated.attr) updated.attr = "friendly_name";
  return updated;
}

function withOverlayValue(view: View, slot: Slot, spec?: ValueSpec): View {
  const overlay = { ...view.area_overlay };
  if (spec) overlay[slot] = spec;
  else delete overlay[slot];
  return { ...view, area_overlay: overlay };
}

export function updateAreaOverlayValue(
  view: View,
  slot: Slot,
  field: "entity_id" | BindingField,
  raw: string
): View {
  const value = raw.trim();
  const current = view.area_overlay?.[slot];
  if (field === "entity_id") {
    if (!value) return withOverlayValue(view, slot);
    return withOverlayValue(view, slot, {
      ...(current?.mode === "entity" ? current : { mode: "entity", source: "state" }),
      entity_id: value,
    });
  }
  return current?.mode === "entity"
    ? withOverlayValue(view, slot, withBindingField(current, field, value))
    : view;
}

export function updateAreaOverlayMode(view: View, slot: Slot, mode: string): View {
  return mode === "aggregate"
    ? withOverlayValue(view, slot, { mode, aggregation: "count_on" })
    : withOverlayValue(view, slot);
}

export function updateAreaOverlayAggregate(
  view: View,
  slot: Slot,
  field: Exclude<keyof AggregateValueSpec, "mode">,
  raw: string
): View {
  const spec = view.area_overlay?.[slot];
  return spec?.mode === "aggregate"
    ? withOverlayValue(view, slot, { ...spec, [field]: raw.trim() || undefined })
    : view;
}

export function updateAreaBadges(view: View, raw: string): View {
  const badges = raw.split(",").flatMap<BadgeSpec>((entry) => {
    const [condition, label] = entry.trim().split(":", 2);
    const [entity_id, state_is] = condition.split("=", 2).map((value) => value.trim());
    if (!entity_id || !state_is) return [];
    return [{ entity_id, when: { state_is }, ...(label?.trim() && { label: label.trim() }) }];
  });
  return {
    ...view,
    area_overlay: { ...view.area_overlay, badges: badges.length ? badges : undefined },
  };
}

export function updateViewStyle(view: View, field: keyof ViewStyle, value: string | boolean): View {
  if (field === "active_area_opacity" || field === "inactive_area_opacity") {
    const number = Number(value);
    if (!Number.isFinite(number)) return view;
    const opacity = value === "" ? undefined : Math.max(0, Math.min(1, number));
    return { ...view, style: { ...view.style, [field]: opacity } };
  }
  return { ...view, style: { ...view.style, [field]: value === "" ? undefined : value } };
}

export function updateAreaStyle(
  area: AreaShape,
  field: keyof AreaShape["style"],
  raw: string
): AreaShape {
  const numeric = field === "fillOpacity" || field === "strokeWidth";
  if (numeric && !Number.isFinite(Number(raw))) return area;
  const value = numeric
    ? Math.max(0, Math.min(field === "fillOpacity" ? 1 : 50, Number(raw)))
    : raw;
  return { ...area, style: { ...area.style, [field]: value } };
}

export function updateMarkerBinding(
  marker: Marker,
  slot: Slot,
  field: BindingField,
  value: string
): Marker["bind"] {
  const binding = withBindingField(marker.bind[slot] ?? { source: "state" }, field, value);
  return { ...marker.bind, [slot]: binding };
}
