import { describe, expect, it } from 'vitest'
import { app } from './app'

describe('api', () => {
  it('GET /health returns ok', async () => {
    const res = await app.handle(new Request('http://localhost/health'))
    expect(res.status).toBe(200)
    expect(res.headers.get('x-request-id')).toBeTruthy()
    expect(res.json()).resolves.toEqual({ok: true})
  })

  it('GET /hello returns message', async () => {
    const res = await app.handle(new Request('http://localhost/hello'))
    expect(res.status).toBe(200)
    expect(res.json()).resolves.toEqual({message: 'Hello from API'})
  })
})
