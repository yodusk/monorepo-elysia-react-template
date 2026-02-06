---
root: true
targets: ["*"]
description: "Project overview and general development guidelines"
globs: ["**/*"]
---

# Repository agents guide

## Structure

- `apps/api`: Elysia backend (Bun)
- `apps/web`: React SPA (Vite)
- `packages/commons`: shared types and typed API client helper

## Commands

From repo root:

- Install: `bun install`
- Run API dev server: `bun run dev:api`
- Run Web dev server: `bun run dev:web`
- Typecheck all packages: `bun run typecheck`
- Lint: `bun run lint`
- Run backend tests only: `bun run test`

## Conventions

- TypeScript everywhere.
- Prefer sharing types through `packages/commons`.
- Frontend calls backend via a typed client created with `@elysiajs/eden`.
- Keep tests in the backend only (Vitest).
- Use pino logger instead of console.log (no-console rule enforced).