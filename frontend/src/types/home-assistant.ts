/**
 * Home Assistant TypeScript definitions
 * Minimal types for the HA frontend API
 */

export type {
  Area as AreaShape,
  Background as FloorplanBackground,
  Badge as BadgeSpec,
  FloorplanUIConfiguration as FloorplanConfig,
  Marker,
  Plan,
  ValueBinding,
  ValueSpec,
  View,
} from "./floorplan-config.generated";

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
