import type { HomeAssistant, FloorplanConfig } from "../types/home-assistant";
import {
  createPortableConfig,
  materializeImportedImages,
  MAX_PORTABLE_CONFIG_BYTES,
} from "./asset-api";
import { validateFloorplanConfig } from "./config-api";
import type { Localize } from "./i18n";

export async function exportFloorplanConfigFile(hass: HomeAssistant, config: FloorplanConfig) {
  const portable = await createPortableConfig(hass, config);
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(portable)], { type: "application/json" })
  );
  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = `floorplan-ui-config-v${config.version}.json`;
    link.click();
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function parseAndValidateBackupFile(
  hass: HomeAssistant,
  file: File,
  confirm: (plans: number, views: number) => Promise<boolean>,
  t: Localize
): Promise<FloorplanConfig | null> {
  if (file.size > MAX_PORTABLE_CONFIG_BYTES) throw new Error(t("panel.configTooLarge"));
  const parsed: unknown = JSON.parse(await file.text());
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
    throw new Error(t("panel.invalidConfig"));
  const plans = "plans" in parsed && Array.isArray(parsed.plans) ? parsed.plans.length : 0;
  const views = "views" in parsed && Array.isArray(parsed.views) ? parsed.views.length : 0;
  if (!(await confirm(plans, views))) return null;
  return validateFloorplanConfig(
    hass,
    await materializeImportedImages(hass, parsed as FloorplanConfig)
  );
}
