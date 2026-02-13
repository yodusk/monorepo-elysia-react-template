const STATUS_UNAUTHORIZED = 401

export class AuthorizationError extends Error {
  status = STATUS_UNAUTHORIZED

  constructor(message: string) {
    super(message)
    this.name = 'AuthorizationError'
  }
}
