# [ADR-01] Vanilla JavaScript Architecture Adoption

* **Date**: 2017-04-17 (Initial architecture), documented 2026-06-13
* **Status**: Accepted
* **Author**: Development Team

---

## Context

We need to build a web-based horse racing board game that runs efficiently across various devices, including mobile web browsers with potentially poor network connectivity or limited memory capacity. 

Modern web development often defaults to single-page application (SPA) frameworks like React, Vue, or Angular. However, these frameworks introduce:
1. Significant initial JS payload size overhead (often several hundred kilobytes or megabytes).
2. Complex build toolchains (Webpack, Vite, npm packaging).
3. Runtime performance cost on low-spec devices due to virtual DOM diffing and framework lifecycle execution.

The core requirement of this game is a lightweight, responsive, reproducible, and easily portable implementation.

## Decision

We decided to use pure **Vanilla JavaScript (ES6)**, standard **HTML5**, and vanilla **CSS3** without any external SPA frameworks or dependencies. 

Key details:
- Standard DOM manipulation is used.
- A custom game engine loop controls updates and rendering manually.
- No heavy npm-based bundling or compilation is used for the application running; only Google Closure Compiler is utilized optionally via a simple `Makefile` to minify the final output size.
- Standard browser technologies (`requestAnimationFrame`, `window.history`, `localStorage`) are preferred.

## Consequences

### Benefits (Pros):
- **Ultra-lightweight footprint**: The compiled main JavaScript is under 150KB, ensuring sub-second load times on mobile 3G.
- **Zero build system dependencies**: Developers can run and play the game by opening `index.html` directly in a browser (or serving with a basic HTTP server), without performing `npm install`.
- **Framework neutrality**: The logic is highly portable to other environments, such as embedding in desktop wrappers (Electron) or compiling to mobile webviews.
- **Maximum performance control**: Direct control over the main loop and drawing processes eliminates unpredictable framework overhead.

### Trade-offs (Cons):
- **Boilerplate code**: Common features provided by frameworks (routing, state-to-DOM binding, custom events) had to be built from scratch.
- **High coupling risk**: Without framework patterns, rendering components can easily become tightly coupled to game models if not strictly disciplined.
