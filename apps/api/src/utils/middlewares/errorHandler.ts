import { Elysia } from 'elysia'
import { AuthorizationError } from 'models/AuthorizationError'

export const errorHandler = new Elysia({ name: 'errorHandler' })
  .error({
    AuthorizationError,
  })
  .as('global')
