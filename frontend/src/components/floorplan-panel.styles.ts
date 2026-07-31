import { css } from "lit";

export const floorplanPanelStyles = css`
  :host {
    display: block;
    height: 100%;
    background: var(--primary-background-color, #fafafa);
  }

  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: var(--app-header-background-color, #03a9f4);
    color: var(--text-primary-color, #fff);
    min-height: 48px;
    box-sizing: border-box;
  }

  .toolbar-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 500;
  }

  .plan-select {
    display: flex;
    align-items: center;
    gap: 8px;
    color: inherit;
    font-size: 14px;
  }

  .plan-select select {
    padding: 4px 8px;
    border-radius: 4px;
    border: none;
    font-size: 14px;
  }

  .view-tabs {
    display: flex;
    gap: 4px;
  }

  .view-tab {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.2);
    color: inherit;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s;
  }

  .view-tab:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .view-tab.active {
    background: rgba(255, 255, 255, 0.95);
    color: var(--app-header-background-color, #03a9f4);
  }

  .edit-toggle {
    padding: 6px 16px;
    border: 2px solid rgba(255, 255, 255, 0.8);
    border-radius: 4px;
    background: transparent;
    color: inherit;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
  }

  .edit-toggle:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .edit-toggle.active {
    background: rgba(255, 255, 255, 0.95);
    color: var(--app-header-background-color, #03a9f4);
    border-color: transparent;
  }

  .canvas-container {
    flex: 1;
    position: relative;
    overflow: hidden;
    background: #f5f5f5;
    min-height: 400px;
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

  .empty-state h2 {
    margin: 0;
    font-size: 24px;
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
    background: var(--primary-color, #03a9f4);
    color: #fff;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
  }

  .empty-state .upload-btn:hover {
    opacity: 0.9;
  }

  .file-input,
  .config-file-input {
    display: none;
  }

  .edit-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: #e8e8e8;
    border-bottom: 1px solid #ddd;
  }

  .edit-toolbar button {
    padding: 8px 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;
    font-size: 14px;
  }

  .edit-toolbar button:hover {
    background: #f0f0f0;
  }

  .edit-toolbar input,
  .edit-toolbar select {
    min-width: 140px;
    padding: 6px 8px;
    border: 1px solid #bbb;
    border-radius: 4px;
    background: #fff;
  }

  .edit-toolbar .grow {
    flex: 1;
    min-width: 180px;
  }

  .entity-palette {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    padding: 4px 0;
    flex: 1;
    min-width: 240px;
  }

  .entity-card {
    display: flex;
    flex-direction: column;
    min-width: 180px;
    max-width: 240px;
    padding: 7px 10px;
    border: 1px solid #bbb;
    border-radius: 6px;
    background: #fff;
    cursor: grab;
    font-size: 12px;
    user-select: none;
  }

  .entity-card strong,
  .entity-card span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .entity-card span {
    color: #666;
  }

  .canvas-container.drag-target {
    outline: 3px dashed var(--primary-color, #03a9f4);
    outline-offset: -6px;
  }

  .status {
    padding: 6px 16px;
    background: #e8f5e9;
    color: #1b5e20;
    font-size: 13px;
  }

  .status.error {
    background: #ffebee;
    color: #b71c1c;
  }

  .status button {
    margin-left: 12px;
  }

  .viewer-note {
    font-size: 12px;
    opacity: 0.85;
  }

  @media (max-width: 900px) {
    .toolbar,
    .toolbar-left,
    .edit-toolbar {
      align-items: flex-start;
      flex-wrap: wrap;
    }

    .view-tabs {
      flex-wrap: wrap;
    }
  }
`;
