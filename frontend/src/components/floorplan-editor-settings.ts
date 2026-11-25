import { html, type TemplateResult } from "lit";
import type { Localize } from "../lib/i18n";
import type { FloorplanEditorActions } from "./floorplan-editor";
import type { FloorplanEditorModel } from "./floorplan-editor";
import type { Plan, ValueSpec, ViewStyle } from "../types/floorplan-config.generated";
export function renderSettingsTab(
  model: FloorplanEditorModel,
  actions: FloorplanEditorActions,
  t: Localize
): TemplateResult {
  const { currentPlan, currentView, currentViewId } = model;
  const isModel = currentPlan?.background.type === "model";
  const presets = currentPlan?.view.camera_presets ?? [];
  return html`
    <button class="add-plan" type="button" @click=${actions.uploadImage}>
      ${t("editor.upload")}
    </button>
    <details class="editor-card editor-plan-view">
      <summary>${t("editor.planView")}</summary>
      <div class="editor-card-body editor-actions">
        <button type="button" ?disabled=${!currentPlan} @click=${actions.renamePlan}>
          ${t("editor.renamePlan")}
        </button>
        <button type="button" ?disabled=${!currentPlan} @click=${actions.replaceImage}>
          ${t("editor.replaceImage")}
        </button>
        <button type="button" ?disabled=${!currentPlan} @click=${actions.deletePlan}>
          ${t("editor.deletePlan")}
        </button>
        <button type="button" @click=${actions.addView}>+ ${t("editor.addView")}</button>
        <button type="button" @click=${actions.renameView}>${t("editor.renameView")}</button>
        <button type="button" @click=${() => actions.moveView(-1)}>
          ← ${t("editor.previousView")}
        </button>
        <button type="button" @click=${() => actions.moveView(1)}>${t("editor.nextView")} →</button>
        <button type="button" @click=${actions.setDefaultView}>${t("editor.setDefault")}</button>
        <button type="button" ?disabled=${currentViewId === "all"} @click=${actions.deleteView}>
          ${t("editor.deleteView")}
        </button>
        <button type="button" @click=${actions.exportConfig}>${t("editor.export")}</button>
        <button type="button" @click=${actions.importConfig}>${t("editor.import")}</button>
      </div>
    </details>

    ${isModel && currentPlan ? render3DSettings(currentPlan, actions, t) : ""}
    <details class="editor-card editor-advanced">
      <summary>${t("editor.viewOverlay")}</summary>
      <div class="editor-card-body">
        <section class="editor-subsection">
          <h3>${t("editor.viewFilters", { name: currentView?.name ?? currentViewId })}</h3>
          <div class="editor-fields">
            <label>
              ${t("editor.domains")}
              <input
                .value=${currentView?.filters.domains?.join(", ") ?? ""}
                @change=${(event: Event) => actions.updateViewFilter("domains", event)}
                placeholder="light, switch"
              />
            </label>
            <label>
              ${t("editor.tags")}
              <input
                .value=${currentView?.filters.tags?.join(", ") ?? ""}
                @change=${(event: Event) => actions.updateViewFilter("tags", event)}
                placeholder="heating"
              />
            </label>
            <label>
              ${t("editor.areaIds")}
              <input
                .value=${currentView?.filters.area_ids?.join(", ") ?? ""}
                @change=${(event: Event) => actions.updateViewFilter("area_ids", event)}
                placeholder="living_room"
              />
            </label>
          </div>
        </section>
        ${isModel && presets.length
          ? html`<label
              >${t("editor.viewCameraPreset")}<select @change=${actions.updateViewCameraPreset}>
                <option value="" .selected=${!currentView?.camera_preset_id}>
                  ${t("editor.defaultCamera")}
                </option>
                ${presets.map(
                  (p) =>
                    html`<option value=${p.id} .selected=${p.id === currentView?.camera_preset_id}>
                      ${p.name}
                    </option>`
                )}
              </select></label
            >`
          : ""}
        ${renderViewStyle(currentView?.style ?? {}, actions, t)}
        ${(["primary", "secondary"] as const).map((slot) =>
          renderOverlay(slot, currentView?.area_overlay?.[slot], actions, t)
        )}
        <section class="editor-subsection">
          <div class="editor-fields">
            <label class="editor-field-wide">
              ${t("editor.badges")}<small>${t("editor.badgesHint")}</small>
              <input
                class="grow"
                .value=${currentView?.area_overlay?.badges
                  ?.map(
                    (badge) =>
                      `${badge.entity_id}=${badge.when.state_is}${badge.label ? `:${badge.label}` : ""}`
                  )
                  .join(", ") ?? ""}
                @change=${actions.updateAreaBadges}
                placeholder="binary_sensor.window=on:Window open"
              />
            </label>
          </div>
        </section>
      </div>
    </details>
  `;
}
function render3DSettings(plan: Plan, actions: FloorplanEditorActions, t: Localize) {
  return html`<details class="editor-card editor-3d-settings">
    <summary title=${t("editor.help3d")}>${t("editor.plan3dSettings")}</summary>
    <div class="editor-card-body editor-fields">
      ${(["shadows", "lighting"] as const).map(
        (field) =>
          html`<label
            ><input
              type="checkbox"
              .checked=${plan.view[field] ?? field === "lighting"}
              @change=${(event: Event) => actions.updatePlan3DSettings?.(field, event)}
            />${t(field === "lighting" ? "editor.lighting3d" : "editor.shadows")}</label
          >`
      )}
      <label
        >${t("editor.defaultCamera")}<select
          @change=${(event: Event) => actions.updatePlan3DSettings?.("camera_mode", event)}
        >
          ${(["ortho", "perspective"] as const).map(
            (mode) =>
              html`<option value=${mode} .selected=${mode === (plan.view.camera_mode ?? "ortho")}>
                ${t(mode === "ortho" ? "editor.cameraOrtho" : "editor.cameraPerspective")}
              </option>`
          )}
        </select></label
      >
      ${plan.view.camera_presets?.map(
        (p) =>
          html`<div>
            ${p.name}
            <button type="button" @click=${() => actions.applyCameraPreset?.(p.id)}>
              ${t("editor.applyPreset")}</button
            ><button type="button" @click=${() => actions.deleteCameraPreset?.(p.id)}>
              ${t("editor.deletePreset")}
            </button>
          </div>`
      )}
      <button type="button" @click=${actions.saveCameraPreset}>+ ${t("editor.savePreset")}</button>
    </div>
  </details>`;
}
function renderViewStyle(style: ViewStyle, actions: FloorplanEditorActions, t: Localize) {
  return html`<section class="editor-subsection">
    <h3>${t("editor.viewStyle")}</h3>
    <p class="editor-helper">${t("editor.viewStyleHint")}</p>
    <div class="editor-fields">
      ${(
        [
          ["dim_inactive_areas", "editor.dimInactiveAreas"],
          ["highlight_active_areas", "editor.highlightActiveAreas"],
        ] as const
      ).map(
        ([field, key]) =>
          html`<label
            ><input
              type="checkbox"
              .checked=${style[field] ?? false}
              @change=${(e: Event) => actions.updateViewStyle?.(field, e)}
            />${t(key)}</label
          >`
      )}
      ${(
        [
          ["inactive_area_opacity", "editor.inactiveOpacity"],
          ["active_area_opacity", "editor.activeOpacity"],
        ] as const
      ).map(
        ([field, key]) =>
          html`<label
            >${t(key)}<input
              type="number"
              min="0"
              max="1"
              step="0.05"
              .value=${String(style[field] ?? "")}
              @change=${(e: Event) => actions.updateViewStyle?.(field, e)}
          /></label>`
      )}
      ${(
        [
          ["active_area_fill", "editor.activeFill", "#2196f3"],
          ["active_area_stroke", "editor.activeStroke", "#1976d2"],
        ] as const
      ).map(
        ([field, key, color]) =>
          html`<label
            >${t(key)}<input
              type="color"
              .value=${style[field] ?? color}
              @change=${(e: Event) => actions.updateViewStyle?.(field, e)}
          /></label>`
      )}
    </div>
  </section>`;
}
function renderOverlay(
  slot: "primary" | "secondary",
  spec: ValueSpec | undefined,
  actions: FloorplanEditorActions,
  t: Localize
) {
  const aggregate = spec?.mode === "aggregate" ? spec : undefined;
  const entity = spec?.mode === "entity" ? spec : undefined;
  return html`<section class="editor-subsection">
    <h3 title=${t("editor.helpViewOverlay")}>
      ${t(slot === "primary" ? "editor.areaOverlay" : "editor.secondaryBadges")}
    </h3>
    <div class="editor-fields">
      <label
        >${t("editor.overlayMode")}<select
          @change=${(e: Event) => actions.updateAreaOverlayMode?.(slot, e)}
        >
          <option value="entity" .selected=${!aggregate}>${t("editor.modeEntity")}</option>
          <option value="aggregate" .selected=${!!aggregate}>${t("editor.modeAggregate")}</option>
        </select></label
      >
      ${aggregate
        ? html`<label
              >${t("editor.aggregation")}<select
                @change=${(e: Event) =>
                  actions.updateAreaOverlayAggregate?.(slot, "aggregation", e)}
              >
                ${(
                  [
                    ["count_on", "editor.aggCountOn"],
                    ["count_open", "editor.aggCountOpen"],
                    ["count", "editor.aggCount"],
                    ["avg", "editor.aggAvg"],
                    ["min", "editor.aggMin"],
                    ["max", "editor.aggMax"],
                    ["sum", "editor.aggSum"],
                  ] as const
                ).map(
                  ([value, key]) =>
                    html`<option value=${value} .selected=${aggregate.aggregation === value}>
                      ${t(key)}
                    </option>`
                )}
              </select></label
            >
            ${(
              [
                ["domain", "editor.domain", "light, sensor"],
                ["device_class", "editor.deviceClass", "temperature, window"],
              ] as const
            ).map(
              ([field, key, hint]) =>
                html`<label
                  >${t(key)}<input
                    .value=${aggregate[field] ?? ""}
                    placeholder=${hint}
                    @change=${(e: Event) => actions.updateAreaOverlayAggregate?.(slot, field, e)}
                /></label>`
            )}
            <p class="editor-helper">${t("editor.aggregateHint")}</p>`
        : html`<label
              >${t(slot === "primary" ? "editor.primaryEntity" : "editor.secondaryEntity")}<input
                .value=${entity?.entity_id ?? ""}
                placeholder="sensor.living_room_temperature"
                @change=${(e: Event) => actions.updateAreaOverlay(slot, "entity_id", e)}
            /></label>
            <label
              >${t("editor.source")}<select
                .value=${entity?.source ?? "state"}
                @change=${(e: Event) => actions.updateAreaOverlay(slot, "source", e)}
              >
                <option value="state">${t("editor.state")}</option>
                <option value="attr">${t("editor.attributeOption")}</option>
              </select></label
            >`}
      ${(["attr", "format"] as const).map(
        (field) =>
          html`<label
            >${t(field === "attr" ? "editor.attribute" : "editor.format")}<input
              .value=${spec?.[field] ?? ""}
              placeholder=${field === "format" ? "{value} °C" : ""}
              @change=${(e: Event) =>
                aggregate
                  ? actions.updateAreaOverlayAggregate?.(slot, field, e)
                  : actions.updateAreaOverlay(slot, field, e)}
          /></label>`
      )}
    </div>
  </section>`;
}
