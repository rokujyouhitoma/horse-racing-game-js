# [ADR-02] Custom DOM-like Event System Implementation

* **Date**: 2017-04-26 (Initial architecture), documented 2026-06-13
* **Status**: Accepted
* **Author**: Development Team

---

## Context

In a complex single-page board game, decoupling game logic (computations, card playing, rules verification) from rendering (canvas or DOM-based layout layers) is essential for maintainability. 

Using native browser events (e.g., `CustomEvent` or DOM dispatchers) forces game models to be tied directly to DOM elements. This limits code execution in non-browser environments (like server-side simulations or test suites) and mixes concerns.

We need a flexible, pure-JS observer/messaging pattern that supports:
1. Event propagation (bubbling/capturing) to mimic browser behaviors where children bubble events to parents.
2. High-performance event lookup and dispatching.
3. Clean memory cleanup (preventing memory leaks from dangling listener references).

## Decision

We decided to custom-implement a pure JavaScript event propagation framework (`ExEvent`, `ExEventTarget`, `ExEventListener`) modeled after the W3C DOM Level 2 Events specification.

Key details:
- **`ExEventTarget`**: Replicates native `addEventListener`, `removeEventListener`, and `dispatchEvent` patterns.
- **Propagation Loop**: Implements both the capturing phase and bubbling phase up a custom logical hierarchy of game objects.
- **High-Performance Map**: Optimized event search/lookup algorithm down to $O(1)$ by grouping listeners by channel/type instead of a simple linear search array.

## Consequences

### Benefits (Pros):
- **Decoupled Architecture**: Logic components can communicate via events without knowing about the existence of visual layers or DOM hierarchies.
- **DOM Independence**: The event engine works in pure Node.js/V8 environments (facilitating headless automated testing).
- **Hierarchical Propagation**: Game objects (e.g., `Lane` -> `Racetrack` -> `Race`) can automatically bubble states without needing direct cross-references.

### Trade-offs (Cons):
- **Implementation overhead**: Adds standard boilerplate for standard class structures.
- **Mental model shift**: Developers must learn the custom `ExEvent` lifecycles and ensure event bubblers are cleaned up properly to avoid memory leakage.
