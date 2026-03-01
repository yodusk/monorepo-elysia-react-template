import pino from 'pino'

export const logger = pino({
  browser: {
    asObject: true,
    write: {
      info: (o) => {
        // eslint-disable-next-line no-console
        console.info(o)
      },
      error: (o) => {
        // eslint-disable-next-line no-console
        console.error(o)
      },
      warn: (o) => {
        // eslint-disable-next-line no-console
        console.warn(o)
      },
      debug: (o) => {
        // eslint-disable-next-line no-console
        console.debug(o)
      },
      trace: (o) => {
        // eslint-disable-next-line no-console
        console.trace(o)
      },
      fatal: (o) => {
        // eslint-disable-next-line no-console
        console.error(o)
      },
    },
  },
  level: import.meta.env.VITE_LOG_LEVEL ?? (import.meta.env.DEV ? 'debug' : 'info'),
})
