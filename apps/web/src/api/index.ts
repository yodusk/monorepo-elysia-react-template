import type { App } from '@apps/api'
import { treaty } from '@elysiajs/eden'
import { settings } from 'settings'

export const api = treaty<App>(settings.env.VITE_API_URL)
