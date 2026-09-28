# Changelog

All notable user-facing changes to Floorplan UI are documented in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
release versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Make confirmation dialogs truly modal, preserve their deletion targets, and
  allow Enter on Cancel to cancel rather than confirm a destructive action.
- Recover damaged legacy image backgrounds individually while preserving plans,
  markers, and a copy of the original configuration in `floorplan_ui.config.recovery`.
- Honor marker tap actions (`more-info`, `toggle`, and `none`) for mouse, touch,
  and keyboard activation, and validate marker fields against the schema contract.
- Validate uploads on the server before browser decoding and handle malformed
  upload responses with understandable errors.

- Preserve fractional background dimensions across saves and restarts, normalize
  missing view filters, and reject malformed IDs with configuration errors.
- Ignore stale in-flight save results after reloading configuration.
- Start image garbage-collection retention when assets become unreferenced, keep
  that timestamp across restarts, and serialize collection with uploads.
- Restore large portable backups with a 128 MB file limit, validate metadata
  before uploading images, and deduplicate image transfers. Use authenticated
  image requests so long-lived panels can still load and export backgrounds.
- Refresh marker interactions when entering or leaving Edit mode and support
  touch taps on markers, areas, and the empty canvas.
- Recreate the canvas after conflict reloads and restore the active plan on Undo.
- Preserve pan and zoom when adding areas, honor zoom limits on initial fit, and
  render per-view marker values and conditional badges during live updates.
- Align the HACS minimum Home Assistant version and README release link.

## [0.2.0-beta.3] - 2026-08-04

### Fixed

- Preserve native HTML drag-and-drop while adding a pointer-based fallback so
  markers can be placed reliably with mouse, touch, pen, and embedded browser
  WebViews. Touch users can still scroll the entity palette with a swipe and
  place a marker by briefly holding before dragging.

## [0.2.0-beta.2] - 2026-08-04

### Fixed

- Replace the full-width editor rows with a theme-aware, responsive side panel so
  editing no longer washes out labels, pushes the canvas below the controls, or
  causes horizontal overflow. Group advanced plan, view, and overlay settings in
  keyboard-accessible disclosure sections while preserving 44 px narrow-mode
  touch targets.

## [0.2.0-beta.1] - 2026-08-04

### Beta hardening

- Validate legacy container structure before migration and reject damaged imports
  as controlled `invalid_config` errors without mutating submitted data.
- Fully decode PNG/JPEG uploads with Pillow and enforce MIME, format, file-size,
  dimension, pixel-count, and decompression-bomb limits outside Home Assistant's
  event loop, without decoding legacy data URLs twice.
- Stream request bodies with a hard 4 MB limit instead of reading unbounded
  uploads into memory.
- Add reference-aware asset garbage collection with managed filename checks, a
  seven-day grace period, post-save ordering, and per-file fault isolation.
- Add a Draft 2020-12 configuration schema and generate central TypeScript
  configuration types from it, with backend-aligned asset, binding, marker, and
  bounded even-length polygon contracts.
- Add EN/DE localization, responsive narrow-mode touch targets, pinch zoom,
  keyboard actions, live regions, focus states, and an accessible canvas list.

### Tests and CI

- Expand backend regression coverage for malformed migrations, complete image
  decoding, bounded uploads, asset references, and garbage-collection ordering.
- Add component-level panel and Konva tests for permissions, upload/save/reload,
  filters, actions, geometry paths, and touch zoom.
- Add a real Chromium production-bundle smoke covering upload, save, edit, and
  remount/reload.
- Add pinned Python development dependencies, Ruff, Mypy, branch-aware coverage
  with a 55% baseline gate, coverage artifacts, schema-drift checks, and pinned
  GitHub Action commits.

### Changed

- Extract configuration migration/model logic from the backend store and move
  editor, dialog, style, stage, and rendering responsibilities out of the panel
  incrementally while retaining configuration compatibility.
- Publish the hardened foundation as the first `0.2.0` beta prerelease after
  independent review and successful minimum/current Home Assistant CI runs.

## [0.1.2] - 2026-07-31

### Added

- Add undo/redo history and a serialized autosave queue with pending, saving,
  failed, retry, and conflict states.
- Add real Home Assistant integration tests for setup, authorization,
  revision conflicts, and image upload validation on minimum and current HA.

### Changed

- Store floorplan images as private content-addressed files and keep only their
  asset references in the versioned configuration. Existing Base64 images are
  migrated automatically.
- Keep JSON backups portable by embedding image data during export and
  restoring it through the authenticated upload endpoint during import.
- Split configuration, asset transfer, save queue, plan, area, view, marker,
  dialogs, styles, and Konva stage/rendering concerns into dedicated frontend
  modules.
- Replace native browser prompt/confirm calls with in-panel dialogs and make
  stage initialization deterministic.
- Strip dependency console calls from the production bundle.

### Security

- Enforce image MIME type, file signature, and size limits on the backend.
- Reject external background URLs and require local private image assets.
- Detect stale configuration writes with monotonic revisions instead of
  silently accepting last-write-wins updates.
- Remove unnecessary privileged mode from the development container.

## [0.1.1] - 2026-07-30

Documentation and release-metadata maintenance release. There are no functional
changes to the floorplan editor in this version.

### Changed

- Add a public changelog and link it from the HACS-facing README.
- Document how public alpha releases and opt-in prereleases are published for HACS.
- Reconcile the implementation task list and milestone summary with the released
  alpha functionality and explicitly retain the remaining post-alpha work.
- Synchronize integration, frontend, and exported-backup version labels at `0.1.1`.

## [0.1.0] - 2026-07-30

First public, HACS-installable alpha release.

### Added

- Import PNG and JPEG floorplans and manage multiple plans.
- Draw, move, resize, style, and bind rectangular and polygonal areas.
- Search and filter the Home Assistant entity registry, then add markers by
  selection or drag-and-drop.
- Configure live primary and secondary marker values from entity states or
  attributes and open the native Home Assistant More-Info dialog.
- Create, rename, reorder, select a default, and delete filtered views.
- Display live area values and state-conditioned badges.
- Export the complete configuration to JSON and validate, preview, and import
  it again.
- Store versioned configuration through the Home Assistant Storage API,
  including migration from schema version 1 to version 2.
- Install the bundled integration through a custom HACS repository.

### Security

- Restrict configuration writes, registry access, validation, and editor tools
  to Home Assistant administrators while keeping view mode available to other
  authenticated users.
- Validate imported images and configuration payload sizes.

### Compatibility

- Require Home Assistant 2025.7.0 or newer.
- Mark this release as an initial-development alpha; back up the Home Assistant
  configuration before testing with production data.

[Unreleased]: https://github.com/Auda29/Floorplan_UI/compare/v0.2.0-beta.3...HEAD
[0.2.0-beta.1]: https://github.com/Auda29/Floorplan_UI/compare/v0.1.2...v0.2.0-beta.1
[0.1.2]: https://github.com/Auda29/Floorplan_UI/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/Auda29/Floorplan_UI/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Auda29/Floorplan_UI/releases/tag/v0.1.0
