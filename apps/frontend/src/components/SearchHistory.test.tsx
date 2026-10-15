import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SearchHistory } from './SearchHistory'

describe('SearchHistory', () => {
  it('não renderiza nada se vazio', () => {
    const { container } = render(
      <SearchHistory history={[]} onSelect={vi.fn()} onClear={vi.fn()} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renderiza pills e clique chama onSelect', () => {
    const onSelect = vi.fn()
    render(
      <SearchHistory
        history={['France', 'Brazil']}
        onSelect={onSelect}
        onClear={vi.fn()}
      />,
    )
    expect(screen.getByText('France')).toBeInTheDocument()
    expect(screen.getByText('Brazil')).toBeInTheDocument()
    fireEvent.click(screen.getByText('France'))
    expect(onSelect).toHaveBeenCalledWith('France')
  })

  it('botão limpar chama onClear', () => {
    const onClear = vi.fn()
    render(
      <SearchHistory history={['France']} onSelect={vi.fn()} onClear={onClear} />,
    )
    fireEvent.click(screen.getByText(/Limpar/i))
    expect(onClear).toHaveBeenCalled()
  })
})
