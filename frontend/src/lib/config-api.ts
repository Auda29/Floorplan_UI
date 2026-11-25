import type {
  FloorplanConfig,
  HassArea,
  HassEntityRegistry,
  HomeAssistant,
} from "../types/home-assistant";

export const CURRENT_CONFIG_VERSION = 4;

export interface RegistryResult {
  areas: HassArea[];
  entities: HassEntityRegistry[];
}

interface SaveResult {
  success: true;
  revision: number;
}

function cloneConfig(config: FloorplanConfig): FloorplanConfig {
  return structuredClone(config);
}

function configForPersistence(config: FloorplanConfig): FloorplanConfig {
  const persisted = cloneConfig(config);
  for (const plan of Array.isArray(persisted.plans) ? persisted.plans : []) {
    if (plan?.background?.asset_id) {
      delete plan.background.url;
    }
  }
  return persisted;
}

export async function loadFloorplanConfig(hass: HomeAssistant): Promise<FloorplanConfig> {
  return hass.callWS<FloorplanConfig>({
    type: "floorplan_ui/get_config",
  });
}

export async function saveFloorplanConfig(
  hass: HomeAssistant,
  config: FloorplanConfig,
  baseRevision: number
): Promise<number> {
  const result = await hass.callWS<SaveResult>({
    type: "floorplan_ui/save_config",
    base_revision: baseRevision,
    config: configForPersistence(config),
  });
  return result.revision;
}

export async function validateFloorplanConfig(
  hass: HomeAssistant,
  config: FloorplanConfig
): Promise<FloorplanConfig> {
  try {
    const result = await hass.callWS<{ config: FloorplanConfig }>({
      type: "floorplan_ui/validate_config",
      config: configForPersistence(config),
    });
    return result.config;
  } catch (error) {
    // Home Assistant can reject WebSocket calls with a plain error object.
    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof error.message === "string"
    ) {
      throw error instanceof Error ? error : Object.assign(new Error(error.message), error);
    }
    throw error;
  }
}

export async function loadRegistry(hass: HomeAssistant): Promise<RegistryResult> {
  return hass.callWS<RegistryResult>({
    type: "floorplan_ui/list_registry",
  });
}

export function errorCode(error: unknown): string | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }
  const candidate = error as {
    code?: unknown;
    error?: { code?: unknown };
  };
  if (typeof candidate.code === "string") {
    return candidate.code;
  }
  return typeof candidate.error?.code === "string" ? candidate.error.code : undefined;
}
