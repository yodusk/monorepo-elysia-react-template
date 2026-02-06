import pino, { type Logger } from 'pino'
import { AsyncLocalStorage } from 'node:async_hooks'

export type RequestContext = {
  requestId: string
  logger: Logger
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
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
        },
      }),
    )
  : pino({
      level: isTest ? 'silent' : (Bun.env.LOG_LEVEL ?? 'info'),
    })

export const logger = baseLogger

export const getRequestId = (): string | null => requestContext.getStore()?.requestId ?? null

export const getLogger = (): Logger => requestContext.getStore()?.logger ?? baseLogger
