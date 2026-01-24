import { getLogger, logger, requestContext } from './logger'
import { Elysia } from 'elysia'
import { randomUUID } from 'node:crypto'

export const logging = new Elysia({ name: 'logging' })
  .onRequest(({ request, set }) => {
    const headerRequestId = request.headers.get('x-request-id')
    const requestId =
      headerRequestId && headerRequestId.trim() !== '' ? headerRequestId : randomUUID()

    const childLogger = logger.child({ requestId })
    requestContext.enterWith({
      logger: childLogger,
      requestId,
      startTimeMs: Date.now(),
    })

    set.headers['x-request-id'] = requestId

    const url = new URL(request.url)
    childLogger.info(
      {
        method: request.method,
        path: url.pathname,
      },
      'request',
    )
  })
  .onAfterHandle(({ set }) => {
    const ctx = requestContext.getStore()
    const durationMs = ctx ? Date.now() - ctx.startTimeMs : null

    getLogger().info(
      {
        durationMs,
        status: set.status,
      },
      'response',
    )
  })
  .onError(({ error, set }) => {
    getLogger().error(
      {
        err: error,
        status: set.status,
      },
      'error',
    )
  })
