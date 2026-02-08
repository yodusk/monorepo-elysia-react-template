import type { ReactNode } from 'react'

export function resolveStatus<T>(
  result:
    | { status: 'pending' }
    | { status: 'error'; error: Error }
    | { status: 'success'; data: T },
  resolver: {
    pending: () => ReactNode
    error: (error: Error) => ReactNode
    success: (data: T) => ReactNode
  },
): ReactNode {
  switch (result.status) {
    case 'pending':
      return resolver.pending()
    case 'error':
      return resolver.error(result.error)
    case 'success':
      return resolver.success(result.data)
    default:
      return null
  }
}
