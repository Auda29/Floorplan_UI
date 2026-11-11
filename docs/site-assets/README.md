# Project website

GitHub Pages serves `docs/` from `main`. German is
`index.html`; English is `en.html`. Both use `site.css`, `language.js` and
`site.js`. Edit both HTML files when changing copy or links. No build step,
external fonts, analytics, runtime dependencies or external image requests are used.

## Sources and illustrations

- `icon.svg`: unchanged copy of `custom_components/floorplan_ui/brand/icon.svg`.

The floorplan is an authored SVG illustration with synthetic room values. The switch only updates a local browser example; it never connects to Home Assistant.

Initial copy and downloads were checked against repository documentation and the
published `v0.2.0-beta.4` release on 2026-11-11. Keep prerelease
labels and compatibility limits aligned with future release changes.
