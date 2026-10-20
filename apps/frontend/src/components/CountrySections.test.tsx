import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ExchangeHighlight } from './ExchangeHighlight'
import { FoodsSection } from './FoodsSection'
import { RulesSection } from './RulesSection'

describe('FoodsSection', () => {
  it('lista as comidas típicas', () => {
    render(
      <FoodsSection
        comidas={[
          { nome: 'Coxinha', descricao: 'Salgado de frango' },
          { nome: 'Guaraná', descricao: 'Refrigerante amazônico' },
        ]}
      />,
    )
    expect(screen.getByText('Comidas e bebidas típicas')).toBeInTheDocument()
    expect(screen.getByText('Coxinha')).toBeInTheDocument()
    expect(screen.getByText('Refrigerante amazônico')).toBeInTheDocument()
  })

  it('não renderiza nada sem comidas', () => {
    const { container } = render(<FoodsSection comidas={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})

describe('RulesSection', () => {
  it('mostra proibições antes dos avisos e o link para fontes oficiais', () => {
    render(
      <RulesSection
        pais="Singapura"
        regras={[
          { tipo: 'atencao', titulo: 'Lixo', descricao: 'Multas altas' },
          { tipo: 'proibido', titulo: 'Chiclete', descricao: 'Venda proibida' },
        ]}
      />,
    )
    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveTextContent('Proibido: Chiclete')
    expect(items[1]).toHaveTextContent('Atenção: Lixo')
    expect(screen.getByRole('link', { name: /Portal Consular/i })).toHaveAttribute(
      'href',
      expect.stringContaining('gov.br'),
    )
  })

  it('não renderiza nada sem regras', () => {
    const { container } = render(<RulesSection pais="Brasil" regras={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})

describe('ExchangeHighlight', () => {
  const cambio = {
    moedaOrigem: 'USD',
    cotacaoEmBRL: 'US$ 1,00 = R$ 5,00',
    umRealEm: 'R$ 1,00 = US$ 0,20',
    atualizadoEm: '2026-10-20T00:00:00.000Z',
  }

  it('mostra a cotação nos dois sentidos e o crédito da fonte', () => {
    render(<ExchangeHighlight cambio={cambio} />)
    expect(screen.getByText('R$ 1,00 = US$ 0,20')).toBeInTheDocument()
    expect(screen.getByText('US$ 1,00 = R$ 5,00')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /ExchangeRate-API/i })).toBeInTheDocument()
  })

  it('não aparece para o próprio real', () => {
    const { container } = render(
      <ExchangeHighlight cambio={{ ...cambio, moedaOrigem: 'BRL' }} />,
    )
    expect(container).toBeEmptyDOMElement()
  })
})
