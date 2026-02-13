import { z } from 'zod'
import { parseItemStrict } from '@commons'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  DATABASE_URL: z.url().startsWith('postgres://'),
})

const envVars = parseItemStrict(envSchema, Bun.env, false)

export const settings = {
  env: envVars,
}
