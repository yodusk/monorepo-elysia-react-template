import { parseItemStrict } from '@commons'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  VITE_API_URL: z.url(),
})

const envVars = parseItemStrict(envSchema, import.meta.env, false)

export const settings = {
  env: envVars,
}
