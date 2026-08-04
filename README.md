# Floorplan UI

Floorplan UI is a local-first Home Assistant custom integration for mapping Home
Assistant areas and entities onto an imported PNG or JPEG floorplan. It adds a
sidebar panel with separate view and admin-only edit modes.

> **Status:** public beta prerelease (current release: `0.2.0-beta.1`).
> Back up production data while testing `0.x` prereleases.

## Current capabilities

- Import and manage multiple floorplans.
- Pan and zoom the canvas.
- Add, move, resize, and style rectangular areas; add, move, and vertex-edit
  polygonal areas; bind both to HA Areas and tags.
- Search and filter the HA entity registry, then add markers by selection or
  drag-and-drop onto the plan.
- Move, configure, and remove markers, including primary/secondary state or
  attribute bindings and formatting.
- Display live entity states and open the native HA More-Info dialog.
- Create, rename, reorder, select a default, and delete views; filter markers
  and areas by domain, tag, or HA Area.
- Show live area values and state-conditioned badges with updates throttled to
  two redraws per second.
- Export the complete versioned configuration to JSON and validate, preview,
  and import it again.
- Persist the versioned configuration through the HA Storage API.
- Keep view mode available to users while restricting all editor writes and
  registry access to Home Assistant administrators.
- Fully decode PNG/JPEG uploads server-side and enforce file, dimension, and
  pixel-count limits before private storage.
- Garbage-collect unreferenced managed assets after successful saves, with a
  seven-day grace period and per-file fault isolation.
- Generate central TypeScript configuration types from a versioned Draft 2020-12
  JSON Schema.
- Localize the central panel/editor UI in English and German according to the
  Home Assistant language.
- Support responsive `narrow` layouts, touch panning and pinch zoom, keyboard
  undo/redo/delete actions, live regions, focus indicators, and an accessible
  canvas object list.

The `0.1.x` scope remains an alpha until the hardened branch has passed its final
GitHub Actions run and independent review and is published as a new release.
Further incremental module decomposition, aggregate area calculations, and a
dedicated warning center remain follow-up work. Missing or unavailable entities
remain visible with an unavailable value and neutral marker color.

## Installation with HACS

1. Add `https://github.com/Auda29/Floorplan_UI` as a custom HACS repository of
   type **Integration**.
2. Install **Floorplan UI** and restart Home Assistant.
3. Open **Settings → Devices & services → Add integration** and select
   **Floorplan UI**.
4. Open **Floorplan** from the sidebar. Administrators can enable Edit mode;
   other users receive the read-only view.

All runtime files, including the compiled panel bundle, live inside
`custom_components/floorplan_ui/`, so no manual `/config/www` copy is required.

Minimum supported Home Assistant version: **2025.7.3**. CI additionally checks a
current Home Assistant/Python combination.

## Local development

Requirements: Node.js 22+, Corepack/pnpm 11.9, Python 3.13+, and Docker with Compose.

```text
python -m pip install -r requirements-dev.txt
ruff check custom_components/floorplan_ui tests tests_ha
ruff format --check custom_components/floorplan_ui tests tests_ha
mypy custom_components/floorplan_ui
coverage run -m unittest discover -s tests
coverage report

cd frontend
corepack pnpm install --frozen-lockfile
corepack pnpm schema:generate
corepack pnpm format:check
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
corepack pnpm exec playwright install --with-deps chromium
corepack pnpm test:e2e
cd ..
docker compose up -d
```

The build writes the deployable bundle to
`custom_components/floorplan_ui/frontend/floorplan-ui.js`. The Playwright smoke
loads that real production bundle in Chromium and exercises upload, save, edit,
and remount/reload. Docker mounts the entire `custom_components` directory and
exposes Home Assistant on `http://localhost:8124`.

CI also rejects schema/type drift and stale committed bundles, uploads unit and
Home Assistant coverage reports, and runs HACS and Hassfest validation. The
machine-readable configuration contract lives at
`schema/floorplan-config.schema.json`; do not edit the generated TypeScript types
manually.

## Releases and changelog

The complete user-facing release history is maintained in
[`CHANGELOG.md`](CHANGELOG.md). HACS obtains available versions and update notes
from the corresponding [GitHub releases](https://github.com/Auda29/Floorplan_UI/releases).
The current public release is
[`v0.2.0-beta.1`](https://github.com/Auda29/Floorplan_UI/releases/tag/v0.2.0-beta.1).

Versions below `1.0.0` represent initial development and may contain breaking
changes. Public `0.x` releases are offered through the normal HACS channel;
experimental builds that should require HACS beta visibility use a semantic
prerelease version such as `0.2.0-beta.1` and are marked as GitHub prereleases.

## Release checklist

1. Add the user-facing changes to `CHANGELOG.md`.
2. Run all frontend and backend checks.
3. Build and commit the generated frontend bundle.
4. Keep the versions in `frontend/package.json`, `manifest.json`, and
   `const.py` synchronized.
5. Confirm HACS and Hassfest validation in GitHub Actions.
6. Create a matching GitHub release and semantic version tag, and copy the
   relevant changelog entry into the GitHub release notes for HACS users.

## Architecture

- **Frontend:** TypeScript, Lit, Konva, Vite
- **Backend:** Home Assistant custom integration and WebSocket API
- **Storage:** Home Assistant Storage API for small, revisioned configuration
  documents plus private content-addressed image files below `.storage`
- **Distribution:** HACS custom integration; no cloud dependency

The product requirements and architectural decisions are documented under
[`10_Docs`](10_Docs/).

## Security

The panel itself is visible in read-only mode to authenticated Home Assistant
users. Saving configuration, uploading images, and reading the full Area/Entity
registries require an administrator connection. Upload request bodies are read in
bounded chunks and rejected above 4 MB. Pillow must fully decode every image as
PNG or JPEG; MIME/format mismatches, truncated files, decompression bombs,
dimensions above 16,384 × 16,384, and images above 64 million pixels are rejected.
CPU-intensive image decoding and hashing run outside Home Assistant's event loop.

Images are private content-addressed assets with exact 64-character lowercase
SHA-256 IDs. Garbage collection only considers managed `.png`/`.jpg` files, keeps
referenced assets, applies a seven-day grace period, and runs only after successful
configuration persistence. One deletion failure cannot roll back or abort a save.
Configuration writes use revision checks to prevent one administrator tab from
silently overwriting another; the complete persisted configuration is limited to
20 MB. Polygon shapes are limited to 1,000 coordinate pairs and must contain a
complete sequence of x/y pairs.

JSON exports remain portable: referenced images are embedded in the downloaded
backup and uploaded into the private asset store again during import. Import data
is structurally validated before migration, and supported migrations work on
copies rather than mutating the submitted object.

Report security or functional issues through the repository's
[issue tracker](https://github.com/Auda29/Floorplan_UI/issues).

## License

Floorplan UI is available under the [MIT License](LICENSE).
