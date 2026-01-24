import { useEffect, useState } from 'react'
import { createApiClient } from '@repo/commons'

// oxlint-disable-next-line import/no-default-export
export default function App() {
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const run = async () => {
      const api = createApiClient(import.meta.env.VITE_API_URL ?? 'http://localhost:3000')
      const { data, error } = await api.hello.get()

      if (error) {
        setError(JSON.stringify(error))
        return
      }

      setMessage(data?.message ?? '')
    }

    run().catch((e) => setError(String(e)))
  }, [])

  return (
    <main style={{ fontFamily: 'system-ui', padding: 16 }}>
      <h1>Web</h1>
      {error ? <pre>{error}</pre> : <p>{message || 'Loading…'}</p>}
    </main>
  )
}
