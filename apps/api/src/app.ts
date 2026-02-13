import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'
import { errorHandler } from 'utils/middlewares/errorHandler'
import { logging } from 'utils/middlewares/logging'

export const app = new Elysia()
  .use(logging)
  .use(errorHandler)
  .use(
    cors({
      origin: 'http://localhost:5173',
    }),
  )
  .get('/health', () => ({ ok: true }))
  .get('/hello', () => ({ message: 'Hello from API' }))

export type App = typeof app
