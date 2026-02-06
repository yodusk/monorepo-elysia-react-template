import { useEffect, useState } from 'react'
import { createApiClient } from '@commons'
import { logger } from './logger'

// oxlint-disable-next-line import/no-default-export
export default function App() {
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const run = async () => {
      const api = createApiClient(import.meta.env.VITE_API_URL ?? 'http://localhost:3000')
      const { data, error } = await api.hello.get()

      if (error) {
        logger.error({ error }, 'Failed to fetch message from API')
        setError(JSON.stringify(error))
        return
      }

      setMessage(data?.message ?? '')
    }

    run().catch((e) => {
      logger.error({ err: e }, 'Unexpected error in App')
      setError(String(e))
    })
  }, [])

  return (
    <main style={{ fontFamily: 'system-ui', padding: 16 }}>
      <h1>Web</h1>
      {error ? <pre>{error}</pre> : <p>{message || 'Loading…'}</p>}
    </main>
  )
}
