/**
 * Home Assistant TypeScript definitions
 * Minimal types for the HA frontend API
 */

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  services: Record<string, Record<string, HassService>>;
  user: HassUser;
  language: string;
  connection: HassConnection;
  callWS<T>(msg: HassWSMessage): Promise<T>;
  fetchWithAuth(path: string, init?: Record<string, unknown>): Promise<Response>;
  callService(domain: string, service: string, data?: Record<string, unknown>): Promise<void>;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
  context: {
    id: string;
    parent_id: string | null;
    user_id: string | null;
  };
}

export interface HassService {
  name: string;
  description: string;
  fields: Record<string, unknown>;
}

export interface HassUser {
  id: string;
  name: string;
  is_admin: boolean;
}

export interface HassConnection {
  subscribeEvents(callback: (event: HassEvent) => void, eventType?: string): Promise<() => void>;
}

export interface HassEvent {
  event_type: string;
  data: Record<string, unknown>;
  origin: string;
  time_fired: string;
}

export interface HassWSMessage {
  type: string;
  [key: string]: unknown;
}

export interface HassArea {
  id: string;
  name: string;
  icon?: string;
}

export interface HassEntityRegistry {
  entity_id: string;
  name: string | null;
  icon: string | null;
  area_id: string | null;
  device_id: string | null;
  domain: string;
}

export interface FloorplanConfig {
  version: number;
  revision: number;
  default_view?: string;
  plans: Plan[];
  views: View[];
}

export interface FloorplanBackground {
  type: "image";
  asset_id?: string;
  content_type?: "image/png" | "image/jpeg";
  /**
   * Short-lived runtime URL returned by the backend. It is never persisted for
   * asset-backed images.
   */
  url?: string;
  width: number;
  height: number;
}

export interface Plan {
  plan_id: string;
  name: string;
  background: FloorplanBackground;
  areas: AreaShape[];
  markers: Marker[];
  view: {
    minZoom: number;
    maxZoom: number;
  };
}

export interface AreaShape {
  id: string;
  area_id: string;
  shape: {
    type: "rect" | "polygon";
    points?: number[];
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  };
  tags: string[];
  style: {
    fillOpacity: number;
    strokeWidth: number;
    fill?: string;
    stroke?: string;
  };
}

export interface Marker {
  id: string;
  entity_id: string;
  area_id?: string | null;
  pos: { x: number; y: number };
  icon: string;
  label_mode: "off" | "short" | "full" | "auto";
  tags: string[];
  bind: {
    primary: ValueBinding;
    secondary?: ValueBinding;
  };
}

export interface ValueBinding {
  source: "state" | "attr";
  attr?: string;
  format?: string;
}

export interface View {
  id: string;
  name: string;
  filters: {
    domains?: string[];
    tags?: string[];
    area_ids?: string[];
  };
  area_overlay?: {
    primary?: ValueSpec;
    secondary?: ValueSpec;
    badges?: BadgeSpec[];
  };
  marker_overlay?: {
    primary?: ValueSpec;
    secondary?: ValueSpec;
  };
}

export interface ValueSpec {
  mode: "entity";
  entity_id: string;
  source: "state" | "attr";
  attr?: string;
  format?: string;
}

export interface BadgeSpec {
  entity_id: string;
  when: {
    state_is: string;
  };
  icon?: string;
  label?: string;
}
