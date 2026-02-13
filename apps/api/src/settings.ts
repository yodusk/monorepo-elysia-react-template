import { z } from 'zod'
import { parseItemStrict } from '@commons'
const MIN_LENGTH = 1

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  DATABASE_URL: z.string().url().startsWith('postgres://'),
  KAI_API_KEY: z.string().min(MIN_LENGTH),
  OPENROUTER_API_KEY: z.string().min(MIN_LENGTH),
  KINDE_DOMAIN: z.string().url(),
})

const envVars = parseItemStrict(envSchema, Bun.env, false)

export const settings = {
  envVars,
  openRouterApiUrl: 'https://openrouter.ai/api/v1/chat/completions',
  trends: {
    model: 'perplexity/sonar',
    max: 10,
  },
}
