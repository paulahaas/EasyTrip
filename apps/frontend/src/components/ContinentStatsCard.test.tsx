import { screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ContinentStatsCard } from './ContinentStatsCard'
import { renderWithProviders } from '@/test/renderWithProviders'
import { mockFetch } from '@/test/mockFetch'

const ME = {
  id: 'u1',
  email: 'a@b.com',
  role: 'USER',
  createdAt: '2026-04-23T00:00:00Z',
}

const STATS = {
  totalVisited: 10,
  perContinent: [
    { continent: 'Europe', visited: 10, total: 53, percent: 18.9 },
    { continent: 'Asia', visited: 0, total: 50, percent: 0 },
    { continent: 'Africa', visited: 0, total: 54, percent: 0 },
    { continent: 'Antarctica', visited: 0, total: 1, percent: 0 },
    { continent: 'North America', visited: 0, total: 41, percent: 0 },
    { continent: 'Oceania', visited: 0, total: 25, percent: 0 },
    { continent: 'South America', visited: 0, total: 14, percent: 0 },
  ],
  updatedAt: '2026-04-23T10:00:00Z',
}

describe('ContinentStatsCard', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('renderiza percentuais e progress bars', async () => {
    localStorage.setItem('easytrip:token', 'dummy-token')
    mockFetch({
      'GET /api/auth/me': { body: ME },
      'GET /api/stats/continents': { body: STATS },
    })

    renderWithProviders(<ContinentStatsCard />)

    await waitFor(() => {
      expect(screen.getByText('10 visitados')).toBeInTheDocument()
    })
    expect(screen.getByText('18.9%')).toBeInTheDocument()
    const bars = screen.getAllByRole('progressbar')
    expect(bars).toHaveLength(7)
    const europe = bars.find((b) => b.getAttribute('aria-label')?.startsWith('Europe'))
    expect(europe?.getAttribute('aria-valuenow')).toBe('18.9')
  })
})
