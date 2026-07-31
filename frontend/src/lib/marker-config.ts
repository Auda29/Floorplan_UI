import type { FloorplanConfig, Marker } from "../types/home-assistant";

export function addMarker(
  config: FloorplanConfig,
  planId: string,
  marker: Marker
): FloorplanConfig {
  return {
    ...config,
    plans: config.plans.map((plan) =>
      plan.plan_id === planId ? { ...plan, markers: [...plan.markers, marker] } : plan
    ),
  };
}

export function updateMarker(
  config: FloorplanConfig,
  planId: string,
  markerId: string,
  updates: Partial<Marker>
): FloorplanConfig {
  return {
    ...config,
    plans: config.plans.map((plan) =>
      plan.plan_id === planId
        ? {
            ...plan,
            markers: plan.markers.map((marker) =>
              marker.id === markerId ? { ...marker, ...updates } : marker
            ),
          }
        : plan
    ),
  };
}

export function removeMarker(
  config: FloorplanConfig,
  planId: string,
  markerId: string
): FloorplanConfig {
  return {
    ...config,
    plans: config.plans.map((plan) =>
      plan.plan_id === planId
        ? {
            ...plan,
            markers: plan.markers.filter((marker) => marker.id !== markerId),
          }
        : plan
    ),
  };
}
