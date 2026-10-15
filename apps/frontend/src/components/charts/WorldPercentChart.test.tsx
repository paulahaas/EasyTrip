import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WorldPercentChart } from './WorldPercentChart'

describe('WorldPercentChart', () => {
  it('renderiza % com 1 decimal e total de países', () => {
    const { container, getByText } = render(
      <WorldPercentChart totalVisited={20} />,
    )
    // 20/238 ≈ 8.4%
    expect(getByText(/8\.4%/)).toBeInTheDocument()
    expect(container.textContent).toContain('20 de 238 países')
  })

  it('0 países → 0%', () => {
    const { getByText } = render(<WorldPercentChart totalVisited={0} />)
    expect(getByText(/0%/)).toBeInTheDocument()
  })
})
