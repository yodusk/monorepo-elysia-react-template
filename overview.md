# Project Overview

Monorepo template using **Elysia** (Bun) for the backend and **React** (Vite) for the frontend, managed with **Bun workspaces**.

```
.
├── apps/
│   ├── api/          # Elysia backend
│   └── web/          # React SPA (Vite)
├── packages/
│   ├── commons/      # Shared types & typed API client
│   └── migrations/   # Plain SQL migration runner
└── (root configs)
```

---

## apps/api

```
src/
├── index.ts          # Server entry, graceful shutdown
├── app.ts            # Elysia app: CORS, logging middleware, routes
├── index.test.ts     # Endpoint tests
├── logger.ts         # Pino logger + AsyncLocalStorage request context
├── logging.ts        # Elysia middleware: request IDs, req/res logging
├── db/
│   ├── client.ts     # Kysely client (PostgresDialect + pg Pool)
│   └── index.ts      # Re-exports db
├── clients/          # External API clients
├── controllers/      # HTTP controllers (route handlers)
├── models/           # Domain models / types
├── repositories/     # Data access layer (DB queries)
├── useCases/         # Business logic
└── utils/            # Pure helpers
```

| Directory       | What goes here                                                    |
| --------------- | ----------------------------------------------------------------- |
| `db/`           | Database client setup. Types auto-generated via `kysely-codegen`. |
| `clients/`      | Wrappers for external services the API calls.                     |
| `controllers/`  | Parse input, call use cases, return responses.                    |
| `models/`       | Domain models, types, and interfaces.                             |
| `repositories/` | Database queries. One repository per domain entity.               |
| `useCases/`     | Core business logic. Orchestrates repositories and clients.       |
| `utils/`        | Pure helper functions.                                            |

---

## apps/web

```
src/
├── main.tsx              # App bootstrap, router creation
├── logger.ts             # Pino logger for browser
├── vite-env.d.ts         # Vite client types
├── routeTree.gen.ts      # Auto-generated route tree (gitignored)
├── pages/
│   ├── __root.tsx        # Root layout (Outlet + devtools)
│   └── index.tsx         # Home page
├── api/                  # Query hooks & request wrappers (Eden client)
├── components/
│   ├── ui/               # Reusable primitives (buttons, inputs, badges)
│   ├── layouts/          # Shells, sidebars, navbars
│   └── pages/            # Complex page-level compositions
├── data/                 # Data fetching, models, atoms, constants
└── utils/                # Pure helpers
```

| Directory             | What goes here                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------- |
| `pages/`              | TanStack Router file-based routes. `__root.tsx` is root layout; `index.tsx` maps to `/`.    |
| `api/`                | Typed API call functions and query hooks wrapping the Eden client.                          |
| `components/ui/`      | Generic, reusable UI primitives — not tied to any domain.                                   |
| `components/layouts/` | Page shells, navigation — structural components.                                            |
| `components/pages/`   | Page compositions combining multiple components. Hooks that serve components live here too. |
| `data/`               | Data fetching logic, models, atoms (state), constants, static data.                         |
| `utils/`              | Pure utility functions — no React, no side effects.                                         |

---

## packages/commons

```
src/
└── index.ts    # createApiClient (Eden Treaty typed with App from @apps/api)
```

End-to-end type safety between backend and frontend. Shared types and the typed API client.

---

## packages/migrations

```
src/
├── index.ts    # Package entry
└── run.ts      # Migration runner: reads sql/, tracks in _migrations table
sql/
└── 0001_create_example.sql
```

Plain SQL files in `sql/`, numbered sequentially (`0001_`, `0002_`, ...). Each runs in a transaction.

---

## Root Configuration

| File                 | Purpose                                                                                        |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| `package.json`       | Workspace root — scripts for dev, test, lint, format, typecheck, db commands                   |
| `tsconfig.base.json` | Base TS config (strict, ES2022, path aliases: `@apps/api`, `@commons`, `@packages/migrations`) |
| `.oxlintrc.json`     | Lint rules — no `console.log`, no magic numbers, strict TS, React best practices               |
| `.oxfmtrc.json`      | Formatting — 100 char width, 2 spaces, single quotes, trailing commas                          |
| `.husky/pre-commit`  | Pre-commit hook: lint-staged + typecheck                                                       |

---

## Key Conventions

- **TypeScript everywhere**, strict mode.
- **Structured logging** via pino — `console.log` banned by lint.
- **Typed API client** — Eden Treaty for full type safety from Elysia to React.
- **Database** — Kysely + PostgreSQL (`pg`). Types via `kysely-codegen`.
- **Migrations** — plain SQL, not ORM-managed.
- **Testing** — backend only (Vitest).
- **Pre-commit** — husky runs lint-staged and typecheck.

## Commands

| Command               | What it does                           |
| --------------------- | -------------------------------------- |
| `bun install`         | Install all dependencies               |
| `bun run dev:api`     | Start API dev server (port 3000)       |
| `bun run dev:web`     | Start web dev server (port 5173)       |
| `bun run typecheck`   | Typecheck all packages                 |
| `bun run lint`        | Lint all packages                      |
| `bun run test`        | Run backend tests                      |
| `bun run db:migrate`  | Run pending SQL migrations             |
| `bun run db:generate` | Regenerate Kysely types from DB schema |
