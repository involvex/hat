# Copilot instructions for this repository

This file is intended to help future Copilot sessions (and contributors) quickly find the repository's build/test/lint commands, the high-level architecture, and project-specific conventions.

---

## 1) Build, test, and lint commands

- Install dependencies (local and CI):
  - bun: `bun install`

- Start development server:
  - bun: `bun run start`  # runs react-scripts start

- Build (production):
  - bun: `bun run build`  # runs react-scripts build

- Run the test suite (Jest via react-scripts / React Testing Library):
  - `bun run test` (interactive/watch mode)
  - Run a single test by name/pattern: `bun run test -- -t "renders learn react link"`
  - Run a single test file (path): `bun run test -- src/App.test.tsx`

- Type-checking: `bun run typecheck` (runs `tsc --noEmit`)

- Linting and formatting:
  - Lint (report): `bun run lint`  # runs `eslint src`
  - Lint (auto-fix): `bun run lint:fix`  # runs `eslint src --fix`
  - Format (Prettier): `bun run format`

- Prebuild hooks (what `bun run prebuild` will run):
  - `bun run format && bun run typecheck && bun run lint:fix` (note: these `prebuild` commands invoke `bun` in package.json)

- Deploy (gh-pages):
  - `bun run predeploy` then `bun run deploy` (package.json `deploy` uses `gh-pages -d build`)
  - GitHub Pages workflow: see `.github/workflows/pages.yml` (the workflow uses Bun to install and build and then uploads the built site)

---

## 2) High-level architecture (big picture)

- Framework & Tooling
  - Create React App / `react-scripts` with TypeScript as the primary app scaffold.
  - Entry point: `src/index.tsx` -> renders `src/App.tsx`.
  - Main feature: `src/components/PhotoEditor/PhotoEditor.tsx` (primary UI component in this repo).

- Static assets and hosting
  - `public/` holds the static site entry (`index.html` and assets). The build output (`build/`) is published to GitHub Pages via `gh-pages` and the workflow in `.github/workflows/pages.yml`.

- Styling & UI
  - Tailwind CSS is configured (`tailwind.config.js`) and used alongside `styled-components` (both patterns appear in dependencies).

- Type checking, linting, and formatting
  - TypeScript strict checks are enabled via `tsconfig.json` (strict mode on).
  - ESLint is configured in `eslint.config.mts` (uses `@typescript-eslint`, `eslint-plugin-react`, and custom rules).
  - Prettier is enforced via `bun run format` and `@involvex/prettier-config` is present in devDependencies.

- Tests
  - Tests use React Testing Library + Jest via the `react-scripts test` runner. Test files live under `src/` (e.g. `src/App.test.tsx`).

- CI / Deployment
  - The Pages workflow (`.github/workflows/pages.yml`) installs dependencies with Bun, builds with Bun, then packages via Jekyll and deploys the resulting site to GitHub Pages.

---

## 3) Key conventions and repository-specific notes

- Packaging & installation:
  - The repository contains a `bun.lock` and the GitHub Pages workflow installs dependencies with Bun. CI and local development prefer Bun; some package scripts call `bun run ...`.

- ESLint / TypeScript conventions:
  - `@typescript-eslint/no-unused-vars` is configured to ignore identifiers starting with `_` (args/vars/caught errors). Use a leading underscore for intentionally unused parameters.
  - The repo's lint target is `src` (`eslint src`); prefer editing only under `src` for lint checks.

- Formatting / Prebuild:
  - `bun run format` applies the repository Prettier config. The `prebuild` script (used by CI/pipeline) runs format, typecheck, and lint:fix; running it locally requires Bun because the script uses `bun run ...`.

- Tests
  - `bun run test` runs the Jest-based test runner in watch mode by default. To run a single test, pass a Jest `-t` pattern as shown above.

- Styling
  - Tailwind is active for files under `src/**/*.{js,jsx,ts,tsx}` (see `tailwind.config.js` content globs). The project also uses `styled-components`; follow existing conventions in components for which approach to use.

- Deployment & pages
  - The `homepage` field in `package.json` is set to `https://involvex.github.io/hat` and the Pages workflow publishes from the `build/` directory produced by `react-scripts build`.

- Important files for Copilot to reference (quick map):
  - `package.json` (scripts & dependencies)
  - `tsconfig.json` (TypeScript settings)
  - `eslint.config.mts` (lint rules, unused-var underscore rule)
  - `tailwind.config.js` (tailwind content/theme)
  - `.github/workflows/pages.yml` (how CI installs/builds and deploys)
  - `src/index.tsx`, `src/App.tsx`, `src/components/PhotoEditor/PhotoEditor.tsx` (entry points & main feature)

---

If you want, Copilot sessions can be seeded to prefer these files as authoritative contexts (package.json, tsconfig.json, eslint.config.mts, tailwind.config.js, and the Pages workflow) when making suggestions or generating changes.

---

## Quick checklist for local change verification

- Install deps: `bun install`
- Run `bun run prebuild` (requires Bun) or run the steps locally: `bun run format && bun run typecheck && bun run lint:fix`
- Start dev server: `bun run start`
- Run tests: `bun run test` or `bun run test -- -t "<pattern>"`

---

*Generated by an automated scan of this repository: key files inspected: package.json, tsconfig.json, eslint.config.mts, tailwind.config.js, .github/workflows/pages.yml, src/App.tsx, src/index.tsx, src/App.test.tsx, src/components/PhotoEditor/PhotoEditor.tsx.*
