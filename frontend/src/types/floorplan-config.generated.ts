/* AUTO-GENERATED from schema/floorplan-config.schema.json. DO NOT EDIT. */

export type ValueBinding = {
  [k: string]: unknown;
} & {
  source: "state" | "attr";
  attr?: string;
  format?: string;
};
export type ValueSpec = {
  [k: string]: unknown;
} & {
  mode: "entity";
  entity_id: string;
  source: "state" | "attr";
  attr?: string;
  format?: string;
};

/**
 * Versioned persisted Floorplan UI configuration. Background.url is transient in runtime responses and portable JSON exports and is removed before persistence.
 */
export interface FloorplanUIConfiguration {
  version: number;
  revision: number;
  default_view?: string;
  /**
   * @maxItems 20
   */
  plans: Plan[];
  /**
   * @maxItems 50
   */
  views: View[];
}
export interface Plan {
  plan_id: string;
  name: string;
  background: Background;
  /**
   * @maxItems 500
   */
  areas: Area[];
  /**
   * @maxItems 1000
   */
  markers: Marker[];
  view: {
    minZoom: number;
    maxZoom: number;
  };
}
export interface Background {
  type: "image";
  asset_id?: string;
  content_type?: "image/png" | "image/jpeg";
  /**
   * Transient signed URL or portable PNG/JPEG data URL; never persisted for asset-backed images.
   */
  url?: string;
  width: number;
  height: number;
}
export interface Area {
  id: string;
  area_id: string | null;
  shape: RectShape | PolygonShape;
  tags: string[];
  style: AreaStyle;
}
export interface RectShape {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface PolygonShape {
  type: "polygon";
  x?: number;
  y?: number;
  /**
   * @minItems 6
   */
  points: [number, number, number, number, number, number, ...number[]];
}
export interface AreaStyle {
  fillOpacity: number;
  strokeWidth: number;
  fill?: string;
  stroke?: string;
}
export interface Marker {
  id: string;
  entity_id: string;
  area_id?: string | null;
  pos: {
    x: number;
    y: number;
  };
  icon: string;
  label_mode: "off" | "short" | "full" | "auto";
  tags: string[];
  bind: {
    primary: ValueBinding;
    secondary?: ValueBinding;
  };
  action?: {
    tap?: "more-info" | "toggle" | "none";
    [k: string]: unknown;
  };
}
export interface View {
  id: string;
  name: string;
  filters: Filters;
  area_overlay?: Overlay;
  marker_overlay?: Overlay;
}
export interface Filters {
  domains?: string[];
  tags?: string[];
  area_ids?: string[];
}
export interface Overlay {
  primary?: ValueSpec;
  secondary?: ValueSpec;
  /**
   * @maxItems 20
   */
  badges?: Badge[];
}
export interface Badge {
  entity_id: string;
  when: {
    state_is: string;
  };
  icon?: string;
  label?: string;
}
