import { createFileRoute } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { atomWithQuery } from 'jotai-tanstack-query'
import { api } from '../api'

const helloAtom = atomWithQuery(() => ({
  queryFn: async () => {
    const { data, error } = await api.hello.get()
    if (error) throw new Error(JSON.stringify(error))
    return data
  },
  queryKey: ['hello'],
}))

function HomePage() {
  const { data, error, status } = useAtomValue(helloAtom)

  switch (status) {
    case 'pending':
      return <p>Loading…</p>
    case 'error':
      return <pre>{String(error)}</pre>
    case 'success':
      return (
        <main className='p-4 font-sans'>
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
