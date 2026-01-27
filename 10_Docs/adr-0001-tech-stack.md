# ADR-0001: Tech Stack Selection

**Status:** Accepted  
**Date:** 2026-01-27  
**Deciders:** Project Owner  

## Context

The Floorplan UI project requires a tech stack that supports:
- Canvas-based editing (polygon drawing, drag-and-drop markers)
- Smooth pan/zoom interactions
- Real-time updates from Home Assistant
- Fast, intuitive user experience

## Decision

### Frontend Rendering: Konva.js

**Chosen:** Konva.js over SVG overlay

**Rationale:**
- Superior performance for complex scenes (50+ areas, 200+ markers)
- Built-in support for drag-and-drop, hit detection, and transformations
- Native pan/zoom with momentum scrolling
- Polygon/shape editing primitives out of the box
- Better suited for gaming-style interactions (what a floorplan editor essentially is)
- Large community and extensive documentation

**Trade-offs:**
- Text rendering slightly less crisp than SVG (mitigated by modern high-DPI displays)
- Accessibility requires manual implementation (acceptable for editor-focused tool)

### Frontend Language: TypeScript

**Chosen:** TypeScript over JavaScript

**Rationale:**
- Strong typing catches errors at compile time, critical for complex state management
- Better IDE support (autocomplete, refactoring) speeds up development
- Self-documenting code through type definitions
- Home Assistant frontend ecosystem uses TypeScript
- Konva has excellent TypeScript definitions

### Package Manager: pnpm

**Chosen:** pnpm over npm/yarn/bun

**Rationale:**
- Fastest install times due to content-addressable storage
- Strict dependency resolution prevents phantom dependencies
- Disk space efficient (shared packages across projects)
- Compatible with all npm packages
- Mature and stable (unlike bun which is still evolving)

### Build Tool: Vite

**Chosen:** Vite for frontend bundling

**Rationale:**
- Near-instant hot module replacement (HMR)
- Native TypeScript support without configuration
- Optimized production builds with Rollup
- Simple configuration
- Standard choice for modern frontend projects

### Backend: Home Assistant Custom Component (Python)

**Chosen:** As specified in PRD

**Rationale:**
- Required for HACS distribution
- WebSocket API for real-time communication
- HA Storage API for persistence
- Python is HA's native language

## Consequences

### Positive
- Fast, responsive editing experience
- Type safety reduces runtime errors
- Modern tooling speeds up development
- Consistent with HA ecosystem conventions

### Negative
- Konva requires learning curve for developers unfamiliar with canvas APIs
- TypeScript adds compilation step (mitigated by Vite's speed)
- pnpm less familiar than npm for some contributors

## References

- [Konva.js Documentation](https://konvajs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [pnpm Documentation](https://pnpm.io/)
- [Vite Documentation](https://vitejs.dev/)
- [Home Assistant Developer Docs](https://developers.home-assistant.io/)
