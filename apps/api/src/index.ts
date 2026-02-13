import { app } from 'app'
import { db } from 'db'
import { logger } from 'logger'

export type { App } from './app'

const PORT = Number(Bun.env.PORT ?? '3000')

const isMain = (import.meta as unknown as { main?: boolean }).main

if (isMain) {
  app.listen(PORT)
  logger.info(`API listening on http://localhost:${String(PORT)}`)

  const shutdown = () => db.destroy().then(() => process.exit())

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}
