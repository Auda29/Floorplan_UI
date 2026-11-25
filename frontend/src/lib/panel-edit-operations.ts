import type {
  FloorplanBackground,
  FloorplanConfig,
  HomeAssistant,
  Plan,
  View,
} from "../types/home-assistant";
import { removeArea } from "./area-config";
import {
  MAX_IMAGE_FILE_BYTES,
  MAX_MODEL_FILE_BYTES,
  MAX_PORTABLE_CONFIG_BYTES,
  readImageDimensions,
  SUPPORTED_IMAGE_CONTENT_TYPES,
  uploadFloorplanImage,
  uploadFloorplanModel,
} from "./asset-api";
import { isGlbFileName } from "./glb-utils";
import type { Localize, TranslationKey } from "./i18n";
import { removeMarker } from "./marker-config";
import { exportFloorplanConfigFile, parseAndValidateBackupFile } from "./panel-backup";
import {
  addPlan,
  createPlan,
  removeCameraPreset,
  removePlan,
  renamePlan,
  replacePlanBackground,
  updatePlanView,
} from "./plan-config";
import { createView, moveView, removeView, updateView } from "./view-config";

interface EditHost {
  hass(): HomeAssistant;
  editableConfig(): FloorplanConfig | null;
  commit(config: FloorplanConfig): Promise<boolean>;
  selectPlan(id: string | null): void;
  selectView(id: string): void;
  onReplaceBackground(id: string): void;
  onImport(): void;
  newPlanId(): string;
  localize(): Localize;
  askText(title: string, initialValue?: string): Promise<string | null>;
  confirm(message: string, label: string, destructive?: boolean): Promise<boolean>;
  notice(message: string): void;
  error(message: string): void;
}

function takeFile(event: Event): File | undefined {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  return file;
}

export class PanelEditOperations {
  constructor(private readonly host: EditHost) {}

  private get t(): Localize {
    return this.host.localize();
  }

  private async confirmDelete(kind: "Plan" | "View" | "Area" | "Marker") {
    return this.host.confirm(
      this.t(`dialog.delete${kind}Message`),
      this.t(`editor.delete${kind}`),
      true
    );
  }

  async renamePlan(plan: Plan | null) {
    if (!plan || !this.host.editableConfig()) return;
    const name = (await this.host.askText(this.t("dialog.renamePlan"), plan.name))?.trim();
    const config = this.host.editableConfig();
    if (config && name && name !== plan.name)
      void this.host.commit(renamePlan(config, plan.plan_id, name));
  }

  async deletePlan(plan: Plan | null) {
    if (!plan || !this.host.editableConfig() || !(await this.confirmDelete("Plan"))) return;
    const config = this.host.editableConfig();
    const result = config && removePlan(config, plan.plan_id);
    if (!result) return;
    this.host.selectPlan(result.nextPlanId);
    void this.host.commit(result.config);
  }

  async deleteObject(kind: "area" | "marker", plan: Plan | null, id: string | null) {
    if (
      !plan ||
      !id ||
      !this.host.editableConfig() ||
      !(await this.confirmDelete(kind === "area" ? "Area" : "Marker"))
    )
      return;
    const config = this.host.editableConfig();
    if (!config) return;
    const remove = kind === "area" ? removeArea : removeMarker;
    void this.host.commit(remove(config, plan.plan_id, id));
  }

  async addView() {
    if (!this.host.editableConfig()) return;
    const name = (await this.host.askText(this.t("dialog.newView")))?.trim();
    const config = this.host.editableConfig();
    if (!config || !name) return;
    const view = createView(name, config.views);
    void this.host.commit({ ...config, views: [...config.views, view] });
    this.host.selectView(view.id);
  }

  async renameView(view: View | undefined) {
    if (!view || !this.host.editableConfig()) return;
    const name = (await this.host.askText(this.t("dialog.renameView"), view.name))?.trim();
    const config = this.host.editableConfig();
    if (config && name && name !== view.name) {
      void this.host.commit(updateView(config, view.id, (candidate) => ({ ...candidate, name })));
    }
  }

  moveView(id: string, direction: -1 | 1) {
    const config = this.host.editableConfig();
    const moved = config && moveView(config, id, direction);
    if (moved) void this.host.commit(moved);
  }

  setDefaultView(view: View | undefined) {
    const config = this.host.editableConfig();
    if (!config || !view) return;
    void this.host.commit({ ...config, default_view: view.id });
    this.host.notice(this.t("panel.defaultView", { name: view.name }));
  }

  async deleteView(id: string) {
    const current = this.host.editableConfig();
    if (
      !current ||
      id === "all" ||
      current.views.length <= 1 ||
      !(await this.confirmDelete("View"))
    )
      return;
    const config = this.host.editableConfig();
    const result = config && removeView(config, id);
    if (!result) return;
    void this.host.commit(result.config);
    this.host.selectView(result.nextViewId);
  }

  updatePlan3DSettings(
    plan: Plan | null,
    field: "shadows" | "lighting" | "camera_mode",
    event: Event
  ) {
    const config = this.host.editableConfig();
    if (!config || plan?.background.type !== "model") return;
    const input = event.target as HTMLInputElement;
    const value = field === "camera_mode" ? input.value : input.checked;
    void this.host.commit(updatePlanView(config, plan.plan_id, { [field]: value }));
  }

  deleteCameraPreset(plan: Plan | null, id: string) {
    const config = this.host.editableConfig();
    if (!config || !plan) return;
    const next = removeCameraPreset(config, plan.plan_id, id);
    if (next === config) return;
    const views = next.views.map((view) =>
      view.camera_preset_id === id ? { ...view, camera_preset_id: undefined } : view
    );
    void this.host.commit({ ...next, views });
  }

  async exportConfig(config: FloorplanConfig | null) {
    if (!config) return;
    try {
      await exportFloorplanConfigFile(this.host.hass(), config);
      this.host.notice(this.t("panel.exported"));
    } catch (error) {
      this.host.error(error instanceof Error ? error.message : this.t("panel.exportFailed"));
    }
  }

  async importConfig(event: Event) {
    if (!this.host.editableConfig()) return;
    const file = takeFile(event);
    if (!file) return;
    if (file.size > MAX_PORTABLE_CONFIG_BYTES) {
      this.host.error(this.t("panel.configTooLarge"));
      return;
    }

    try {
      const validated = await parseAndValidateBackupFile(
        this.host.hass(),
        file,
        (plans, views) =>
          this.host.confirm(
            this.t("dialog.importMessage", { plans, views }),
            this.t("dialog.import")
          ),
        this.t
      );
      if (!validated || !this.host.editableConfig()) return;
      this.host.onImport();
      this.host.selectPlan(validated.plans[0]?.plan_id ?? null);
      const saved = this.host.commit(validated);
      this.host.selectView(
        validated.views.find(({ id }) => id === validated.default_view)?.id ??
          validated.views[0]?.id ??
          "all"
      );
      if (await saved) this.host.notice(this.t("panel.imported"));
    } catch (error) {
      const message = error instanceof Error ? error.message : this.t("panel.invalidConfig");
      this.host.error(this.t("panel.importFailed", { message }));
    }
  }

  async uploadAsset(event: Event, replaceId: string | null) {
    if (!this.host.editableConfig()) return;
    const file = takeFile(event);
    if (!file) return;
    const isModel = file.type === "model/gltf-binary" || isGlbFileName(file.name);
    const hasSvgExtension = /\.svg$/i.test(file.name);
    const isImage =
      SUPPORTED_IMAGE_CONTENT_TYPES.some((type) => type === file.type) || hasSvgExtension;
    const errorKey: TranslationKey | null =
      !isModel && !isImage
        ? "panel.assetTypeError"
        : file.size > (isModel ? MAX_MODEL_FILE_BYTES : MAX_IMAGE_FILE_BYTES)
          ? isModel
            ? "panel.modelTooLarge"
            : "panel.imageTooLarge"
          : null;
    if (errorKey) {
      this.host.error(this.t(errorKey));
      return;
    }

    try {
      const hass = this.host.hass();
      const image =
        hasSvgExtension && file.type && file.type !== "image/svg+xml"
          ? new File([file], file.name, { type: "image/svg+xml", lastModified: file.lastModified })
          : file;
      const background: FloorplanBackground = isModel
        ? { type: "model", ...(await uploadFloorplanModel(hass, file)) }
        : {
            type: "image",
            ...(await uploadFloorplanImage(hass, image)),
            ...(await readImageDimensions(image)),
          };
      const config = this.host.editableConfig();
      if (!config) return;
      if (replaceId) {
        const plan = config.plans.find(({ plan_id }) => plan_id === replaceId);
        if (!plan) return;
        const changesKind = plan.background.type !== background.type;
        const hasContent =
          plan.areas.length > 0 ||
          plan.markers.length > 0 ||
          (plan.view.camera_presets?.length ?? 0) > 0;
        if (
          changesKind &&
          hasContent &&
          !(await this.host.confirm(
            this.t("dialog.replacePlanKindMessage"),
            this.t("editor.replaceImage"),
            true
          ))
        ) {
          return;
        }
        this.host.onReplaceBackground(plan.plan_id);
        await this.host.commit(replacePlanBackground(config, plan, background));
      } else {
        const plan = createPlan(this.host.newPlanId(), file.name, background);
        void this.host.commit(addPlan(config, plan));
        this.host.selectPlan(plan.plan_id);
      }
    } catch (error) {
      this.host.error(
        isModel
          ? this.t("panel.modelUploadFailed")
          : error instanceof Error
            ? error.message
            : this.t("panel.imageUploadFailed")
      );
    }
  }
}
