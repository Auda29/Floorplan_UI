import { html, type TemplateResult } from "lit";
import type { Localize, TranslationKey } from "../lib/i18n";
import type { ConfigDiagnostic } from "../lib/config-diagnostics";

export function renderWarningBadge(
  count: number,
  errorCount: number,
  open: boolean,
  onToggle: () => void,
  t: Localize
): TemplateResult {
  return html`<button
    type="button"
    class="warning-badge ${errorCount ? "has-errors" : ""}"
    aria-expanded=${String(open)}
    aria-controls="floorplan-warnings"
    @click=${onToggle}
  >
    ${t("warnings.button", { count })}
  </button>`;
}
export function renderWarningCenter(
  diagnostics: ConfigDiagnostic[],
  open: boolean,
  actions: { onToggle(): void; onClose(): void; onSelectDiagnostic(d: ConfigDiagnostic): void },
  t: Localize
): TemplateResult {
  if (!open) return html``;
  const sorted = [...diagnostics].sort(
    (a, b) => Number(b.severity === "error") - Number(a.severity === "error")
  );
  return html`<section
    class="warning-center editor-card"
    id="floorplan-warnings"
    aria-label=${t("warnings.title")}
  >
    <header>
      <h2>${t("warnings.title")}</h2>
      <button type="button" @click=${actions.onClose}>${t("warnings.close")}</button>
    </header>
    ${sorted.length
      ? html`<ul>
          ${sorted.map(
            (d) =>
              html`<li class=${d.severity}>
                <span
                  role="img"
                  aria-label=${t(d.severity === "error" ? "warnings.error" : "warnings.warning")}
                  >${d.severity === "error" ? "⛔" : "⚠"}</span
                >
                ${t(d.messageKey as TranslationKey, d.params)}
                <small
                  >${[d.planName ?? d.planId, d.viewName ?? d.viewId]
                    .filter(Boolean)
                    .join(" / ")}</small
                >
                <button type="button" @click=${() => actions.onSelectDiagnostic(d)}>
                  ${t("warnings.jumpTo")}
                </button>
              </li>`
          )}
        </ul>`
      : html`<p>${t("warnings.empty")}</p>`}
  </section>`;
}
