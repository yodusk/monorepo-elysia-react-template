import { z } from 'zod'
import { parseItemStrict } from '@commons'
const MIN_LENGTH = 1

const envSchema = z.object({
  VITE_API_URL: z.url(),
  VITE_KINDE_CLIENT_ID: z.string().min(MIN_LENGTH),
  VITE_KINDE_DOMAIN: z.url(),
  VITE_KINDE_REDIRECT_URL: z.url(),
  VITE_KINDE_LOGOUT_URL: z.url(),
})

const envVars = parseItemStrict(envSchema, import.meta.env, false)

export const settings = {
  envVars,
}
