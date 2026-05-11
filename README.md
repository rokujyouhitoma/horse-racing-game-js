# 🏇 horse-racing-game-js

A browser-based horse racing board game built with vanilla JavaScript.

## 🎮 Demo

[Play here](https://rokujyouhitoma.github.io/horse-racing-game-js/)

## Overview

A digital implementation of a horse racing card game. Players use play cards (Step, Rank, Dash) to advance their horses along the racetrack. The game features a custom JavaScript engine with a main game loop, scene management, an event system, and a seeded random number generator.

## Features

- **Game Engine** — Fixed-interval update loop with variable-rate rendering and FPS display
- **Scene Management** — Scene/SceneDirector system with OnEnter/OnExit/OnPause/OnResume lifecycle hooks
- **Event System** — DOM Level 2–inspired event system (Event, EventTarget, EventListener)
- **Play Cards** — Three card types: Step (advance a horse), Rank (adjust position), Dash (special move)
- **Master Data** — Structured master data with a relationship checker and stub loader
- **Seeded RNG** — Xorshift-based random number generator for reproducible randomness
- **Template Engine** — JavaScript port of Python's Tornado template engine for HTML rendering
- **Undo Support** — Undo the last played card during a race

## Project Structure

```
horse-racing-game-js/
├── src/          # Source files
├── tools/        # Build tools
├── index.html    # Entry point
├── compiled.html # Compiled output
├── Makefile      # Build configuration
└── memo-ja.md    # Development notes (Japanese)
```

## Getting Started

### Prerequisites

- [Closure Compiler](https://developers.google.com/closure/compiler) (for building)
- A modern web browser

### Running Locally

Open `index.html` directly in a browser, or serve it with any static file server:

```bash
# Example with Python
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

### Building

```bash
make
```

The compiled output will be written to `compiled.html`.

## Game Rules

- Each player controls a horse on the racetrack
- On your turn, draw a card from the deck and add it to your hand
- Play one card from your hand to apply its effect
- **Step cards** advance a horse by a fixed number of steps
- **Rank cards** adjust the position of a horse by rank
- **Dash cards** apply special movement effects
- The race ends when finishing conditions are met

## Architecture

The engine follows a component-based design:

- `Engine` — Main loop, update/render cycle
- `SceneDirector` — Manages scene transitions and state
- `Repository` — Data query system (find-by-id style)
- `Locator` — Service locator for singleton instances
- `Publisher` — Observer pattern for decoupled communication
- `Router / Matcher` — URL-based dispatcher with `window.history` support
- `Template` — Lightweight HTML template engine

## License

See repository for details.
