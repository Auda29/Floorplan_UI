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
    dialog::backdrop {
      background: rgba(0, 0, 0, 0.5);
    }

    dialog {
      box-sizing: border-box;
      width: min(440px, calc(100% - 40px));
      padding: 20px;
      border: none;
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
    if (changedProperties.has("dialog") && this.dialog) {
      const modal = this.renderRoot.querySelector("dialog");
      if (modal && !modal.open) modal.showModal();
      // Native modality makes the background inert and traps keyboard focus.
      // Destructive confirmations start on Cancel; text dialogs start in the input.
      this.renderRoot
        .querySelector<HTMLElement>(this.dialog.kind === "text" ? "input" : "button")
        ?.focus();
    }
  }

  private _resolve(value: PanelDialogResult): void {
    this.renderRoot.querySelector("dialog")?.close();
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
    if (this.dialog.kind === "text" && !this._value.trim()) return;
    this._resolve(this.dialog.kind === "text" ? this._value : true);
  }

  private _onKeydown(event: KeyboardEvent): void {
    if (event.key === "Tab") {
      const controls = Array.from(
        this.renderRoot.querySelectorAll<HTMLElement>("input, button:not([disabled])")
      );
      const first = controls[0];
      const last = controls.at(-1);
      const focused = this.shadowRoot?.activeElement;
      if (event.shiftKey && focused === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && focused === last) {
        event.preventDefault();
        first?.focus();
      }
      return;
    }
    if (event.key === "Enter" && event.target instanceof HTMLInputElement && !event.isComposing) {
      event.preventDefault();
      this._confirm();
    }
  }

  protected render() {
    const dialog = this.dialog;
    if (!dialog) return nothing;
    return html`
      <dialog
        aria-label=${dialog.title}
        @cancel=${(event: Event) => {
          event.preventDefault();
          this._resolve(null);
        }}
        @click=${(event: MouseEvent) => {
          if (event.target !== event.currentTarget) return;
          const bounds = (event.currentTarget as HTMLDialogElement).getBoundingClientRect();
          if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
          )
            this._resolve(null);
        }}
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
      </dialog>
    `;
  }
}

if (!customElements.get("floorplan-dialog")) {
  customElements.define("floorplan-dialog", FloorplanDialog);
}
