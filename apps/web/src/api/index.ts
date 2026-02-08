import { createApiClient } from '@commons'

export const api = createApiClient(import.meta.env.VITE_API_URL ?? 'http://localhost:3000')
