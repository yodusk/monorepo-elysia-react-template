import { createApiClient } from '@commons'
import { settings } from 'settings'

export const api = createApiClient(settings.env.VITE_API_URL)
