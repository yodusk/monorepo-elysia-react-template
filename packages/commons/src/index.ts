import type { App } from '@repo/api'
import { treaty } from '@elysiajs/eden'

export const createApiClient = (baseUrl: string) => treaty<App>(baseUrl)
