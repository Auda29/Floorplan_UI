# Changelog

All notable user-facing changes to Floorplan UI are documented in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
release versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/Auda29/Floorplan_UI/compare/v0.1.2...HEAD
[0.1.2]: https://github.com/Auda29/Floorplan_UI/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/Auda29/Floorplan_UI/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Auda29/Floorplan_UI/releases/tag/v0.1.0
