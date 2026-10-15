import { vi } from 'vitest'

export interface FetchCall {
  url: string
  init: RequestInit
}

export interface MockedFetch {
  calls: FetchCall[]
  mock: ReturnType<typeof vi.fn>
}

export interface RouteResponse {
  status?: number
  body?: unknown
}

export type Route =
  | RouteResponse
  | ((url: string, init: RequestInit) => Promise<RouteResponse> | RouteResponse)

export function mockFetch(routes: Record<string, Route>): MockedFetch {
  const calls: FetchCall[] = []

  async function handler(input: RequestInfo | URL, init: RequestInit = {}) {
    const url = typeof input === 'string' ? input : input.toString()
    calls.push({ url, init })

    const method = (init.method ?? 'GET').toUpperCase()
    const key = `${method} ${url}`
    const route = routes[key] ?? routes[url]
    if (!route) {
      return new Response(JSON.stringify({ message: `no route: ${key}` }), {
        status: 404,
      })
    }
    const result = typeof route === 'function' ? await route(url, init) : route
    const status = result.status ?? 200
    const body = result.body ?? {}
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const mock = vi.fn(handler)
  vi.stubGlobal('fetch', mock)
  return { calls, mock }
}
