import { html, type TemplateResult } from "lit";
import type { Localize } from "../lib/i18n";
import type { FloorplanEditorActions } from "./floorplan-editor";
import type { AreaShape, HassArea, Marker } from "../types/home-assistant";
import { MDI_ICON_SUGGESTIONS, getMdiIconPath, resolveMdiIconName } from "../lib/mdi-icons";
export function renderAreaEditor(
  area: AreaShape,
  areas: HassArea[],
  availableMeshes: readonly string[],
  actions: FloorplanEditorActions,
  t: Localize
): TemplateResult {
  return html`
    <section class="editor-card editor-selection">
      <h2 title=${t("editor.helpArea")}>${t("editor.selectedArea")}</h2>
      <strong class="editor-selection-name">${area.id}</strong>
      <div class="editor-fields">
        ${area.shape.type === "mesh"
          ? html`<label title=${t("editor.pickMeshHint")}
              >${t("editor.meshName")}<select @change=${actions.updateAreaMesh}>
                ${[...new Set([area.shape.mesh_name, ...availableMeshes])].map(
                  (name) =>
                    html`<option
                      .selected=${area.shape.type === "mesh" && area.shape.mesh_name === name}
                      value=${name}
                    >
                      ${name}
                    </option>`
                )}
              </select></label
            >`
          : area.shape.type === "anchor3d"
            ? html`<span
                >${t("editor.position3d")} (${area.shape.x}, ${area.shape.y}, ${area.shape.z})</span
              >`
            : ""}
        <label>
          ${t("editor.haArea")}
          <select @change=${actions.bindArea} .value=${area.area_id ?? ""}>
            <option value="">${t("editor.unbound")}</option>
            ${areas.map(
              (candidate) => html`<option value=${candidate.id}>${candidate.name}</option>`
            )}
          </select>
        </label>
        <label>
          ${t("editor.tags")}
          <input
            .value=${area.tags.join(", ")}
            @change=${actions.updateAreaTags}
            placeholder="downstairs, heating"
          />
        </label>
        <label>
          ${t("editor.fill")}
          <input
            type="color"
            .value=${area.style.fill ?? "#2196f3"}
            @change=${(event: Event) => actions.updateAreaStyle("fill", event)}
          />
        </label>
        <label>
          ${t("editor.stroke")}
          <input
            type="color"
            .value=${area.style.stroke ?? "#1976d2"}
            @change=${(event: Event) => actions.updateAreaStyle("stroke", event)}
          />
        </label>
        <label>
          ${t("editor.opacity")}
          <input
            type="number"
            min="0"
            max="1"
            step="0.05"
            .value=${String(area.style.fillOpacity)}
            @change=${(event: Event) => actions.updateAreaStyle("fillOpacity", event)}
          />
        </label>
        <label>
          ${t("editor.strokeWidth")}
          <input
            type="number"
            min="0"
            max="20"
            step="1"
            .value=${String(area.style.strokeWidth)}
            @change=${(event: Event) => actions.updateAreaStyle("strokeWidth", event)}
          />
        </label>
        <button class="editor-danger editor-field-wide" type="button" @click=${actions.deleteArea}>
          ${t("editor.deleteArea")}
        </button>
      </div>
    </section>
  `;
}

export function renderMarkerEditor(
  marker: Marker,
  areas: HassArea[],
  is3D: boolean,
  actions: FloorplanEditorActions,
  t: Localize
): TemplateResult {
  const iconPath = (icon?: string) =>
    getMdiIconPath(resolveMdiIconName(icon, undefined, undefined, marker.entity_id)) ?? "";
  return html`
    <section class="editor-card editor-selection">
      <h2 title=${t("editor.helpMarker")}>${t("editor.selectedMarker")}</h2>
      <strong class="editor-selection-name">${marker.entity_id}</strong>
      <div class="editor-fields">
        ${is3D
          ? html`<span
              >${t("editor.position3d")} (${marker.pos.x}, ${marker.pos.y},
              ${marker.pos.z ?? 0})</span
            >`
          : ""}
        <label title=${t("editor.iconHint")}
          >${t("editor.icon")}
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d=${iconPath(marker.icon)}></path>
          </svg>
          <input
            list="floorplan-mdi-icons"
            .value=${marker.icon ?? ""}
            placeholder=${t("editor.iconPlaceholder")}
            @input=${(e: Event) => {
              const input = e.currentTarget as HTMLInputElement;
              input.parentElement?.querySelector("path")?.setAttribute("d", iconPath(input.value));
            }}
            @change=${actions.updateMarkerIcon}
        /></label>
        <datalist id="floorplan-mdi-icons">
          ${MDI_ICON_SUGGESTIONS.map((name) => html`<option value=${name}></option>`)}
        </datalist>
        <label>
          ${t("editor.tags")}
          <input
            .value=${marker.tags.join(", ")}
            @change=${actions.updateMarkerTags}
            placeholder="heating, downstairs"
          />
        </label>
        <label>
          ${t("editor.haArea")}
          <select .value=${marker.area_id ?? ""} @change=${actions.updateMarkerArea}>
            <option value="">${t("editor.unbound")}</option>
            ${areas.map((area) => html`<option value=${area.id}>${area.name}</option>`)}
          </select>
        </label>
        <label>
          ${t("editor.label")}
          <select .value=${marker.label_mode} @change=${actions.updateMarkerLabelMode}>
            <option value="auto">${t("editor.auto")}</option>
            <option value="short">${t("editor.short")}</option>
            <option value="full">${t("editor.full")}</option>
            <option value="off">${t("editor.off")}</option>
          </select>
        </label>
        <label>
          ${t("editor.markerAction")}
          <select .value=${marker.action?.tap ?? "more-info"} @change=${actions.updateMarkerAction}>
            <option value="more-info">${t("editor.actionDetails")}</option>
            <option value="toggle">${t("editor.actionToggle")}</option>
            <option value="none">${t("editor.actionNone")}</option>
          </select>
        </label>
        <label>
          ${t("editor.primary")}
          <select
            .value=${marker.bind.primary.source}
            @change=${(event: Event) => actions.updateMarkerBinding("primary", "source", event)}
          >
            <option value="state">${t("editor.state")}</option>
            <option value="attr">${t("editor.attributeOption")}</option>
          </select>
        </label>
        <label>
          ${t("editor.attribute")}
          <input
            .value=${marker.bind.primary.attr ?? ""}
            @change=${(event: Event) => actions.updateMarkerBinding("primary", "attr", event)}
          />
        </label>
        <label>
          ${t("editor.format")}
          <input
            .value=${marker.bind.primary.format ?? ""}
            @change=${(event: Event) => actions.updateMarkerBinding("primary", "format", event)}
            placeholder="{value} °C"
          />
        </label>
        ${marker.bind.secondary
          ? html`
              <label>
                ${t("editor.secondary")}
                <select
                  .value=${marker.bind.secondary.source}
                  @change=${(event: Event) =>
                    actions.updateMarkerBinding("secondary", "source", event)}
                >
                  <option value="state">${t("editor.state")}</option>
                  <option value="attr">${t("editor.attributeOption")}</option>
                </select>
              </label>
              <label>
                ${t("editor.attribute")}
                <input
                  .value=${marker.bind.secondary.attr ?? ""}
                  @change=${(event: Event) =>
                    actions.updateMarkerBinding("secondary", "attr", event)}
                />
              </label>
              <label>
                ${t("editor.format")}
                <input
                  .value=${marker.bind.secondary.format ?? ""}
                  @change=${(event: Event) =>
                    actions.updateMarkerBinding("secondary", "format", event)}
                />
              </label>
              <button type="button" @click=${actions.removeMarkerSecondaryBinding}>
                ${t("editor.removeSecondary")}
              </button>
            `
          : html`
              <button type="button" @click=${actions.addMarkerSecondaryBinding}>
                + ${t("editor.addSecondary")}
              </button>
            `}
        <button
          class="editor-danger editor-field-wide"
          type="button"
          @click=${actions.deleteMarker}
        >
          ${t("editor.deleteMarker")}
        </button>
      </div>
    </section>
  `;
}
