# PRD – Home Assistant HACS Extension “Floorplan UI” (Domain-agnostic)
*Version:* 0.2 (EN translation)  
*Date:* 2026-01-27  
*Goal:* A floorplan editor for Home Assistant that lets users map HA Areas to drawn regions and place **any** devices/entities on their real-world locations, with configurable live overlays.  
*V1 scope:* Visualization & mapping (no mandatory automation/rule generation).

---

## 1. Problem / Motivation
Home Assistant has *Areas*, *Devices*, and *Entities*, but spatial visualization is typically missing: no real positioning, no “whole house” view, and overlays are often limited to lists/tiles.

Users want to:
- import a floorplan,
- mark Areas as regions on it,
- place sensors/actuators/media/network devices where they actually are,
- switch between thematic perspectives (“Heating”, “Lights”, “Network”, “Entertainment”) with different filters/overlays.

---

## 2. Goals
1. **Floorplan import** (v1: PNG/JPG; v2: optional SVG).
2. **Graphical Area mapping**: draw shapes (polygon/rect) and bind them to HA Areas.
3. **Entity placement**: drag & drop markers with configurable icon/label/value display.
4. **Views/Pages**: switchable perspectives with filters and overlay rules.
5. **Live overlays**:
   - per Area: configurable KPIs/badges (e.g., current/target temp, “x lights on”, “internet down”).
   - per marker: primary/secondary values.
6. **View mode vs Edit mode** (lock).
7. **Persistence** in HA Storage across restarts/updates.
8. **Export/Import** layout as JSON (backup/restore).

---

## 3. Non-goals
- No mandatory heating control logic, automation generators, PID, schedules in v1 (could be an optional addon later).
- No floorplan creation (import only).
- No multi-user collaborative editing/locking in v1.
- No external cloud services.

---

## 4. Target users / Personas
- **HA power users**: many devices; want a “digital twin” overview.
- **Home admin**: wants a quick “house status” glance (on/off/online/warm).

---

## 5. Terms / Concepts
### 5.1 Plan
An imported floorplan (a level) with a canvas coordinate system.

### 5.2 Area Shape
A drawn region (polygon/rect) on the plan, bound to a HA Area.

### 5.3 Marker
A placed icon/point bound to an entity (or device → entity selection) for live values.

### 5.4 View (Page)
A switchable configuration that defines:
- which markers are visible (filters by domain/tags/area),
- which values/badges are shown,
- how Areas/markers are rendered (overlay rules).

### 5.5 Tags
App-internal labels per marker (and optionally per Area shape) to filter independently from HA domains:
- examples: `["heating"]`, `["network"]`, `["lights"]`.

---

## 6. User stories
1. As a user, I import a PNG floorplan and see it as a canvas.
2. I draw the “Living room” region and select the matching HA Area.
3. I drag `climate.living_room` onto the plan and place it at the correct wall.
4. I tag that marker as `heating`.
5. I switch to the “Heating” view and see current/target temperature + “window open” badge.
6. I switch to the “Lights” view and see “2 lights on” in the room + lamp markers.
7. Clicking a marker opens the native HA More-Info dialog.
8. I export the layout to JSON and import it on another HA instance.

---

## 7. UX / UI concepts
### 7.1 Modes
- **Edit Mode**
  - Create/edit area shapes.
  - Place/move/configure markers (icon/label/values/tags).
  - Create/edit views (filters + overlay rules).
- **View Mode**
  - Pan/zoom, click interactions, live data.
  - No layout changes.

### 7.2 Editor layout (Panel)
- Top: view switcher (tabs/dropdown), edit/view toggle.
- Left: explorer/palette (Areas, Devices, Entities; search/filter).
- Center: canvas (floorplan + overlay layer).
- Right: properties (selected Area/marker/view).

### 7.3 Interactions (MVP)
- Pan/zoom (required).
- Select Area/marker.
- Drag & drop markers.
- Polygon editing (move vertices).
- Undo/redo (nice-to-have v1.1).

---

## 8. Functional requirements
### 8.1 Read data from Home Assistant
- Read:
  - Areas (area_registry),
  - Devices (device_registry),
  - Entities (entity_registry),
  - Live states.
- Filters:
  - by domain (climate/light/switch/media_player/device_tracker/sensor/binary_sensor…),
  - by Area,
  - text search.

### 8.2 Plan management
- Multiple plans (levels): `plan_id`, name, background image, optional dimensions.
- Switch plan.

### 8.3 Area shapes
- Shapes:
  - v1: polygon + rect.
- Binding:
  - `area_id` (HA).
- Styling:
  - fill/stroke/opacity (optionally view-dependent later).

### 8.4 Markers (Entities)
- Markers primarily bind to `entity_id` (for live values).
- Properties:
  - position (x,y in plan pixels),
  - icon (mdi),
  - label mode (off/short/full/auto),
  - tags (multi-select),
  - bindings for value extraction (state/attribute).
- Click:
  - opens HA More-Info.

### 8.5 Views / Pages
- Users can create/edit/delete views.
- A view defines:
  1) **Filters**
     - domains whitelist,
     - tags whitelist,
     - optional area whitelist.
  2) **Area overlays**
     - primary/secondary value specs,
     - badges (rule list).
  3) **Marker overlays**
     - primary/secondary value specs.
- Default views (v1 presets):
  - Heating, Lights, Network, Entertainment, “All”.

### 8.6 Overlays / rules (MVP pragmatic)
- **Value source** can be:
  - entity state,
  - entity attribute (e.g. `temperature`, `current_temperature`, `hvac_action`),
  - simple aggregates (count on/off) within an Area (optional v1.1).
- Badges:
  - show a badge if an entity matches a state (e.g. `binary_sensor.window` == `on`).

### 8.7 Persistence / backup
- Persist to HA storage via Store.
- Export/import JSON with schema versioning.

### 8.8 Permissions / security
- Edit mode restricted to admin/config users (configurable).
- View mode available to all (optional).

---

## 9. Non-functional requirements
- Performance: smooth with ~50 Areas and ~200 markers.
- Throttle state updates (UI max 1–2 Hz for overlay rendering).
- Robust to removed entities (marker becomes “missing”).
- Local/offline only (no external calls).
- i18n-ready (EN/DE).

---

## 10. Technical architecture (high-level)
### 10.1 Frontend
- HA Custom Panel (editor-first).
- Rendering:
  - v1 recommendation: **Konva.js** (canvas) or SVG overlay over image.
- Data flow:
  - WebSocket for config/registry,
  - subscribe_states for live updates (or HA frontend store).

### 10.2 Backend (custom component)
- Config Entry
- WebSocket commands:
  - `floorplan_ui/get_config`
  - `floorplan_ui/save_config`
  - `floorplan_ui/list_registry`
  - optional `floorplan_ui/validate` (sanity checks)
- Storage:
  - versioning + migrations.

---

## 11. Data model (v1 proposal)
### 11.1 Root
- `version`: int
- `plans`: list[Plan]
- `views`: list[View]

### 11.2 Plan
- `plan_id`: str
- `name`: str
- `background`: { `type`, `url`, `width`, `height` }
- `areas`: list[AreaShape]
- `markers`: list[Marker]
- `view`: { `minZoom`, `maxZoom` }

### 11.3 AreaShape
- `id`: str (internal)
- `area_id`: str (HA)
- `shape`: { `type`: "rect"|"polygon", ... }
- `tags`: list[str] (optional)
- `style`: { fillOpacity, strokeWidth, ... }

### 11.4 Marker
- `id`: str (internal)
- `entity_id`: str
- `pos`: { x:int, y:int }
- `icon`: str
- `label_mode`: "off"|"short"|"full"|"auto"
- `tags`: list[str]
- `bind`:
  - `primary`: { `source`: "state"|"attr", `attr`?: str, `format`?: str }
  - `secondary`: { ... } (optional)

### 11.5 View
- `id`: str
- `name`: str
- `filters`:
  - `domains`?: list[str]
  - `tags`?: list[str]
  - `area_ids`?: list[str]
- `area_overlay`:
  - `primary`?: ValueSpec
  - `secondary`?: ValueSpec
  - `badges`?: list[BadgeSpec]
- `marker_overlay`:
  - `primary`?: ValueSpec
  - `secondary`?: ValueSpec
- `style`?: { optional view-level styling }

### 11.6 ValueSpec (MVP)
- `mode`: "entity"
- `entity_id`: str
- `source`: "state"|"attr"
- `attr`?: str
- `format`?: str

### 11.7 BadgeSpec (MVP)
- `entity_id`: str
- `when`:
  - `state_is`: str
- `icon`?: str
- `label`?: str

---

## 12. Edge cases
- Entity removed → marker remains, becomes “missing”.
- Device without Area → still placeable.
- Background image resized → optional “rescale to new size” tool.
- View filters a marker out → marker remains in plan, just hidden.

---

## 13. Milestones (MVP plan)
### Milestone 1 – “Hello Floorplan”
- Load background image, pan/zoom.
- Save plan.

### Milestone 2 – Draw & bind Areas
- Polygon/rect editor.
- Bind to HA Areas.

### Milestone 3 – Place markers
- Entity palette + drag & drop.
- Persistence, click → More-Info.
- Tags per marker.

### Milestone 4 – Views (Pages)
- View switcher + filters (domain + tags).
- Default views (Heating/Lights/Network/Entertainment/All).

### Milestone 5 – Live overlays
- Marker primary value (state/attr).
- Area overlay primary/secondary (entity-based).
- Badges (state_is).

### Milestone 6 – Export/Import + polishing
- JSON export/import.
- Edit/view lock.
- Warnings/validation.

---

## 14. Risks / open questions
- Renderer choice: Konva vs SVG (Konva is very strong for editing UX).
- Per-area aggregates (“x lights on”) are popular but not mandatory for v1 (v1.1).
- Permissions/roles in HA: admin-only for editing is safest.

---

## 15. Success criteria
- Within 10–15 minutes a user can:
  - import 1 plan,
  - draw 5 Areas,
  - place 20 markers,
  - switch between 3 views,
  - see live values.
- UI stays smooth for typical HA setups.
- Layout remains consistent across restarts/updates.
