import { AsyncLocalStorage } from 'node:async_hooks'
import pino, { type Logger } from 'pino'

export type RequestContext = {
  logger: Logger
  requestId: string
  startTimeMs: number
}

export const requestContext = new AsyncLocalStorage<RequestContext>()

const isDev = Bun.env.NODE_ENV === 'development'
const isTest = Bun.env.NODE_ENV === 'test'

const baseLogger = isDev
  ? pino(
      {
        level: isTest ? 'silent' : (Bun.env.LOG_LEVEL ?? 'info'),
      },
      pino.transport({
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
        },
        target: 'pino-pretty',
      }),
    )
  : pino({
      level: isTest ? 'silent' : (Bun.env.LOG_LEVEL ?? 'info'),
    })

export const logger = baseLogger

export const getRequestId = (): string | null => requestContext.getStore()?.requestId ?? null

export const getLogger = (): Logger => requestContext.getStore()?.logger ?? baseLogger
