## Floorplan UI – Implementation Status & Task List

### Beta-hardening status (2026-08-03)

Completed and exercised with real tests:

- migration-before-validation hardening for malformed legacy containers
- complete PNG/JPEG decoding, bounded upload streaming, and asset garbage collection
- a shared versioned JSON Schema with generated TypeScript types
- panel, renderer, upload/save/reload, touch-zoom, and Chromium production-bundle tests
- Ruff, Python formatting, Mypy, branch-aware coverage, and pinned CI actions
- EN/DE localization foundations, responsive `narrow` mode, pinch zoom, keyboard
  actions, and baseline accessibility
- local minimum/current Home Assistant matrix runs, Hassfest, the published-main
  HACS baseline, reproducible bundle verification, and six logical local commits

Still required before a beta release:

- perform an independent review and resolve its findings
- push the branch and confirm GitHub Actions, including HACS against the branch
- continue behavior-preserving decomposition of the largest panel/renderer modules

The older detailed inventory below remains as history and backlog. If a status
conflicts with this section, this section takes precedence.

### Current implementation status (Jul 2026)

- **Backend (Home Assistant custom component)**
  - ✅ `floorplan_ui` custom component exists with `manifest.json` and can be loaded by Home Assistant.
  - ✅ Panel registration in `async_setup`:
    - Registers a custom panel at `/floorplan-ui` using the `floorplan-ui-panel` web component.
    - Serves the committed production bundle from `/floorplan_ui_static/floorplan-ui.js`.
  - ✅ Storage:
    - `FloorplanStore` implemented using HA's `Store` helper with versioning.
    - Default config structure matches PRD root: `version`, `plans` (list), `views` (list).
    - Default views provided: `all`, `heating`, `lights`, `network`, `entertainment`.
    - Read/write operations for the full config blob implemented (`async_get_config`, `async_update_config`).
  - ✅ Configuration validation & normalization:
    - `_validate_config_structure()` validates versioned plans, views, backgrounds, areas and markers.
    - `_normalize_config()` fills missing/invalid fields with sensible defaults.
    - Version 1 data is migrated explicitly to schema version 2; unsupported future versions are rejected.
    - `save_config` WebSocket returns `invalid_config` error for malformed data.
  - ✅ WebSocket API:
    - `floorplan_ui/get_config` returns stored configuration.
    - `floorplan_ui/save_config` persists provided configuration (with validation, size limit and admin guard).
    - `floorplan_ui/list_registry` returns areas and entities to administrators (with optional domain/area filters).
  - ✅ `floorplan_ui/validate_config` performs admin-only import pre-flight validation without saving.

- **Frontend (custom panel UI)**
  - ✅ Panel shell & wiring:
    - `floorplan-ui-panel` LitElement registered and used as HA custom panel entry point.
    - Toolbar with title, view tabs (`All`, `Heating`, `Lights`, `Network`), and Edit/View toggle.
    - Styling aligned with HA theme variables (backgrounds, text colors).
  - ✅ Config loading & persistence:
    - Uses `hass.callWS("floorplan_ui/get_config")` to fetch configuration from backend.
    - Uses `hass.callWS("floorplan_ui/save_config")` to persist changes.
    - Selects an initial current plan if any plans exist in config.
  - ✅ Canvas / floorplan handling:
    - Konva-based canvas initialized with pan (draggable stage) and mouse-wheel zoom, with clamped scale and cursor-centric zoom.
    - Resize observer keeps the stage sized to the container.
    - Empty-state rendering when no plan exists, including visual hint to upload an image in Edit mode.
    - Image upload flow:
      - Reads PNG/JPG via `FileReader`.
      - Creates a `Plan` object with `plan_id`, `name`, `background` (`type`, `url`, `width`, `height`), empty `areas` and `markers`, and basic zoom limits.
      - Persists updated config to backend and renders the image on the Konva stage, fitted to the viewport.
  - ✅ Multi-plan management:
    - Plan selector dropdown in toolbar.
    - Rename and delete plan actions in edit toolbar.
    - Auto-selection fallback when current plan is deleted.
  - ✅ Image error handling:
    - Graceful error state display when background image fails to load.
    - User can re-upload via Edit mode.
  - ✅ Area shapes (rectangles and basic polygons):
    - Dedicated `_areasLayer` for area rendering separate from background.
    - "Add Area (Rect)" button in edit mode creates centered rectangles.
    - Click-to-select with visual feedback (thicker stroke).
    - Drag-to-reposition with automatic persistence.
    - Properties panel shows selected area details.
    - Delete confirmation dialog for safety.
  - ✅ Area binding to HA Areas:
    - Loads HA areas via `floorplan_ui/list_registry` on startup.
    - Dropdown in properties panel to bind area shapes to HA areas.
    - Binding state persisted with area configuration.
  - ✅ Marker selection, placement, dragging, editing, deletion, live values and HA More-Info integration.
  - ✅ View creation/deletion and domain, tag and area filtering for markers.
  - ✅ Rectangle resize handles and polygon vertex editing are available for selected areas.
  - ✅ Area color, stroke, opacity, binding, and tag controls are available in Edit mode.
  - ✅ Searchable domain/area-filtered entity palette supports drag-and-drop and dropdown placement.
  - ✅ View-scoped area primary/secondary values and conditional badges are rendered live.
  - ✅ Full JSON export and validated, confirmed JSON import are available to administrators.
  - 🔶 Validation and import failures are surfaced inline; a consolidated warning center remains future work.

---

### Task list derived from PRD

> This list is grouped roughly by the milestones in the PRD (section 13), plus technical underpinnings from sections 8–12.

#### 1. Solidify "Hello Floorplan" (Milestone 1) ✅ COMPLETE

- [x] **Multi-plan management** ✅ _Completed in commit `06da594` (2026-01-27)_
  - ~~Implement UI to list, select, rename, and delete `Plan` objects.~~
  - ~~Ensure switching plans correctly re-renders the canvas and persists selection if desired.~~

  > **Review notes (2026-01-27):**
  > - Implementation uses immutable state updates with spread operator - good practice.
  > - Delete action includes `window.confirm()` for safety.
  > - Auto-fallback to first plan after deletion handles edge cases well.
  > - Minor: `_selectPlan()` could be simplified - currently casts empty string to null implicitly.

- [x] **Config schema & validation (basic)** ✅ _Completed in commit `a407022` (2026-01-27)_
  - ~~Define a minimal JSON schema / validation layer for `version`, `plans`, and `views`.~~
  - ~~Add server-side validation in `save_config` (reject obviously broken configs, log warnings).~~

  > **Review notes (2026-01-27):**
  > - Excellent implementation in `store.py` with two-phase approach:
  >   1. `_validate_config_structure()` - strict validation, rejects malformed configs
  >   2. `_normalize_config()` - lenient normalization, fills defaults for missing fields
  > - **Strengths:**
  >   - Comprehensive field-by-field normalization for plans (plan_id, name, background, areas, markers, view)
  >   - Generates unique plan_ids when missing, avoiding collisions with `seen_ids` set
  >   - Type coercion with sensible defaults (e.g., width=800, height=600 for missing dimensions)
  >   - Proper error propagation to WebSocket client via `connection.send_error()`
  >   - Logging at WARNING level for recoverable issues
  > - **Resolved by `v0.1.0`:**
  >   - Area and marker objects receive field-level validation.
  >   - `floorplan_ui/validate_config` provides admin-only dry-run validation.
  >   - The frontend displays save and import validation errors inline.

- [x] **Resilience to missing/invalid images** ✅ _Completed in commit `06da594` (2026-01-27)_
  - ~~Handle broken `background.url` (404, missing data).~~
  - ~~Provide a way to re-upload/replace floorplan images from the UI.~~

  > **Review notes (2026-01-27):**
  > - `_drawImageErrorState()` provides clear visual feedback with actionable hint.
  > - Both `onerror` callback and try/catch around `draw()` ensure robustness.
  > - Error state uses distinct orange color scheme (#fff3e0, #e65100) for visibility.
  > - Good: Users can re-upload via the existing "Upload Image" button in edit mode.

---

#### 2. Area shapes & Area binding (Milestone 2, PRD 8.3, 11.3) ✅ ALPHA BASELINE COMPLETE

> **Completion note (2026-07-30):** Rectangle and polygon creation, rectangle
> resizing, polygon vertex editing, HA Area binding, tags, and style controls are
> implemented for the alpha scope.

- [x] **Area shape persistence** ✅ _Completed in commits `7d5a8ba`, `b9d7e7d` (2026-01-27)_
  - ~~Extend backend config model to include `areas` with fields from PRD section 11.3.~~
  - ~~Ensure round-trip between UI edits and stored config.~~

  > **Review notes (2026-01-27):**
  > - Full persistence working via `saveConfig()` and `_renderAreas()`.
  > - Areas are loaded from config and rendered on canvas.
  > - Updates (drag, bind, delete) are saved immediately to backend.
  > - Backend normalization already handles `areas` as a list - working well.

- [x] **Area binding to HA Areas** ✅ _Completed in commits `7d5a8ba`, `b9d7e7d` (2026-01-27)_
  - ~~Use `floorplan_ui/list_registry` to fetch areas.~~
  - ~~Add a properties panel to bind a drawn shape to a specific `area_id`.~~

  > **Review notes (2026-01-27):**
  > - `_loadHAAreas()` successfully fetches areas via `list_registry` WebSocket API.
  > - Properties panel appears when an area is selected in edit mode.
  > - Dropdown shows all HA areas with "Unbound" option.
  > - Binding saved via `_onBindAreaChange()` with immutable state updates.
  > - Good UX: Selected area info displayed prominently.

- [x] **Canvas shape toolbox (rectangles)** ✅ _Completed in commits `7d5a8ba`, `b9d7e7d` (2026-01-27)_
  - ~~Add edit-mode tool to create rectangles on the Konva stage.~~
  - ~~Support selection and dragging.~~

  > **Review notes (2026-01-27):**
  > - `_addAreaRect()` creates centered rectangles with reasonable default sizing.
  > - Click-to-select working with visual feedback (stroke thickens to 4px).
  > - Drag-to-reposition working with `dragend` event handler.
  > - Clear selection on empty canvas click - good UX.
  > - Areas automatically made draggable in edit mode.
  > - **Strengths:**
  >   - Immutable state updates with spread operator throughout.
  >   - Unique IDs using `Date.now()` - simple and effective.
  >   - Event bubbling properly cancelled (`evt.cancelBubble = true`).
  >   - Confirmation dialog for area deletion.

- [x] **Canvas shape toolbox (advanced features)**
  - Rectangle resize handles use Konva's `Transformer`.
  - Polygon creation and draggable vertex anchors are implemented.
  - Bound areas display their Home Assistant Area name on the canvas.

  > **Current state:** Selected rectangles expose resize handles and selected polygons
  > expose draggable `Konva.Circle` vertex anchors.

- [x] **Area style configuration UI**
  - UI controls edit `AreaShape.style` fill color, stroke color, opacity, and stroke width.
  - Style changes are persisted and applied at render time.

  > **Current state:** Fill, stroke, opacity, and stroke-width controls are available
  > in the selected-area properties panel.

---

#### 3. Marker placement & entity mapping (Milestone 3, PRD 8.4, 11.4) ✅ ALPHA BASELINE COMPLETE

- [x] **Entity palette / explorer**
  - The palette uses `floorplan_ui/list_registry` results:
    - Areas, devices, and entities with filters (domain, area, text search).
  - Entities can be added through the selector or dragged from the palette onto the canvas.

  > **Current state:** The custom searchable palette renders up to 80 filtered results;
  > virtualization or a native HA picker remains a future scalability enhancement.

- [x] **Marker model and rendering**
  - `Marker` data follows the PRD model (`entity_id`, position, icon, label mode, tags, binding).
  - Konva renders markers with domain glyphs, labels, and live values; Edit mode supports repositioning.

  > **Current state:** The integration stores icon identifiers but renders compact
  > domain glyphs. Rendering arbitrary MDI icons remains post-alpha work.

- [x] **Marker configuration panel**
  - The selected-marker panel configures HA Area binding, label mode, tags, and
    primary/secondary value bindings.

- [x] **HA More-Info integration**
  - On marker click in View mode, open the standard HA More-Info dialog for the entity.

  > **Current state:** View-mode marker clicks dispatch the composed
  > `hass-more-info` event with the marker's entity ID.

---

#### 4. Views / Pages (Milestone 4, PRD 8.5, 11.5) ✅ ALPHA BASELINE COMPLETE

- [x] **View management UI**
  - Implement CRUD for views (create, rename, delete, reorder).
  - Allow choosing a default view.

  > **Current state:** Edit mode supports create, rename, reorder, default selection,
  > and deletion. Backend normalization preserves existing views or falls back to defaults.

- [x] **Filter behavior**
  - Implement filtering logic based on view `filters`:
    - Domains whitelist,
    - Tags whitelist,
    - Optional area whitelist.
  - Hide/show markers and/or areas based on the current view.

  > **Current state:** Domain, tag and area filters are applied to marker rendering.

- [ ] **View-level styling hooks**
  - Extend config model to support optional `View.style` and integrate with rendering (e.g., dim non-selected areas).

---

#### 5. Overlays & rules (Milestone 5, PRD 8.6, 11.6–11.7) ✅ ALPHA BASELINE COMPLETE

- [x] **ValueSpec implementation**
  - Implement `ValueSpec` resolution on frontend:
    - From entity state or attribute.
    - Apply simple formatting rules.

- [x] **Marker overlays**
  - Display primary and optional secondary values on markers per current view.
  - Throttle updates to 1–2 Hz as per non-functional requirements.

- [x] **Area overlays**
  - Implement `area_overlay` rendering for primary/secondary values on Area shapes.

- [x] **Badges and rules**
  - Implement `BadgeSpec` evaluation (e.g., `when.state_is`).
  - Render badges on areas/markers when rules match.

---

#### 6. Export/Import, validation & migrations (Milestone 6, PRD 8.7, 11.1–11.7) ✅ ALPHA BASELINE COMPLETE

- [x] **JSON export/import**
  - Provide UI actions to export the full config as JSON.
  - Provide an import flow with:
    - Schema validation,
    - Version checks,
    - Preview/confirmation UI.

  > **Current state:** Import uses the admin-only validation endpoint, shows a preview
  > and confirmation, and surfaces validation failures without saving invalid data.

- [x] **Storage versioning & migrations**
  - Introduce explicit migration steps for new schema versions.
  - Ensure old stored configs are upgraded safely on load.

  > **Current state:** `FloorplanStore` explicitly migrates schema version 1 to version 2,
  > validates the migrated result, and rejects unsupported future versions.

- [x] **Warning & validation UX (alpha baseline)**
  - Surface non-fatal issues (missing entities, missing images, invalid bindings) as warnings in the UI.

  > **Current state:** The frontend surfaces save and import validation errors inline.
  > A consolidated warning center remains post-alpha work.

- [x] **Release & versioning hygiene (HACS compatibility)**
  - Public GitHub release history starts with `v0.1.0`; documentation maintenance
    is released as `v0.1.1`.
  - `manifest.json`, `const.py`, and `frontend/package.json` are synchronized at `0.1.1`.
  - HACS and Hassfest validation are required for every release commit.
  - Public release history is maintained in the repository-root `CHANGELOG.md` and
    user-facing release notes are published with each matching GitHub release.

---

#### 7. Live data, performance & robustness (PRD 7, 9, 12, 14–15)

- [x] **State subscription / frontend state updates**
  - Subscribe to relevant entity states via HA frontend APIs or dedicated WebSocket.
  - Feed state changes into overlay rendering.

  > **Implementation hint:** Use `hass.connection.subscribeEvents()` or subscribe to
  > `state_changed` events. The `HassConnection` interface is already typed.

- [x] **Performance tuning (alpha baseline)**
  - Ensure smooth behavior with ~50 areas and ~200 markers:
    - Efficient Konva layer updating,
    - Batching/throttling updates to 1–2 Hz.

  > **Recommendation:** Use separate Konva layers for static (areas) vs dynamic (overlays) content.
  > Only redraw the overlay layer on state changes.

- [x] **Missing resources handling (alpha baseline)**
  - Gracefully handle:
    - Removed entities (markers become "missing" but stay in layout).
    - Devices without areas (still placeable markers).
    - Background image dimensions changing (optional rescale tool).

---

#### 8. Permissions, i18n, and polish

- [x] **Permissions**
  - Restrict Edit mode to HA admins/config users.
  - Allow View mode for all users (configurable).

  > **Implementation hint:** Check `hass.user.is_admin` before showing edit controls.
  > Panel is registered with `require_admin=False` - good for view access.

- [ ] **Internationalization**
  - Prepare strings for i18n (EN/DE), aligned with HA's translation system.

  > **Note:** All UI strings are currently hardcoded in English.
  > HA uses JSON translation files - will need `translations/en.json`, `translations/de.json`.

- [ ] **General UX polishing**
  - Undo/redo (nice-to-have for v1.1).
  - Keyboard shortcuts for common actions in the editor.
  - Contextual tooltips and inline help.

- [x] **UI-based integration setup**
  - Implement a minimal `config_flow.py` so the integration can be added from the HA UI.
  - Set `"config_flow": true` in `manifest.json` once the flow exists.
  - Keep YAML-based configuration (`floorplan_ui:`) working as a fallback.

---

### Development history

The canonical user-facing release history lives in [`../CHANGELOG.md`](../CHANGELOG.md).
This table retains the earlier implementation-level commit history.

| Date | Commit | Changes |
|------|--------|---------|
| 2026-07-30 | `v0.1.1` | **Documentation and release metadata** - public changelog, HACS release policy, current implementation status, and synchronized `0.1.1` version labels |
| 2026-07-30 | `5012ea1` (`v0.1.0`) | **First public HACS alpha** - admin-only editing, UI config flow, bundled frontend, strict validation/migration, marker placement and live values, view filters, tests, CI and HACS metadata |
| 2026-01-27 | `bec8768` | **UI-based integration setup** - implemented `config_flow.py` for HA UI integration setup |
| 2026-01-27 | `b9d7e7d` | **Area management enhancements** - clear selection on canvas click, area binding UI, delete confirmation |
| 2026-01-27 | `adc1477` | **Basic areas editor** - added HACS metadata and areas editing foundation |
| 2026-01-27 | `7d5a8ba` | **Area shapes & rendering** - dedicated areas layer, rectangle tool, HA area loading, selection & dragging |
| 2026-01-27 | `a407022` | **Config validation & normalization** - server-side validation in `save_config`, comprehensive normalization with defaults, error reporting to client |
| 2026-01-27 | `62fafdf` | Documentation updates for multi-plan management |
| 2026-01-27 | `06da594` | Multi-plan management (select, rename, delete), image error handling |
| 2026-01-27 | `ee0404f` | Agent configuration metadata |
| 2026-01-27 | `c6a951f` | Initial project structure and task list |
| 2026-01-27 | `a6a6a20` | Initial commit with full M1 foundation |

---

### Milestone Summary

| Milestone | Status | Key Commits |
|-----------|--------|-------------|
| **M1: Hello Floorplan** | ✅ **COMPLETE** | `a6a6a20`, `06da594`, `a407022` |
| **M2: Area Shapes** | ✅ **ALPHA BASELINE COMPLETE** (rectangles, polygons, resize, vertex editing, binding and styles) | `7d5a8ba`, `adc1477`, `b9d7e7d`, `5012ea1` |
| **M3: Markers** | ✅ **ALPHA BASELINE COMPLETE** (palette, drag-and-drop, editing, live values and More-Info; arbitrary MDI rendering remains) | `5012ea1` |
| **M4: Views** | ✅ **ALPHA BASELINE COMPLETE** (CRUD, reorder, default and filters; view styling remains) | `5012ea1` |
| **M5: Overlays** | ✅ **ALPHA BASELINE COMPLETE** (marker values, area overlays and conditional badges) | `5012ea1` |
| **M6: Export/Import** | ✅ **ALPHA BASELINE COMPLETE** (export, pre-flight validation, preview, import and migrations) | `a407022`, `5012ea1` |
| **M8: Polish** | 🔶 Partial (UI setup, authorization, tests and CI ✅; i18n, undo/redo and broader UX polish remain) | `bec8768`, `5012ea1` |
