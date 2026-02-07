import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'
import type { DB } from 'kysely-codegen'

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: Bun.env.DATABASE_URL,
    }),
  }),
})

export type { DB }
