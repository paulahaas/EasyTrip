import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useWishlist } from './useWishlist'
import { Wrapper } from '@/test/renderWithProviders'
import { mockFetch } from '@/test/mockFetch'

const USER = { id: 'u1', email: 'a@b.com', role: 'USER', createdAt: 'x' }

describe('useWishlist (TanStack Query)', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('carrega lista quando auth e add/remove faz mutations', async () => {
    localStorage.setItem('easytrip:token', 'dummy')
    const items = [
      {
        id: 'w1',
        userId: 'u1',
        cca2: 'JP',
        countryName: 'Japan',
        continent: 'Asia',
        createdAt: 'x',
      },
    ]
    const { calls } = mockFetch({
      'GET /api/auth/me': { body: USER },
      'GET /api/wishlist': { body: items },
      'POST /api/wishlist': {
        body: {
          id: 'w2',
          userId: 'u1',
          cca2: 'FR',
          countryName: 'France',
          continent: 'Europe',
          createdAt: 'y',
        },
      },
      'DELETE /api/wishlist/JP': { body: { ok: true } },
    })

    const { result } = renderHook(() => useWishlist(), { wrapper: Wrapper })
    await waitFor(() => expect(result.current.items).toHaveLength(1))
    expect(result.current.items[0].cca2).toBe('JP')

    await result.current.add({
      cca2: 'fr',
      countryName: 'France',
      continent: 'Europe',
    })
    const addCall = calls.find((c) => c.url === '/api/wishlist' && c.init.method === 'POST')
    expect(JSON.parse(addCall!.init.body as string).cca2).toBe('FR')

    await result.current.remove('JP')
    expect(calls.some((c) => c.url === '/api/wishlist/JP')).toBe(true)
  })

  it('sem auth → items vazio sem fetch', async () => {
    const { calls } = mockFetch({})
    const { result } = renderHook(() => useWishlist(), { wrapper: Wrapper })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.items).toEqual([])
    expect(calls.some((c) => c.url === '/api/wishlist')).toBe(false)
  })
})
