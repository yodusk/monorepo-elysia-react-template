import { createFileRoute } from '@tanstack/react-router'
import { atomWithQuery } from 'jotai-tanstack-query'
import { useAtomValue } from 'jotai'
import { api } from '../api'

const helloAtom = atomWithQuery(() => ({
  queryKey: ['hello'],
  queryFn: async () => {
    const { data, error } = await api.hello.get()
    if (error) throw error
    return data
  },
}))

function HomePage() {
  const { data, status, error } = useAtomValue(helloAtom)

  switch (status) {
    case 'pending':
      return <p>Loading…</p>
    case 'error':
      return <pre>{String(error)}</pre>
    case 'success':
      return (
        <main style={{ fontFamily: 'system-ui', padding: 16 }}>
          <h1>Web</h1>
          <p>{data.message}</p>
        </main>
      )
    default:
      return null
  }
}

// oxlint-disable-next-line import/no-default-export
export const Route = createFileRoute('/')({ component: HomePage })
