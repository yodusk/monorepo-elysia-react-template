---
root: true
targets: ['*']
description: 'Project overview and general development guidelines'
globs: ['**/*']
---

# Repository agents guide

## Structure

- `apps/api`: Elysia backend (Bun)
  - `src/db/`: Kysely database client (PostgreSQL via `pg`)
  - `src/clients/`: external API clients
  - `src/controllers/`: HTTP controllers (route handlers)
  - `src/models/`: domain models, types, interfaces
  - `src/repositories/`: data access layer (DB queries)
  - `src/useCases/`: business logic
  - `src/utils/`: pure helpers
- `apps/web`: React SPA (Vite)
  - `src/api/`: Eden client instance
  - `src/components/ui/`: shared reusable primitives (buttons, inputs, badges)
  - `src/components/layouts/`: shell and page layout components
  - `src/components/pages/`: complex page-level compositions; component hooks live here too
  - `src/data/`: data fetching atoms, models, state atoms, constants
  - `src/pages/`: file-based routing (TanStack Router)
  - `src/utils/`: pure helpers (formatting, dates, etc.)
- `packages/commons`: shared types and typed API client helper
- `packages/migrations`: plain SQL migration runner
  - `sql/`: migration files (e.g. `0001_create_example.sql`)

## Commands

From repo root:

- Install: `bun install`
- Run API dev server: `bun run dev:api`
- Run Web dev server: `bun run dev:web`
- Typecheck all packages: `bun run typecheck`
- Lint: `bun run lint`
- Run backend tests only: `bun run test`
- Run migrations: `bun run db:migrate`
- Regenerate DB types: `bun run db:generate`

## Conventions

- TypeScript everywhere.
- Prefer sharing types through `packages/commons`.
- Frontend calls backend via a typed client created with `@elysiajs/eden`.
- Keep tests in the backend only (Vitest).
- Use pino logger instead of console.log (no-console rule enforced). See "Backend Logging" section below.
- Database: Kysely with PostgreSQL (`pg` driver). Types auto-generated via `kysely-codegen`.
- Migrations: plain SQL files in `packages/migrations/sql/`, numbered sequentially (e.g. `0001_create_example.sql`).
- Env: copy `apps/api/.env.example` to `apps/api/.env` and set `DATABASE_URL`.
- Routing: TanStack Router with file-based routes in `apps/web/src/pages/`. Route tree is auto-generated (`routeTree.gen.ts`, gitignored).

## Backend Logging

Logging uses **pino** with **AsyncLocalStorage** for automatic request context propagation. The `logging` Elysia plugin (`src/logging.ts`) sets up a per-request child logger with a `requestId`.

**Inside request handlers**, always use `getLogger()` — it returns the child logger bound to the current request (with `requestId` attached automatically). Falls back to the base logger outside of a request context.

```ts
import { getLogger } from './logger'

// Inside a controller/use case/repository during a request:
getLogger().info({ userId }, 'user fetched') // auto-includes requestId
getLogger().error({ err }, 'failed to create order') // auto-includes requestId
```

**Get the current request ID** (e.g. to pass to external services):

```ts
import { getRequestId } from './logger'

const requestId = getRequestId() // string | null
```

**Outside of request context** (startup, migrations, scripts), use the base `logger` directly:

```ts
import { logger } from './logger'

logger.info('server started on port 3000')
```

**Do not** import `logger` and use it inside request handlers — it won't have the `requestId`. Always use `getLogger()` there.

## Frontend Data Fetching

State management uses **Jotai** + **jotai-tanstack-query**. Query/mutation atoms live in `src/data/`. Consume with `useAtomValue` / `useSetAtom`.

Use `resolveStatus` from `src/utils` for discriminated union consumption — never destructure `isLoading`/`error` as separate booleans. Do not put hooks inside resolver callbacks.

### Basic query

```ts
import { atomWithQuery } from 'jotai-tanstack-query'
import { api } from '../api'

export const usersAtom = atomWithQuery(() => ({
  queryKey: ['users'],
  queryFn: async () => {
    const { data, error } = await api.users.get()
    if (error) throw error
    return data
  },
}))
```

### Dependent query (query that needs another atom's value)

```ts
import { atomWithQuery } from 'jotai-tanstack-query'
import { atom } from 'jotai'

export const selectedUserIdAtom = atom<string | null>(null)

export const userDetailAtom = atomWithQuery((get) => {
  const userId = get(selectedUserIdAtom)
  return {
    queryKey: ['user', userId],
    queryFn: async () => {
      const { data, error } = await api.users({ id: userId! }).get()
      if (error) throw error
      return data
    },
    enabled: userId !== null,
  }
})
```

### Polling

```ts
export const notificationsAtom = atomWithQuery(() => ({
  queryKey: ['notifications'],
  queryFn: async () => {
    const { data, error } = await api.notifications.get()
    if (error) throw error
    return data
  },
  refetchInterval: 5000,
}))
```

### Mutation with optimistic update

```ts
import { atomWithMutation, queryClientAtom } from 'jotai-tanstack-query'

export const toggleTodoAtom = atomWithMutation((get) => ({
  mutationFn: async (todo: Todo) => {
    const { data, error } = await api.todos({ id: todo.id }).patch({ done: !todo.done })
    if (error) throw error
    return data
  },
  onMutate: async (todo: Todo) => {
    const queryClient = get(queryClientAtom)
    await queryClient.cancelQueries({ queryKey: ['todos'] })
    const previous = queryClient.getQueryData<Todo[]>(['todos'])
    queryClient.setQueryData<Todo[]>(['todos'], (old) =>
      old?.map((t) => (t.id === todo.id ? { ...t, done: !t.done } : t)),
    )
    return { previous }
  },
  onError: (_err, _todo, context) => {
    const queryClient = get(queryClientAtom)
    if (context?.previous) {
      queryClient.setQueryData(['todos'], context.previous)
    }
  },
  onSettled: () => {
    const queryClient = get(queryClientAtom)
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
}))
```

### Mutation with cache invalidation (no optimistic update)

```ts
export const deleteUserAtom = atomWithMutation((get) => ({
  mutationFn: async (userId: string) => {
    const { data, error } = await api.users({ id: userId }).delete()
    if (error) throw error
    return data
  },
  onSuccess: () => {
    get(queryClientAtom).invalidateQueries({ queryKey: ['users'] })
  },
}))
```

### Consuming in components

```tsx
import { resolveStatus } from '../utils'

function TodoList() {
  const result = useAtomValue(todosAtom)
  const { mutate: toggle } = useAtomValue(toggleTodoAtom)

  return resolveStatus(result, {
    pending: () => <Spinner />,
    error: (error) => <ErrorMessage error={error} />,
    success: (data) => (
      <ul>
        {data.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onToggle={() => toggle(todo)} />
        ))}
      </ul>
    ),
  })
}
```
