# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Floorplan UI** is a Home Assistant HACS extension that provides a floorplan editor for spatial visualization of smart home devices. Users can import floorplans, draw regions mapped to HA Areas, place entity markers at real-world positions, and switch between thematic views (Heating, Lights, Network, etc.) with live overlays.

## Build/Dev Commands

### Frontend (from `frontend/` directory)
```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server with HMR
pnpm build            # Build for production (outputs to dist/)
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm typecheck        # Run TypeScript type checking
pnpm format           # Format code with Prettier
pnpm format:check     # Check formatting
```

### Home Assistant Dev Environment
```bash
docker-compose up -d                    # Start HA container
docker-compose logs -f homeassistant    # View HA logs
docker-compose down                     # Stop HA container
```

HA will be available at `http://localhost:8123`

### Development Workflow
1. Run `pnpm dev` in `frontend/` for hot reload during development
2. Run `pnpm build` to output `frontend/dist/floorplan-ui.js`
3. The dist folder is mounted into HA at `/config/www/floorplan-ui/`
4. Refresh HA browser to pick up changes

## Architecture

### Tech Stack
- **Frontend:** TypeScript + Lit + Konva.js (canvas-based editor)
- **Backend:** Home Assistant Custom Component (Python)
- **Build:** Vite + pnpm
- **Storage:** HA Storage API with schema versioning

See `10_Docs/adr-0001-tech-stack.md` for decision rationale.

### Project Structure
```
├── frontend/                    # Panel UI (TypeScript)
│   ├── src/
│   │   ├── components/         # Lit components
│   │   ├── lib/                # Konva helpers, utilities
│   │   └── types/              # TypeScript definitions
│   └── dist/                   # Build output
├── custom_components/
│   └── floorplan_ui/           # HA backend (Python)
│       ├── __init__.py         # Component setup, panel registration
│       ├── websocket.py        # WebSocket API handlers
│       ├── store.py            # Persistence layer
│       └── const.py            # Constants
├── ha_config/                  # HA config (Docker volume)
└── 10_Docs/                    # Documentation & ADRs
```

### Core Concepts
- **Plan:** Imported floorplan image (PNG/JPG) with canvas coordinates
- **Area Shape:** Polygon/rect region bound to a HA Area
- **Marker:** Entity icon placed at x,y position showing live values
- **View (Page):** Switchable filter configuration (by domain/tags/area) with overlay rules
- **Tags:** Internal labels for filtering independent of HA domains

### WebSocket API
- `floorplan_ui/get_config` - Load saved configuration
- `floorplan_ui/save_config` - Persist configuration
- `floorplan_ui/list_registry` - Get HA areas/entities (with filters)

## Git Workflow

### Branching
- `main` - Always deployable, no direct pushes
- `feature/<name>` - New features
- `bugfix/<name>` - Bug fixes
- `chore/<name>` - Maintenance tasks

### Commits
Follow [Conventional Commits](https://www.conventionalcommits.org/):
```
feat: add polygon editor for area shapes
fix: correct marker position persistence
docs: update API documentation
```

## Architecture Boundaries

### Do Not Touch (without ADR)
- `99_System/.github/` - GitHub templates
- `99_System/skills.allowlist` - Skill governance

### Safe for Autonomous Changes
- `frontend/src/` - Frontend source code
- `custom_components/floorplan_ui/` - Backend source code
- `10_Docs/` - Project documentation

## Project Milestones

1. **Hello Floorplan** - Load image, pan/zoom, save plan
2. **Draw & bind Areas** - Polygon/rect editor, bind to HA Areas
3. **Place markers** - Entity palette, drag & drop, persistence
4. **Views (Pages)** - View switcher, filters, default views
5. **Live overlays** - Marker values, area overlays, badges
6. **Export/Import** - JSON backup/restore, edit/view lock

## Key Files

- `10_Docs/PRD_Floorplan_UI_EN.md` - Full product requirements document
- `10_Docs/adr-0001-tech-stack.md` - Tech stack decision record
- `99_System/docs/workflow/git-github-workflow.md` - Git conventions
