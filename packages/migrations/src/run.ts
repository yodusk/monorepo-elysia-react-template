import { readdir, readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { Client } from 'pg'

const MIGRATIONS_TABLE = '_migrations'
const SQL_DIR = resolve(import.meta.dir, '../sql')

async function ensureMigrationsTable(client: Client): Promise<void> {
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}

async function getAppliedMigrations(client: Client): Promise<Set<string>> {
  const result = await client.query<{ name: string }>(
    `SELECT name FROM ${MIGRATIONS_TABLE} ORDER BY name`,
  )
  return new Set(result.rows.map((row) => row.name))
}

async function run(): Promise<void> {
  const connectionString = Bun.env.DATABASE_URL
  if (!connectionString) {
    const message = 'DATABASE_URL environment variable is required'
    throw new Error(message)
  }

  const client = new Client({ connectionString })
  await client.connect()

  try {
    await ensureMigrationsTable(client)
    const applied = await getAppliedMigrations(client)

    const files = (await readdir(SQL_DIR))
      .filter((f) => f.endsWith('.sql'))
      .sort((a, b) => a.localeCompare(b))

    const pending = files.filter((f) => !applied.has(f))

    if (pending.length === 0) {
      process.stdout.write('No pending migrations.\n')
      return
    }

    process.stdout.write(`Found ${String(pending.length)} pending migration(s).\n`)

    for (const file of pending) {
      const sql = await readFile(join(SQL_DIR, file), 'utf-8')
      process.stdout.write(`Applying: ${file}\n`)

      await client.query('BEGIN')
      try {
        await client.query(sql)
        await client.query(`INSERT INTO ${MIGRATIONS_TABLE} (name) VALUES ($1)`, [file])
        await client.query('COMMIT')
        process.stdout.write(`Applied: ${file}\n`)
      } catch (err) {
        await client.query('ROLLBACK')
        throw err
      }
    }

    process.stdout.write('All migrations applied successfully.\n')
  } finally {
    await client.end()
  }
}

await run()
