import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from './AuthContext'
import { Wrapper as wrapper } from '@/test/renderWithProviders'
import { mockFetch } from '@/test/mockFetch'

const USER = {
  id: 'u1',
  email: 'a@b.com',
  role: 'USER',
  createdAt: '2026-04-23T00:00:00Z',
}

describe('AuthContext', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('login persiste token e usuário', async () => {
    const { calls } = mockFetch({
      'POST /api/auth/login': {
        body: {
          user: USER,
          tokens: { accessToken: 'abc.def.ghi' },
        },
      },
    })

    const { result } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.login({ email: 'a@b.com', password: 'secret123' })
    })

    expect(localStorage.getItem('easytrip:token')).toBe('abc.def.ghi')
    expect(result.current.user?.email).toBe('a@b.com')
    expect(result.current.isAuthenticated).toBe(true)

    const loginCall = calls.find((c) => c.url === '/api/auth/login')
    expect(loginCall).toBeTruthy()
    expect(JSON.parse(loginCall!.init.body as string)).toEqual({
      email: 'a@b.com',
      password: 'secret123',
    })
  })

  it('migra localStorage history no primeiro login', async () => {
    localStorage.setItem(
      'easytrip:search-history',
      JSON.stringify(['France', 'Spain']),
    )
    const { calls } = mockFetch({
      'POST /api/auth/login': {
        body: {
          user: USER,
          tokens: { accessToken: 'tok' },
        },
      },
      'POST /api/history/bulk': { body: [] },
    })

    const { result } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.login({ email: 'a@b.com', password: 'secret123' })
    })

    await waitFor(() => {
      expect(
        calls.some((c) => c.url === '/api/history/bulk'),
      ).toBe(true)
    })
    const bulk = calls.find((c) => c.url === '/api/history/bulk')!
    expect(JSON.parse(bulk.init.body as string)).toEqual({
      queries: ['France', 'Spain'],
    })
    expect(localStorage.getItem('easytrip:search-history')).toBeNull()
  })

  it('401 no /me limpa token', async () => {
    localStorage.setItem('easytrip:token', 'stale')
    mockFetch({
      'GET /api/auth/me': { status: 401, body: { message: 'expired' } },
    })

    const { result } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(localStorage.getItem('easytrip:token')).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })
})
