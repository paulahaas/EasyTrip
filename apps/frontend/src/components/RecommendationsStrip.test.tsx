import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { RecommendationItem } from '@easytrip/shared'
import { RecommendationsStrip } from './RecommendationsStrip'

const ITEMS: RecommendationItem[] = [
  {
    cca2: 'ES',
    cca3: 'ESP',
    countryName: 'Spain',
    continent: 'Europe',
    reason: 'border',
    score: 4,
  },
  {
    cca2: 'PT',
    cca3: 'PRT',
    countryName: 'Portugal',
    continent: 'Europe',
    reason: 'subregion',
    score: 1,
  },
]

describe('RecommendationsStrip', () => {
  it('não renderiza nada se items vazio', () => {
    const { container } = render(
      <RecommendationsStrip items={[]} onSelect={vi.fn()} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renderiza items e clique chama onSelect com countryName', () => {
    const onSelect = vi.fn()
    render(<RecommendationsStrip items={ITEMS} onSelect={onSelect} />)
    expect(screen.getByText('Spain')).toBeInTheDocument()
    expect(screen.getByText('Portugal')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Spain'))
    expect(onSelect).toHaveBeenCalledWith('Spain')
  })
})
