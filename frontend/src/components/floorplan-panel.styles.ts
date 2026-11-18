import { css } from "lit";

export const floorplanPanelStyles = css`
  :host {
    display: block;
    height: 100%;
    background: var(--primary-background-color, #fafafa);
    color: var(--primary-text-color, #212121);
  }

  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
  }

  .workspace {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    flex: 1;
    min-height: 0;
  }

  .workspace.editing {
    grid-template-columns: minmax(0, 1fr) clamp(320px, 24vw, 390px);
  }

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    gap: 12px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #212121);
    border-bottom: 1px solid var(--divider-color, #ddd);
    min-height: 48px;
    box-sizing: border-box;
  }

  .toolbar-left {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 0;
  }

  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
  }

  .plan-select {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    max-width: 100%;
    color: inherit;
    font-size: 14px;
  }

  .plan-select select {
    min-width: 0;
    max-width: 100%;
    padding: 4px 8px;
    border-radius: 6px;
    border: 1px solid var(--divider-color, #d7d7d7);
    background: var(--card-background-color, #fff);
    color: inherit;
    font-size: 14px;
  }

  .views-bar {
    min-width: 0;
    padding: 0 16px;
    background: var(--card-background-color, #fff);
    border-bottom: 1px solid var(--divider-color, #ddd);
  }

  .view-tabs {
    display: flex;
    gap: 4px;
    overflow-x: auto;
  }

  .view-tab {
    flex: none;
    max-width: min(260px, calc(100vw - 40px));
    min-height: 44px;
    overflow: hidden;
    padding: 6px 12px;
    border: none;
    border-bottom: 2px solid transparent;
    background: transparent;
    color: var(--secondary-text-color, #555);
    cursor: pointer;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .view-tab:hover {
    background: var(--secondary-background-color, #eee);
  }

  .view-tab.active {
    border-bottom-color: var(--primary-color, #03a9f4);
    color: var(--primary-text-color, #212121);
  }

  .edit-toggle {
    min-height: 36px;
    padding: 6px 16px;
    border: 1px solid var(--divider-color, #d7d7d7);
    border-radius: 6px;
    background: var(--card-background-color, #fff);
    color: inherit;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
  }

  .edit-toggle:hover,
  .edit-toggle.active {
    background: var(--secondary-background-color, #eee);
  }

  .canvas-container {
    flex: 1;
    position: relative;
    overflow: hidden;
    min-height: 0;
    background: var(--secondary-background-color, #f5f5f5);
  }

  .canvas-wrapper {
    width: 100%;
    height: 100%;
  }

  .loading,
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 16px;
    color: var(--secondary-text-color, #666);
    text-align: center;
    padding: 20px;
  }

  .empty-state {
    position: absolute;
    inset: 0;
    box-sizing: border-box;
    background: var(--secondary-background-color, #f5f5f5);
  }

  .empty-state h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 500;
    color: var(--primary-text-color, #333);
  }

  .empty-state p {
    margin: 0;
    font-size: 16px;
    max-width: 400px;
  }

  .empty-state .upload-btn {
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    background: var(--primary-text-color, #212121);
    color: var(--card-background-color, #fff);
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
  }

  .empty-state .upload-btn:hover {
    opacity: 0.9;
  }

  .canvas-fit,
  .empty-state .import-btn {
    min-height: 44px;
    padding: 0 12px;
    border: 1px solid var(--divider-color, #d7d7d7);
    border-radius: 6px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #212121);
    cursor: pointer;
    font-size: 14px;
  }

  .canvas-fit {
    position: absolute;
    inset-inline-end: 12px;
    bottom: 12px;
  }

  .file-input,
  .config-file-input {
    display: none;
  }

  .editor-panel {
    min-width: 0;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 14px;
    box-sizing: border-box;
    border-inline-start: 1px solid var(--divider-color, #d7d7d7);
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #212121);
    scrollbar-gutter: stable;
  }

  .editor-panel-header {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 0 2px 14px;
  }

  .editor-panel-header span {
    color: var(--secondary-text-color, #616161);
    font-size: 12px;
    font-weight: 600;
  }

  .editor-panel-header strong {
    overflow: hidden;
    color: var(--primary-text-color, #212121);
    font-size: 18px;
    line-height: 1.35;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .editor-card {
    min-width: 0;
    margin: 0 0 12px;
    padding: 12px;
    box-sizing: border-box;
    border: 1px solid var(--divider-color, #d7d7d7);
    border-radius: 10px;
    background: var(--primary-background-color, #fafafa);
    box-shadow: var(--ha-card-box-shadow, 0 1px 2px rgba(0, 0, 0, 0.08));
  }

  .editor-card h2,
  .editor-card h3 {
    margin: 0 0 10px;
    color: var(--primary-text-color, #212121);
    font-size: 14px;
    line-height: 1.35;
  }

  details.editor-card {
    padding: 0;
  }

  details.editor-card > summary {
    min-height: 44px;
    padding: 12px;
    box-sizing: border-box;
    color: var(--primary-text-color, #212121);
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
  }

  details.editor-card[open] > summary {
    border-bottom: 1px solid var(--divider-color, #d7d7d7);
  }

  .editor-card-body {
    padding: 12px;
  }

  .editor-actions,
  .editor-fields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    min-width: 0;
  }

  .editor-panel button,
  .editor-panel input,
  .editor-panel select {
    min-width: 0;
    min-height: 40px;
    box-sizing: border-box;
    border: 1px solid var(--input-idle-line-color, var(--divider-color, #bdbdbd));
    border-radius: 6px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #212121);
    font: inherit;
  }

  .editor-panel button {
    padding: 8px 10px;
    cursor: pointer;
    font-size: 13px;
    line-height: 1.25;
  }

  .editor-panel button:hover:not(:disabled) {
    border-color: var(--primary-color, #03a9f4);
    background: var(--secondary-background-color, #f3f3f3);
  }

  .editor-panel button:disabled {
    background: var(--secondary-background-color, #eeeeee);
    color: var(--disabled-text-color, #757575);
    cursor: not-allowed;
    opacity: 1;
  }

  .editor-panel input,
  .editor-panel select {
    width: 100%;
    padding: 7px 9px;
  }

  .editor-fields label {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 5px;
    color: var(--secondary-text-color, #616161);
    font-size: 12px;
    font-weight: 500;
  }

  .editor-field-wide {
    grid-column: 1 / -1;
  }

  .editor-add-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 8px;
    margin-top: 8px;
  }

  .editor-helper {
    display: block;
    margin: 12px 0 6px;
    color: var(--secondary-text-color, #616161);
    font-size: 12px;
  }

  .entity-palette {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 6px;
    max-height: 168px;
    min-width: 0;
    overflow-y: auto;
    padding-inline-end: 3px;
  }

  .entity-card {
    display: flex;
    min-width: 0;
    flex-direction: column;
    padding: 8px 10px;
    box-sizing: border-box;
    border: 1px solid var(--divider-color, #bdbdbd);
    border-radius: 6px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #212121);
    cursor: grab;
    font-size: 12px;
    touch-action: none;
    user-select: none;
  }

  .entity-card strong,
  .entity-card span,
  .editor-selection-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .entity-card span {
    color: var(--secondary-text-color, #616161);
  }

  .editor-subsection + .editor-subsection {
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid var(--divider-color, #d7d7d7);
  }

  .editor-selection {
    border-inline-start: 3px solid var(--primary-color, #03a9f4);
  }

  .editor-selection-name {
    display: block;
    margin: -4px 0 10px;
    color: var(--secondary-text-color, #616161);
    font-size: 12px;
  }

  .editor-danger {
    border-color: var(--error-color, #db4437) !important;
    color: var(--error-color, #b3261e) !important;
  }

  .canvas-container.drag-target {
    outline: 3px dashed var(--primary-color, #03a9f4);
    outline-offset: -6px;
  }

  .panel-feedback {
    position: absolute;
    z-index: 1;
    top: 12px;
    inset-inline: 12px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    pointer-events: none;
  }

  .status {
    padding: 6px 12px;
    border-radius: 6px;
    background: #e8f5e9;
    color: #1b5e20;
    font-size: 13px;
  }

  .status.error {
    background: #ffebee;
    color: #b71c1c;
  }

  .status button {
    margin-inline-start: 8px;
    pointer-events: auto;
  }

  .viewer-note {
    font-size: 12px;
    opacity: 0.85;
  }

  button:focus-visible,
  input:focus-visible,
  select:focus-visible,
  details > summary:focus-visible,
  .canvas-container:focus-visible {
    outline: 3px solid var(--primary-color, #03a9f4);
    outline-offset: 2px;
  }

  .canvas-container {
    touch-action: none;
  }

  .canvas-accessibility {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .editor-selection-hint {
    margin: 0 2px 12px;
    color: var(--secondary-text-color, #616161);
    font-size: 13px;
    line-height: 1.5;
  }

  .entity-filters {
    margin: 8px 0;
  }

  .entity-filters summary {
    display: list-item;
    cursor: pointer;
    font-size: 14px;
    padding: 12px 0;
    min-height: 44px;
    box-sizing: border-box;
  }

  .narrow .workspace.editing {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(300px, 50svh) minmax(260px, 45svh);
    align-content: start;
    overflow-y: auto;
  }

  .narrow .editor-panel {
    border-inline-start: 0;
    border-top: 1px solid var(--divider-color, #d7d7d7);
  }

  .narrow button,
  .narrow select,
  .narrow input {
    min-height: 44px;
  }

  @media (max-width: 900px) {
    .workspace.editing {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: minmax(300px, 50svh) minmax(260px, 45svh);
      align-content: start;
      overflow-y: auto;
    }

    .editor-panel {
      border-inline-start: 0;
      border-top: 1px solid var(--divider-color, #d7d7d7);
    }

    .toolbar button,
    .toolbar select,
    .editor-panel button,
    .editor-panel select,
    .editor-panel input,
    .editor-panel .entity-card {
      min-height: 44px;
    }
  }

  @media (max-width: 520px) {
    .toolbar {
      padding: 8px 12px;
    }

    .toolbar-left {
      gap: 8px;
    }

    .plan-select span {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
    }

    .edit-toggle {
      padding-inline: 10px;
    }

    .editor-actions,
    .editor-fields {
      grid-template-columns: minmax(0, 1fr);
    }

    .editor-field-wide {
      grid-column: auto;
    }

    .editor-add-row {
      grid-template-columns: minmax(0, 1fr);
    }
  }
`;
