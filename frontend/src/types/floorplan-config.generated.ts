/* AUTO-GENERATED from schema/floorplan-config.schema.json. DO NOT EDIT. */

export type Background = ImageBackground | ModelBackground;
export type ValueBinding = {
  [k: string]: unknown;
} & {
  source: "state" | "attr";
  attr?: string;
  format?: string;
};
export type ValueSpec = EntityValueSpec | AggregateValueSpec;
export type EntityValueSpec = {
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
    shadows?: boolean;
    lighting?: boolean;
    camera_mode?: "ortho" | "perspective";
    /**
     * @maxItems 20
     */
    camera_presets?: CameraPreset[];
  };
}
export interface ImageBackground {
  type: "image";
  asset_id?: string;
  content_type?: "image/png" | "image/jpeg" | "image/svg+xml";
  /**
   * Transient signed URL or portable PNG, JPEG or SVG data URL.
   */
  url?: string;
  width: number;
  height: number;
}
export interface ModelBackground {
  type: "model";
  asset_id?: string;
  content_type?: "model/gltf-binary";
  /**
   * Transient signed URL for the GLB asset.
   */
  url?: string;
  width?: number;
  height?: number;
  unit_scale?: number;
}
export interface Area {
  id: string;
  area_id: string | null;
  shape: RectShape | PolygonShape | MeshShape | Anchor3DShape;
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
   * @maxItems 2000
   */
  points: number[];
}
export interface MeshShape {
  type: "mesh";
  mesh_name: string;
  anchor?: Vec3;
}
export interface Vec3 {
  x: number;
  y: number;
  z: number;
}
export interface Anchor3DShape {
  type: "anchor3d";
  x: number;
  y: number;
  z: number;
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
    z?: number;
  };
  icon?: string;
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
  [k: string]: unknown;
}
export interface CameraPreset {
  id: string;
  name: string;
  mode: "ortho" | "perspective";
  position: Vec3;
  target: Vec3;
  zoom?: number;
}
export interface View {
  id: string;
  name: string;
  filters: Filters;
  area_overlay?: Overlay;
  marker_overlay?: Overlay;
  style?: ViewStyle;
  camera_preset_id?: string;
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
export interface AggregateValueSpec {
  mode: "aggregate";
  aggregation: "count_on" | "count_open" | "count" | "avg" | "min" | "max" | "sum";
  domain?: string;
  device_class?: string;
  attr?: string;
  format?: string;
}
export interface Badge {
  entity_id: string;
  when: {
    state_is: string;
  };
  icon?: string;
  label?: string;
}
export interface ViewStyle {
  dim_inactive_areas?: boolean;
  inactive_area_opacity?: number;
  highlight_active_areas?: boolean;
  active_area_fill?: string;
  active_area_stroke?: string;
  active_area_opacity?: number;
}
