# PRD – Home Assistant HACS Erweiterung „Floorplan UI“ (Domain-agnostisch)
*Version:* 0.2 (Update)  
*Datum:* 2026-01-27  
*Ziel:* Ein UI-Editor für Raumpläne (Grundriss) mit grafischer Zuordnung von Home Assistant Areas und visueller Platzierung von **beliebigen** Devices/Entities inkl. Live-Overlays.  
*Scope v1:* Visualisierung & Mapping (kein „Automation-Generator“ als Pflicht).

---

## 1. Problem / Motivation
Home Assistant kennt *Areas*, *Devices* und *Entities*, aber räumliche Darstellung fehlt: keine Positionen, kein „Haus-Überblick“, Overlays sind in Dashboards oft nur Listen/Kacheln.

Nutzer wollen:
- einen Grundriss importieren,
- Areas als Zonen darauf markieren,
- Geräte/Entities an realen Positionen platzieren,
- je nach Thema („Heizung“, „Licht“, „Netzwerk“, „Entertainment“) unterschiedliche Overlays/Filter nutzen.

---

## 2. Ziele (Goals)
1. **Grundriss-Import** (v1: PNG/JPG; v2: optional SVG).
2. **Grafische Area-Zuordnung**: Flächen zeichnen (Polygon/Rect) und an HA Areas binden.
3. **Entity/Device Platzierung**: Drag & Drop Marker, Icon/Label/Werte definieren.
4. **Views/Pages**: Umschaltbare Ansichten mit Filtern & Overlay-Regeln (z.B. Heizung/Licht/Netzwerk).
5. **Live-Overlays**:
   - pro Area: frei konfigurierbare Kennzahlen/Badges (z.B. Ist/Soll, „x Lichter an“, „Internet down“).
   - pro Marker: primary/secondary value.
6. **View-Modus vs. Edit-Modus** (Lock).
7. **Speicherung** des Layouts in HA Storage, robust über Neustarts/Updates.
8. **Export/Import** des Layouts als JSON (Backup/Restore).

---

## 3. Nicht-Ziele (Non-Goals)
- Keine Pflicht-Implementierung von Heizungsregelung, Automations-Generator, PID etc. (kann später optional als „Addon“).
- Keine Grundriss-Erstellung (nur Import).
- Kein Multi-User-Edit-Locking/Collaboration in v1.
- Keine externe Cloud.

---

## 4. Zielgruppe / Personas
- **HA Power User**: Viele Devices, will „Digital Twin“-Übersicht fürs ganze Haus.
- **Familien-Admin**: Will schnelle „Hauslage“ – was ist an/aus/online/warm.

---

## 5. Begriffe / Konzepte
### 5.1 Plan
Ein importierter Grundriss (eine Etage/Ansicht) mit Canvas-Koordinatensystem.

### 5.2 Area Shape
Eine gezeichnete Fläche (Polygon/Rect) auf dem Plan, gebunden an eine HA Area.

### 5.3 Marker
Ein platzierter Punkt (oder Icon) auf dem Plan, gebunden an eine Entity (oder Device → Entity-Auswahl).

### 5.4 View (Page)
Eine Umschalt-Ansicht, die bestimmt:
- Welche Marker sichtbar sind (Filter nach Domain/Tags/Area),
- Welche Werte/Badges angezeigt werden,
- Wie Areas/Marker gerendert werden (Overlay-Regeln).

### 5.5 Tags
App-interne Labels pro Marker (und optional pro Area Shape), um unabhängig von HA-Domains zu filtern:
- Beispiel: `["heating"]`, `["network"]`, `["lights"]`.

---

## 6. Nutzerstories (User Stories)
1. Nutzer importiert einen PNG-Grundriss und sieht ihn als Canvas.
2. Nutzer zeichnet „Wohnzimmer“ als Polygon und wählt HA Area „Wohnzimmer“.
3. Nutzer zieht `climate.wohnzimmer` auf den Plan und positioniert es.
4. Nutzer taggt den Marker mit `heating`.
5. Nutzer wechselt zur View „Heizung“ und sieht Ist/Soll im Wohnzimmer + Fenster-offen Badge.
6. Nutzer wechselt zur View „Licht“ und sieht „2 Lichter an“ im Wohnzimmer + Lampen-Marker.
7. Klick auf Marker öffnet HA More-Info.
8. Nutzer exportiert das Layout als JSON und importiert es auf einem neuen HA.

---

## 7. UX / UI Konzepte
### 7.1 Modi
- **Edit Mode**
  - Zeichnen/Anpassen von Area Shapes.
  - Marker platzieren, verschieben, konfigurieren (Icon/Label/Values/Tags).
  - View-Editor (Filter + Overlay-Regeln).
- **View Mode**
  - Pan/Zoom, Klick-Interaktionen, Live-Daten.
  - Keine Layout-Änderung.

### 7.2 Layout-Editor (Panel)
- Oben: View-Switcher (Tabs/Dropdown), Edit/View Toggle.
- Links: Explorer/Palette (Areas, Devices, Entities; Suche/Filter).
- Mitte: Canvas (Grundriss + Overlay-Layer).
- Rechts: Properties (selektierte Area/Marker/View).

### 7.3 Interaktionen (MVP)
- Pan/Zoom (Pflicht).
- Selektion (Area/Marker).
- Drag & Drop (Marker).
- Polygon editieren (Vertices ziehen).
- Undo/Redo (nice-to-have v1.1).

---

## 8. Funktionale Anforderungen
### 8.1 Daten-Import aus Home Assistant
- Lesen:
  - Areas (area_registry),
  - Devices (device_registry),
  - Entities (entity_registry),
  - Live States.
- Filter:
  - Domain (climate/light/switch/media_player/device_tracker/sensor/binary_sensor…),
  - Area,
  - Textsuche.

### 8.2 Plan-Management
- Mehrere Pläne (Etagen): `plan_id`, Name, Hintergrundbild, optional Maße.
- Plan wechseln.

### 8.3 Area Shapes
- Formen:
  - v1: Polygon + Rect.
- Binding:
  - `area_id` (HA).
- Styling:
  - Fill/Stroke/Opacity (View-abhängig optional).

### 8.4 Marker (Entities)
- Marker ist primär an `entity_id` gebunden (für Live-Werte).
- Eigenschaften:
  - `pos` (x,y in Plan-Pixeln),
  - `icon` (mdi),
  - `label_mode` (off/short/full/auto),
  - `tags` (Multi-select),
  - `bind` (primary/secondary value mapping).
- Klick:
  - Öffnet HA More-Info für die Entity.

### 8.5 Views / Pages
- Nutzer kann Views erstellen/bearbeiten/löschen.
- View definiert:
  1) **Filter**
     - Domains (Whitelist),
     - Tags (Whitelist),
     - optional Area-Whitelist.
  2) **Area Overlays**
     - Primary/Secondary (Entity + Attribut oder State),
     - Badges (liste von Regeln).
  3) **Marker Overlays**
     - Primary/Secondary (Attr/State),
     - optional Einheit/Format.
- Default Views (v1 Presets):
  - Heizung, Licht, Netzwerk, Entertainment, „Alles“.

### 8.6 Overlays / Regeln (MVP pragmatisch)
- **Value Source** kann sein:
  - Entity state,
  - Entity attribute (z.B. `temperature`, `current_temperature`, `hvac_action`),
  - simple aggregate (count on/off) innerhalb einer Area (v1.1 optional).
- Badges:
  - Ein Badge wird angezeigt, wenn eine Entity in einem Zustand ist (z.B. `binary_sensor.window` == `on`).

### 8.7 Speicherung / Backup
- Persistenz in HA Storage via Store.
- Export/Import als JSON (mit Schema-Version).

### 8.8 Rechte / Security
- Edit Mode nur für Admin/Config (konfigurierbar).
- View Mode für alle (optional).

---

## 9. Nicht-funktionale Anforderungen
- Performance: flüssig bei ~50 Areas, ~200 Markern.
- State-Updates throttlen (UI max 1–2 Hz pro Marker-Overlay).
- Robust gegen entfernte Entities (Marker als „missing“).
- Lokal/offline: keine externen Calls.
- i18n vorbereitet (DE/EN).

---

## 10. Technische Architektur (High-Level)
### 10.1 Frontend
- HA Custom Panel (Editor-first).
- Rendering:
  - v1 Empfehlung: **Konva.js** (Canvas) *oder* SVG Overlay über Image.
- Datenfluss:
  - WS für Config/Registry,
  - subscribe_states für Live updates (oder HA store).

### 10.2 Backend (Custom Component)
- Config Entry
- WebSocket Commands:
  - `floorplan_ui/get_config`
  - `floorplan_ui/save_config`
  - `floorplan_ui/list_registry`
  - optional `floorplan_ui/validate` (sanity checks)
- Storage:
  - Versionierung + Migrationspfad.

---

## 11. Datenmodell (v1 Vorschlag)
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

## 12. Edge Cases
- Entity gelöscht → Marker bleibt, wird „missing“.
- Device ohne Area → trotzdem platzierbar.
- Hintergrundbild Größe ändert sich → optional „rescale to new size“ Tool.
- View filtert Marker weg → Marker bleibt im Plan, nur unsichtbar.

---

## 13. Meilensteine (MVP Plan)
### Milestone 1 – „Hello Floorplan“
- Panel lädt Hintergrundbild, Pan/Zoom.
- Plan speichern.

### Milestone 2 – Areas zeichnen & binden
- Polygon/Rect Editor.
- Binding an HA Areas.

### Milestone 3 – Marker platzieren
- Entity-Palette + Drag & Drop.
- Persistenz, Klick → More-Info.
- Tags pro Marker.

### Milestone 4 – Views (Pages)
- View Switcher + Filter (Domain + Tags).
- Default Views (Heizung/Licht/Netzwerk/Entertainment/Alles).

### Milestone 5 – Live Overlays
- Marker primary value (state/attr).
- Area overlay primary/secondary (entity-based).
- Badges (state_is).

### Milestone 6 – Export/Import + Polishing
- JSON Export/Import.
- Edit/View Lock.
- Warnungen/Validierung.

---

## 14. Risiken / Offene Fragen
- Renderer: Konva vs SVG (Konva ist UX-stark fürs Editieren).
- Aggregates pro Area („x Lichter an“) sind beliebt, aber nicht v1 Pflicht (v1.1).
- Permissions/Role-Model in HA: Admin-only für Editor ist am sichersten.

---

## 15. Erfolgskriterien (Success Metrics)
- Nutzer kann in 10–15 Minuten:
  - 1 Plan importieren,
  - 5 Areas zeichnen,
  - 20 Marker platzieren,
  - zwischen 3 Views wechseln,
  - Live-Werte sehen.
- UI bleibt flüssig bei „normaler“ HA-Größe.
- Layout bleibt konsistent nach Neustart/Update.
