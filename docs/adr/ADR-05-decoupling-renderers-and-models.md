# [ADR-05] Decoupling Renderers and Models via Pub/Sub Event-Driven Architecture

* **Date**: 2026-06-14
* **Status**: Accepted
* **Author**: Development Team

---

## Context

Visual rendering layers such as `RacetrackLayer` and `OddsTableLayer` directly accessed the active scene controller (`RaceDirector`) via the global `Game.SceneDirector` and pulled the race models (`racetrack`, `oddstable`) directly from its properties to perform redraws.

This coupled design introduced several structural issues:
1. **Tight Coupling**: The rendering layers (View) were fully dependent on a specific scene configuration (the existence of `RaceDirector`), making it difficult to reuse them in other scenes or standalone debug/testing contexts.
2. **Opaque Data Flow**: It was unclear when models changed and when rendering occurred. The layers directly accessed models on every frame update event (`Events.Game.OnUpdate`), which created risks of stale states and unnecessary processing overhead.
3. **Barrier to Multiplayer/Network Extensions**: Because the controllers and views were tied directly in local memory, moving to an architecture where data is fetched or updated from a server-side source was difficult.

## Decision

To lower the coupling between the rendering layers and the controller/model layer, and to establish a unidirectional event-driven data flow, we made the following architectural changes:

1. **Introduce Event-Driven Updates**:
   * Defined a dedicated state-change event: `Events.Race.OnChanged`.
   * The controller (`RaceDirector`) publishes `Events.Race.OnChanged` with the current model state as a payload (`{ race, racetrack, oddstable }`) during its scene entry (`OnEnter`) and frame updates (`OnUpdate`).
2. **Remove View Layer Dependencies**:
   * Removed all direct references to `Game.SceneDirector` or `RaceDirector` from `RacetrackLayer` and `OddsTableLayer`.
   * The layers now subscribe to `Events.Race.OnChanged` and update their interfaces using only the properties received inside `e.payload.racetrack` and `e.payload.oddstable`.
3. **Safe Async DOM Resolution**:
   * Inside layers that construct and replace DOM structures asynchronously (like `OddsTableLayer`), we deferred the resolution and removal of the old table element to within the command execution closure rather than evaluating it immediately. This prevents referencing detached elements during execution.

## Consequences

- **Decoupled View Architecture**: Rendering layers are now fully independent. They can run and render in any scene or testing context as long as they receive the expected event payload.
- **Unidirectional Data Flow**: The flow `Model/Controller -> Event -> View` is clearly established, making state changes and drawing cycles easy to debug and track.
- **Type Safety Maintained**: The refactored code successfully compiles under Google Closure Compiler (with `ADVANCED_OPTIMIZATIONS`) with zero warnings and zero errors.
