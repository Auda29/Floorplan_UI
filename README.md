# Floorplan UI

Floorplan UI is a local-first Home Assistant custom integration for mapping Home
Assistant areas and entities onto an imported PNG or JPEG floorplan. It adds a
sidebar panel with separate view and admin-only edit modes.

> **Status:** first testable alpha (`0.1.0`). Back up your Home Assistant configuration
> before testing it with production data.

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

The `0.1.0` scope is intentionally an alpha: undo/redo, localization, touch-first
editor polish, aggregate area calculations, and a dedicated warning center remain
planned work. Missing or unavailable entities remain visible with an unavailable
value and neutral marker color.

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

Minimum supported Home Assistant version: **2025.7.0**.

## Local development

Requirements: Node.js 22+, pnpm 11.9, Docker with Compose.

```text
cd frontend
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
cd ..
docker compose up -d
```

The build writes the deployable bundle to
`custom_components/floorplan_ui/frontend/floorplan-ui.js`. Docker mounts the
entire `custom_components` directory and exposes Home Assistant on
`http://localhost:8124`.

Backend checks use only the bundled Python standard library:

```text
python -m unittest discover -s tests
python -m compileall -q custom_components/floorplan_ui
```

## Release checklist

1. Run all frontend and backend checks.
2. Build and commit the generated frontend bundle.
3. Keep the versions in `frontend/package.json`, `manifest.json`, and
   `const.py` synchronized.
4. Confirm HACS and Hassfest validation in GitHub Actions.
5. Create a matching GitHub release and semantic version tag.

## Architecture

- **Frontend:** TypeScript, Lit, Konva, Vite
- **Backend:** Home Assistant custom integration and WebSocket API
- **Storage:** Home Assistant Storage API with explicit schema migration
- **Distribution:** HACS custom integration; no cloud dependency

The product requirements and architectural decisions are documented under
[`10_Docs`](10_Docs/).

## Security

The panel itself is visible in read-only mode to authenticated Home Assistant
users. Saving configuration and reading the full Area/Entity registries require
an administrator connection. Embedded image uploads are limited to PNG/JPEG and
4 MB per file; the complete persisted configuration is limited to 20 MB.

Report security or functional issues through the repository's
[issue tracker](https://github.com/Auda29/Floorplan_UI/issues).

## License

Floorplan UI is available under the [MIT License](LICENSE).
