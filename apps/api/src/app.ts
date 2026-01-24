import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'
import { logging } from './logging'

export const app = new Elysia()
  .use(logging)
  .use(
    cors({
      origin: 'http://localhost:5173',
    }),
  )
  .get('/health', () => ({ ok: true }))
  .get('/hello', () => ({ message: 'Hello from API' }))

export type App = typeof app
