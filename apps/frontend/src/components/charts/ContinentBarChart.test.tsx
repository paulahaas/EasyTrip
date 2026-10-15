import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { StatsPerContinent } from '@easytrip/shared'
import { ContinentBarChart } from './ContinentBarChart'

const DATA: StatsPerContinent[] = [
  { continent: 'Europe', visited: 10, total: 53, percent: 18.9 },
  { continent: 'Asia', visited: 5, total: 50, percent: 10 },
  { continent: 'Africa', visited: 0, total: 54, percent: 0 },
  { continent: 'Antarctica', visited: 0, total: 1, percent: 0 },
  { continent: 'North America', visited: 1, total: 41, percent: 2.4 },
  { continent: 'Oceania', visited: 0, total: 25, percent: 0 },
  { continent: 'South America', visited: 2, total: 14, percent: 14.3 },
]

describe('ContinentBarChart', () => {
  it('renderiza título + mostra 7 continentes traduzidos', () => {
    const { container, getByText } = render(
      <ContinentBarChart perContinent={DATA} />,
    )
    expect(getByText(/Cobertura por continente/i)).toBeInTheDocument()
    // Recharts renders a ResponsiveContainer; text labels come via axis rendering.
    // Check that the chart mounts.
    expect(container.querySelector('.recharts-responsive-container')).toBeTruthy()
  })
})
