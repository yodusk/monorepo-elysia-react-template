import { parseItemStrict } from '@commons'
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.url().startsWith('postgres://'),
  NODE_ENV: z.enum(['development', 'production', 'test']),
})

const envVars = parseItemStrict(envSchema, Bun.env, false)

export const settings = {
  env: envVars,
}
