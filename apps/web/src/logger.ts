import pino from 'pino'

const isDev = import.meta.env.DEV

export const logger = pino({
  level: import.meta.env.VITE_LOG_LEVEL ?? (isDev ? 'debug' : 'info'),
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
})