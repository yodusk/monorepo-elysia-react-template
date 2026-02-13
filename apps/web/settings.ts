import { z } from 'zod'
import { parseItemStrict } from '@commons'

const envSchema = z.object({
  VITE_API_URL: z.url(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
})

const envVars = parseItemStrict(envSchema, import.meta.env, false)

export const settings = {
  env: envVars,
}
