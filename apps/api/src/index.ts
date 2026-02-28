import { app } from 'app'
import { db } from 'db'
import { logger } from 'logger'

export type { App } from './app'

const PORT = Number(Bun.env.PORT ?? '3000')

// oxlint-disable-next-line typescript/no-unsafe-type-assertion
const isMain = (import.meta as unknown as { main?: boolean }).main

if (isMain) {
  app.listen(PORT)
  logger.info(`API listening on http://localhost:${String(PORT)}`)

  const shutdown = async () => {
    await db.destroy()
    process.exit()
  }

  // oxlint-disable-next-line no-void
  process.on('SIGINT', () => void shutdown())
  // oxlint-disable-next-line no-void
  process.on('SIGTERM', () => void shutdown())
}
