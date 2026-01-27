## Floorplan UI – Implementation Status & Task List

### Current implementation status (Jan 2026)

- **Backend (Home Assistant custom component)**
  - ✅ `floorplan_ui` custom component exists with `manifest.json` and can be loaded by Home Assistant.
  - ✅ Panel registration in `async_setup`:
    - Registers a custom panel at `/floorplan-ui` using the `floorplan-ui-panel` web component.
    - Serves the JS bundle from `/local/floorplan-ui/floorplan-ui.js`.
  - ✅ Storage:
    - `FloorplanStore` implemented using HA's `Store` helper with versioning.
    - Default config structure matches PRD root: `version`, `plans` (list), `views` (list).
    - Default views provided: `all`, `heating`, `lights`, `network` with basic filter stubs.
    - Read/write operations for the full config blob implemented (`async_get_config`, `async_update_config`).
  - ✅ Configuration validation & normalization:
    - `_validate_config_structure()` validates top-level structure (version, plans, views types).
    - `_normalize_config()` fills missing/invalid fields with sensible defaults.
    - Invalid configs on load are reset to defaults with warning logs.
    - `save_config` WebSocket returns `invalid_config` error for malformed data.
  - ✅ WebSocket API:
    - `floorplan_ui/get_config` returns stored configuration.
    - `floorplan_ui/save_config` persists provided configuration (with validation).
    - `floorplan_ui/list_registry` returns areas and entities (with optional domain/area filters) from HA registries.
  - ⬜ No explicit migrations between schema versions yet.
  - ⬜ No `floorplan_ui/validate` WebSocket command for pre-flight validation.

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
  - ⬜ No Area shape drawing/editing (rect/polygon) or binding to HA Areas.
  - ⬜ No entity palette, marker placement/editing, tags, or click → HA More-Info integration.
  - ⬜ No view-based filtering/rendering logic (views are UI tabs only).
  - ⬜ No overlays (primary/secondary values, badges), aggregates, or live state subscriptions.
  - ⬜ No export/import of configuration as external JSON files.
  - ⬜ No dedicated validation/warning UI (backend validates, but frontend doesn't display errors).

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
  > - **Potential improvements (non-blocking):**
  >   - Consider adding validation for individual area/marker objects when those features are implemented
  >   - Could add a `floorplan_ui/validate` WebSocket command for dry-run validation
  >   - Frontend doesn't yet display validation errors to the user (see M6 Warning UX task)

- [x] **Resilience to missing/invalid images** ✅ _Completed in commit `06da594` (2026-01-27)_
  - ~~Handle broken `background.url` (404, missing data).~~
  - ~~Provide a way to re-upload/replace floorplan images from the UI.~~

  > **Review notes (2026-01-27):**
  > - `_drawImageErrorState()` provides clear visual feedback with actionable hint.
  > - Both `onerror` callback and try/catch around `draw()` ensure robustness.
  > - Error state uses distinct orange color scheme (#fff3e0, #e65100) for visibility.
  > - Good: Users can re-upload via the existing "Upload Image" button in edit mode.

---

#### 2. Area shapes & Area binding (Milestone 2, PRD 8.3, 11.3)

> **Review notes (2026-01-27):**
> - This is the logical next milestone now that M1 is complete.
> - TypeScript types for `AreaShape` already exist in `home-assistant.ts` - good foundation.
> - Backend normalization already handles `areas` as a list - ready for data.
> - Recommend: Create a dedicated `shapes-layer` in Konva separate from `background-layer`.
> - Consider: Start with rectangles only (simpler), then add polygon support.

- [ ] **Canvas shape toolbox**
  - Add edit-mode tools to create rectangles and polygons on the Konva stage.
  - Support selection, dragging, resizing (rect), and vertex manipulation (polygon).

  > **Recommendation:** Use Konva's built-in `Transformer` for rect resize handles.
  > Polygon vertex editing will need custom anchor points.

- [ ] **Area binding to HA Areas**
  - Use `floorplan_ui/list_registry` to fetch areas.
  - Add a properties panel to bind a drawn shape to a specific `area_id`.

  > **Note:** The `list_registry` WebSocket API is already implemented and returns areas.
  > Frontend just needs to call it and display a dropdown/picker.

- [ ] **Area style configuration**
  - Store and edit `AreaShape.style` properties (fill, stroke, opacity, etc.).
  - Respect these styles at render time; ensure they are per-plan as described in PRD.

- [ ] **Area shape persistence**
  - Extend backend config model to include `areas` with fields from PRD section 11.3.
  - Ensure round-trip between UI edits and stored config.

  > **Note:** Backend already supports arbitrary config structure and normalizes `areas` to a list.
  > Frontend `Plan.areas` is typed as `AreaShape[]` - ready for use.
  > Consider adding area-level validation in `_normalize_config()` when implementing.

---

#### 3. Marker placement & entity mapping (Milestone 3, PRD 8.4, 11.4)

- [ ] **Entity palette / explorer**
  - Build a left-side palette using `floorplan_ui/list_registry` results:
    - Areas, devices, and entities with filters (domain, area, text search).
  - Support drag-and-drop of entities from the palette onto the canvas.

  > **Recommendation:** Consider using HA's native entity picker component if available,
  > or build a filterable list with virtualization for large entity counts.

- [ ] **Marker model and rendering**
  - Implement `Marker` data model per PRD (entity_id, pos, icon, label_mode, tags, bind).
  - Render markers on Konva with icons and labels; support repositioning in Edit mode.

  > **Note:** TypeScript `Marker` interface already defined in `home-assistant.ts`.
  > Backend normalization already handles `markers` as a list.
  > Will need MDI icon rendering - consider using `@mdi/js` package or HA's icon system.

- [ ] **Marker configuration panel**
  - Add right-side properties panel for a selected marker:
    - Select icon (mdi), label mode, tags, primary/secondary value bindings.

- [ ] **HA More-Info integration**
  - On marker click in View mode, open the standard HA More-Info dialog for the entity.

  > **Implementation hint:** HA exposes `fire(this, "hass-more-info", { entityId })` event.

---

#### 4. Views / Pages (Milestone 4, PRD 8.5, 11.5)

- [ ] **View management UI**
  - Implement CRUD for views (create, rename, delete, reorder).
  - Allow choosing a default view.

  > **Note:** View tabs already render in toolbar. Need to add management UI in edit mode.
  > Backend normalization preserves existing views or falls back to defaults.

- [ ] **Filter behavior**
  - Implement filtering logic based on view `filters`:
    - Domains whitelist,
    - Tags whitelist,
    - Optional area whitelist.
  - Hide/show markers and/or areas based on the current view.

  > **Current state:** View tabs exist but are purely cosmetic - no filtering implemented.

- [ ] **View-level styling hooks**
  - Extend config model to support optional `View.style` and integrate with rendering (e.g., dim non-selected areas).

---

#### 5. Overlays & rules (Milestone 5, PRD 8.6, 11.6–11.7)

- [ ] **ValueSpec implementation**
  - Implement `ValueSpec` resolution on frontend:
    - From entity state or attribute.
    - Apply simple formatting rules.

- [ ] **Marker overlays**
  - Display primary and optional secondary values on markers per current view.
  - Throttle updates to 1–2 Hz as per non-functional requirements.

- [ ] **Area overlays**
  - Implement `area_overlay` rendering for primary/secondary values on Area shapes.

- [ ] **Badges and rules**
  - Implement `BadgeSpec` evaluation (e.g., `when.state_is`).
  - Render badges on areas/markers when rules match.

---

#### 6. Export/Import, validation & migrations (Milestone 6, PRD 8.7, 11.1–11.7)

- [ ] **JSON export/import**
  - Provide UI actions to export the full config as JSON.
  - Provide an import flow with:
    - Schema validation,
    - Version checks,
    - Preview/confirmation UI.

  > **Note:** Backend validation/normalization is now in place - import can leverage this.
  > Consider showing normalization warnings to user during import preview.

- [ ] **Storage versioning & migrations**
  - Introduce explicit migration steps for new schema versions.
  - Ensure old stored configs are upgraded safely on load.

  > **Note:** `FloorplanStore` uses `STORAGE_VERSION` constant but no migration logic exists yet.
  > Current normalization approach handles missing fields gracefully, which helps with forward compatibility.

- [ ] **Warning & validation UX**
  - Surface non-fatal issues (missing entities, missing images, invalid bindings) as warnings in the UI.

  > **Note (2026-01-27):** Backend now validates and returns `invalid_config` errors.
  > Frontend needs to catch these errors and display user-friendly messages.
  > Consider a toast/snackbar notification system for transient warnings.

- [ ] **Release & versioning hygiene (HACS compatibility)**
  - Create a GitHub release (e.g. tag `v0.1.0`) pointing at the current stable commit.
  - Keep `manifest.json`'s `"version": "0.1.0"` in sync with that tag for future releases.

---

#### 7. Live data, performance & robustness (PRD 7, 9, 12, 14–15)

- [ ] **State subscription**
  - Subscribe to relevant entity states via HA frontend APIs or dedicated WebSocket.
  - Feed state changes into overlay rendering.

  > **Implementation hint:** Use `hass.connection.subscribeEvents()` or subscribe to
  > `state_changed` events. The `HassConnection` interface is already typed.

- [ ] **Performance tuning**
  - Ensure smooth behavior with ~50 areas and ~200 markers:
    - Efficient Konva layer updating,
    - Batching/throttling updates to 1–2 Hz.

  > **Recommendation:** Use separate Konva layers for static (areas) vs dynamic (overlays) content.
  > Only redraw the overlay layer on state changes.

- [ ] **Missing resources handling**
  - Gracefully handle:
    - Removed entities (markers become "missing" but stay in layout).
    - Devices without areas (still placeable markers).
    - Background image dimensions changing (optional rescale tool).

---

#### 8. Permissions, i18n, and polish

- [ ] **Permissions**
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

---

### Changelog

| Date | Commit | Changes |
|------|--------|---------|
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
| **M2: Area Shapes** | ⬜ Not started | - |
| **M3: Markers** | ⬜ Not started | - |
| **M4: Views** | ⬜ Not started | - |
| **M5: Overlays** | ⬜ Not started | - |
| **M6: Export/Import** | 🔶 Partial (validation backend ready) | `a407022` |
