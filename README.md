# Floorplan UI

[Website (DE)](https://auda29.github.io/Floorplan_UI/) · [Website (EN)](https://auda29.github.io/Floorplan_UI/en.html)

Floorplan UI is a local-first Home Assistant custom integration for mapping Home
Assistant areas and entities onto 2D floorplans (PNG, JPEG, or SVG) and 3D models (GLB). It adds a
sidebar panel with separate view and admin-only edit modes.

> Current HACS release: `0.4.0`.

## Current capabilities

- Import and manage multiple floorplans. Replace a plan image while preserving
  the relative positions of its areas and markers.
- Pan and zoom the canvas.
- Add, move, resize, and style rectangular areas; add, move, and vertex-edit
  polygonal areas; bind both to HA Areas and tags.
- Search and filter the HA entity registry, then choose an entity and click or tap
  its position on the plan. Drag-and-drop and keyboard placement are also available.
- Move, configure, and remove markers, including primary/secondary state or
  attribute bindings and formatting.
- Display live entity states and activate markers with mouse, touch, or keyboard.
  Marker actions support the native HA More-Info dialog, entity toggling, or no action.
- Create, rename, reorder, select a default, and delete views; filter markers
  and areas by domain, tag, or HA Area.
- Show live area and per-view marker values and state-conditioned badges with updates throttled to
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

### Working with 2D and 3D plans

Mix images and self-contained binary glTF 2.0 models (`.glb`) in one installation.
The 2D canvas downloads 0 KB of Three.js. Opening a 3D plan loads the Three.js
viewport on demand. Orbit the model, use an isometric, top-down, front, or
perspective camera, and save camera presets for individual plans and views.
The viewport renders on demand and supports optional shadows. Live `light.*`
states control room lighting and floor glow.

Place or drag markers directly on model surfaces. Bind a room to a mesh or
position a 3D anchor for its overlay. Select a Material Design Icon (`mdi:*`)
in the Marker Inspector to use its SVG path on the 2D canvas or 3D overlay.

### Room summaries and editor tools

A room bound to a Home Assistant Area can show how many lights are on or windows
are open, or the average temperature. Choose `count_on`, `count_open`, `count`,
`avg`, `min`, `max`, or `sum`. Narrow the entities by domain or device class,
choose an attribute for numeric values, and set the display format. Viewer mode
uses configured marker area assignments because the HA registry is admin-only.
Assign markers to the appropriate areas to include them in viewers’ summaries.

Use `View.style` to dim inactive rooms or highlight active rooms per view in
both 2D and 3D. The virtualized entity library lets administrators scroll through
large registries. Contextual tooltips and inline help explain editor controls.
Open the **Warning Center** in Edit mode to jump to missing or unavailable
entities, unbound or missing areas, invalid attribute bindings, missing
backgrounds, or missing 3D meshes.

## Installation with HACS

1. Add `https://github.com/Auda29/Floorplan_UI` as a custom HACS repository of
   type **Integration**.
2. Install **Floorplan UI 0.4.0** from HACS and restart Home Assistant.
3. Open **Settings → Devices & services → Add integration** and select
   **Floorplan UI**.
4. Open **Floorplan** from the sidebar. An administrator can upload the first
   floorplan directly from the empty panel. Select **Edit** to add areas and
   markers. Other users can use the view and its marker actions within their
   Home Assistant permissions.

All runtime files, including the compiled panel bundle, live inside
`custom_components/floorplan_ui/`, so no manual `/config/www` copy is required.

Minimum supported Home Assistant version: **2025.7.3**. CI additionally checks a
current Home Assistant/Python combination.

### Updating to 0.4.0

Update through HACS, restart Home Assistant, and reload the Floorplan panel.
Configurations from schema versions 1–3 migrate automatically to version 4,
preserving existing plans and asset references. In the editor, **Library** lists entities, **Inspector** shows the
selected object, and **Settings** contains plan, view, and backup controls.
When replacing a plan image, use the same framing if you want areas and markers
to line up with the original drawing.

Portable JSON backups may now be up to **128 MB**, including embedded images;
configuration metadata remains limited to **20 MB**, and each image to **4 MB**.
Image retention starts when an asset becomes unreferenced, so deleting an older
plan no longer immediately removes the image needed for Undo.

### Marker actions and overlays

Select a marker in Edit mode and use **When tapped** to choose entity details,
toggle, or no action. The same action applies to mouse clicks, touch taps, and the
keyboard-accessible object list. Edit mode selects markers instead of executing
their actions. Toggle requests use Home Assistant's normal service permissions.

A view's `marker_overlay` can supply primary/secondary values and conditional
badges. These update with entity state changes, just like `area_overlay` values.

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

The build writes the entry `floorplan-ui.js` and lazy `chunks/` to
`custom_components/floorplan_ui/frontend/`. Deploy the whole directory. The Playwright smoke
loads that real production bundle in Chromium and exercises upload, save, edit,
remount/reload, touch and keyboard actions, modal confirmations, conflict recovery,
and Undo. Docker mounts the entire `custom_components` directory and
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
[`v0.4.0`](https://github.com/Auda29/Floorplan_UI/releases/tag/v0.4.0).

Versions below `1.0.0` represent initial development and may contain breaking
changes. HACS offers `0.4.0` through its normal release channel.

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

- **Frontend:** TypeScript and Lit with Konva for 2D and a Vite-split Three.js viewport for 3D
- **Backend:** Home Assistant custom integration and WebSocket API
- **Storage:** Home Assistant Storage API for small, revisioned schema v4 configuration
  documents plus private content-addressed images and GLB models below `.storage`
- **Distribution:** HACS custom integration; no cloud dependency

The product requirements and architectural decisions are documented under
[`10_Docs`](10_Docs/).

## Security

The panel itself is available in view mode to authenticated Home Assistant users.
Configured marker toggles use Home Assistant service authorization. Saving
configuration, uploading images, and reading the full Area/Entity
registries require an administrator connection. Upload request bodies are read in
bounded chunks, with a 4 MB limit for PNG, JPEG, and SVG, and a 25 MB limit
for GLB. Pure-Python GLB validation checks the header, chunk bounds, and JSON
size and rejects external buffer and image URIs. SVG validation in pure Python
rejects DOCTYPE/ENTITY, scripts, foreignObject, event handlers, and external or
active URLs. SVGs are served with a sandboxed Content Security Policy.
Pillow fully decodes PNG and JPEG uploads and rejects MIME/format mismatches, truncated files, decompression bombs,
dimensions above 16,384 × 16,384, and images above 64 million pixels.
CPU-intensive image decoding and hashing run outside Home Assistant's event loop.

Images and models are private content-addressed assets with exact 64-character lowercase
SHA-256 IDs. Garbage collection only considers managed asset files, keeps
referenced assets, applies a seven-day grace period starting when an asset becomes
unreferenced, and runs only after successful configuration persistence. One
deletion failure cannot roll back or abort a save.
Configuration writes use revision checks to prevent one administrator tab from
silently overwriting another; the complete persisted configuration is limited to
20 MB. Polygon shapes are limited to 1,000 coordinate pairs and must contain a
complete sequence of x/y pairs.

Portable JSON exports embed referenced PNG, JPEG, and SVG images. Import
restores them to the private asset store. GLB models retain content-addressed
references in the JSON. When moving to a new instance, keep the original GLB
files available to restore missing models. Portable
backup files support up to 128 MB to accommodate 20 images with base64 overhead;
configuration metadata still has a 20 MB limit. Metadata is validated and migrated
before images are uploaded, and shared images are transferred only once per operation.
Supported migrations work on copies rather than mutating the submitted object.

When loading an older configuration with damaged embedded images, only the invalid
backgrounds are removed; plans, areas, markers, and usable images are retained.
Before saving that recovery, the original configuration is backed up in
`.storage/floorplan_ui.config.recovery`. The Home Assistant log identifies affected
plans, whose backgrounds can then be replaced.

Report security or functional issues through the repository's
[issue tracker](https://github.com/Auda29/Floorplan_UI/issues).

## License

Floorplan UI is available under the [MIT License](LICENSE).
