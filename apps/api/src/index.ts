import { logger } from './logger'
import { app } from './app'

export type { App } from './app'

const PORT = Number(Bun.env.PORT ?? '3000')

const isMain = (import.meta as unknown as { main?: boolean }).main

if (isMain) {
  app.listen(PORT)
  logger.info(`API listening on http://localhost:3000`)
}
