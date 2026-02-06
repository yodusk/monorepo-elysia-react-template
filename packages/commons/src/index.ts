import type { App } from '@apps/api'
import { treaty } from '@elysiajs/eden'

export const createApiClient = (baseUrl: string) => treaty<App>(baseUrl)
