import type { ReactNode } from 'react'

export function resolveStatus<T>(
  result:
    | { status: 'pending' }
    | { error: Error; status: 'error' }
    | { data: T; status: 'success' },
  resolver: {
    error: (error: Error) => ReactNode
    pending: () => ReactNode
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
