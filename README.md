<!-- Project README -->
# Hat — Photo Editor

A small React + TypeScript photo editor demo used as a minimal app showcase and playground.

> Lightweight single-page app with a small PhotoEditor component at its core.

## Quick overview

- **Framework:** React 19 + TypeScript
- **Build tooling:** Create React App (`react-scripts`) with Bun-friendly scripts
- **Styling:** Tailwind CSS (configured) and `styled-components`

## Features

- Simple photo editing UI (see `src/components/PhotoEditor/PhotoEditor.tsx`)
- Local development server, production build and deploy scripts

## Getting started

Prerequisites

- Node 18+ (npm/yarn) or Bun

Install dependencies

```bash
# bun
bun install

# or with Bun
bun install
```

Run development server

```bash
bun start
# or
bun run start
```

Build for production

```bash
bun run build
# or
bun run build
```

Run tests

```bash
bun test
# or
bun run test
```

Type-check and lint

```bash
bun run typecheck
bun run lint
bun run format
```

## Scripts

Key scripts are defined in `package.json`:

- `start` — start dev server
- `build` — production build
- `test` — run tests
- `format` — run Prettier
- `typecheck` — `tsc --noEmit`
- `lint` / `lint:fix` — ESLint checks and auto-fix

## Project structure

- [src](src) — application source
  - [src/App.tsx](src/App.tsx) — app entry component
  - [src/index.tsx](src/index.tsx) — React bootstrap
  - [src/components/PhotoEditor/PhotoEditor.tsx](src/components/PhotoEditor/PhotoEditor.tsx) — main feature
- [public](public) — static assets and HTML
- [package.json](package.json) — scripts and deps

## Development notes

- The project was scaffolded with Create React App and is configured to work with Bun.
- Use the `prebuild` script to run formatting, type checks and lint fixes before building.

## Where to look next

- UI: [src/components/PhotoEditor/PhotoEditor.tsx](src/components/PhotoEditor/PhotoEditor.tsx)
- App entry: [src/App.tsx](src/App.tsx)
- Config / scripts: [package.json](package.json)

If you'd like, I can add a short demo GIF/screenshot to the README or expand the developer notes with local debugging tips.
