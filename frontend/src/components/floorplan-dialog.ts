import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";

export interface PanelDialog {
  kind: "text" | "confirm";
  title: string;
  message?: string;
  value: string;
  confirmLabel: string;
  destructive: boolean;
}

export type PanelDialogResult = string | boolean | null;

export class FloorplanDialog extends LitElement {
  @property({ attribute: false }) public dialog: PanelDialog | null = null;
  @property() public cancelLabel = "Cancel";
  @state() private _value = "";

  static styles = css`
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: grid;
      place-items: center;
      padding: 20px;
      background: rgba(0, 0, 0, 0.5);
    }

    section {
      width: min(440px, 100%);
      padding: 20px;
      border-radius: 8px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    h2 {
      margin: 0 0 12px;
      font-size: 20px;
    }

    p {
      margin: 0 0 16px;
    }

    input {
      box-sizing: border-box;
      width: 100%;
      margin-bottom: 18px;
      padding: 9px 10px;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    button {
      padding: 8px 16px;
    }

    .destructive {
      border-color: #b71c1c;
      background: #b71c1c;
      color: #fff;
    }
  `;

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has("dialog")) {
      this._value = this.dialog?.value ?? "";
    }
  }

  protected updated(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has("dialog") && this.dialog?.kind === "text") {
      this.renderRoot.querySelector("input")?.focus();
    }
  }

  private _resolve(value: PanelDialogResult): void {
    this.dispatchEvent(
      new CustomEvent<PanelDialogResult>("floorplan-dialog-resolve", {
        detail: value,
        bubbles: true,
        composed: true,
      })
    );
  }

  private _confirm(): void {
    if (!this.dialog) return;
    this._resolve(this.dialog.kind === "text" ? this._value : true);
  }

  private _onKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      event.preventDefault();
      this._resolve(null);
    } else if (event.key === "Enter") {
      event.preventDefault();
      this._confirm();
    }
  }

  protected render() {
    const dialog = this.dialog;
    if (!dialog) return nothing;
    return html`
      <div
        class="backdrop"
        @click=${(event: MouseEvent) => {
          if (event.target === event.currentTarget) this._resolve(null);
        }}
      >
        <section
          role="dialog"
          aria-modal="true"
          aria-label=${dialog.title}
          @keydown=${this._onKeydown}
        >
          <h2>${dialog.title}</h2>
          ${dialog.message ? html`<p>${dialog.message}</p>` : nothing}
          ${dialog.kind === "text"
            ? html`
                <input
                  .value=${this._value}
                  @input=${(event: Event) => {
                    this._value = (event.target as HTMLInputElement).value;
                  }}
                />
              `
            : nothing}
          <div class="actions">
            <button type="button" @click=${() => this._resolve(null)}>${this.cancelLabel}</button>
            <button
              type="button"
              class=${dialog.destructive ? "destructive" : ""}
              ?disabled=${dialog.kind === "text" && !this._value.trim()}
              @click=${this._confirm}
            >
              ${dialog.confirmLabel}
            </button>
          </div>
        </section>
      </div>
    `;
  }
}

if (!customElements.get("floorplan-dialog")) {
  customElements.define("floorplan-dialog", FloorplanDialog);
}
