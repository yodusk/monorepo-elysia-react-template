import pino, { type Logger } from 'pino'
import { AsyncLocalStorage } from 'node:async_hooks'

export type RequestContext = {
  requestId: string
  logger: Logger
  startTimeMs: number
}

export const requestContext = new AsyncLocalStorage<RequestContext>()

const baseLogger = pino({
  level: Bun.env.NODE_ENV === 'test' ? 'silent' : (Bun.env.LOG_LEVEL ?? 'info'),
})

export const logger = baseLogger

export const getRequestId = (): string | null => requestContext.getStore()?.requestId ?? null

export const getLogger = (): Logger => requestContext.getStore()?.logger ?? baseLogger
