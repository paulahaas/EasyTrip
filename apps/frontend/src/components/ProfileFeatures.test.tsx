import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { computeAchievements } from '@easytrip/shared'
import type { VisitedCountry } from '@easytrip/shared'
import { AchievementsCard } from './AchievementsCard'
import { CompareCard, compareVisited } from './CompareCard'
import { TravelTimeline, groupByYear } from './TravelTimeline'
import { countryNamePt, formatVisitMonth } from '@/lib/countryName'

function visit(cca2: string, continent: string, visitedAt: string | null = null): VisitedCountry {
  return {
    id: cca2,
    userId: 'u1',
    cca2,
    countryName: cca2,
    continent,
    visitedAt,
    createdAt: '2026-01-01T00:00:00.000Z',
  }
}

const byId = (list: ReturnType<typeof computeAchievements>, id: string) =>
  list.find((a) => a.id === id)!

describe('computeAchievements', () => {
  it('sem viagens nenhuma conquista é alcançada', () => {
    expect(computeAchievements([]).every((a) => !a.conquistada)).toBe(true)
  })

  it('conta países, continentes e progresso', () => {
    const list = computeAchievements([
      visit('BR', 'South America'),
      visit('AR', 'South America'),
      visit('FR', 'Europe'),
      visit('JP', 'Asia'),
      visit('US', 'North America'),
    ])
    expect(byId(list, 'primeiro-carimbo').conquistada).toBe(true)
    expect(byId(list, 'fora-do-brasil').conquistada).toBe(true)
    expect(byId(list, 'explorador').conquistada).toBe(true)
    expect(byId(list, 'viajante').progresso).toEqual({ atual: 5, meta: 10 })
    expect(byId(list, 'dois-continentes').conquistada).toBe(true)
    expect(byId(list, 'cinco-continentes').progresso).toEqual({ atual: 4, meta: 5 })
    expect(byId(list, 'vizinhos').progresso.atual).toBe(1)
  })

  it('só o Brasil não conta como viagem para fora', () => {
    const list = computeAchievements([visit('BR', 'South America')])
    expect(byId(list, 'primeiro-carimbo').conquistada).toBe(true)
    expect(byId(list, 'fora-do-brasil').conquistada).toBe(false)
  })

  it('ano agitado exige 3 países com data no mesmo ano', () => {
    const list = computeAchievements([
      visit('FR', 'Europe', '2024-03-01'),
      visit('IT', 'Europe', '2024-03-01'),
      visit('ES', 'Europe', '2024-07-01'),
      visit('PT', 'Europe', '2023-01-01'),
      visit('DE', 'Europe'),
    ])
    expect(byId(list, 'ano-agitado').conquistada).toBe(true)
  })
})

describe('linha do tempo', () => {
  it('agrupa por ano do mais recente para o mais antigo e separa os sem data', () => {
    const { years, undated } = groupByYear([
      visit('FR', 'Europe', '2023-05-01'),
      visit('JP', 'Asia', '2025-02-01'),
      visit('IT', 'Europe', '2025-08-01'),
      visit('BR', 'South America'),
    ])
    expect(years.map(([y]) => y)).toEqual(['2025', '2023'])
    expect(years[0][1].map((v) => v.cca2)).toEqual(['IT', 'JP'])
    expect(undated.map((v) => v.cca2)).toEqual(['BR'])
  })

  it('mostra o mês por extenso e o nome em português', () => {
    render(<TravelTimeline visited={[visit('JP', 'Asia', '2024-03-01')]} />)
    expect(screen.getByText('2024')).toBeInTheDocument()
    expect(screen.getByText('Japão')).toBeInTheDocument()
    expect(screen.getByText(formatVisitMonth('2024-03-01'))).toBeInTheDocument()
  })

  it('pede para adicionar datas quando nenhuma viagem tem data', () => {
    render(<TravelTimeline visited={[visit('JP', 'Asia')]} />)
    expect(screen.getByText(/Adicione o mês de cada viagem/i)).toBeInTheDocument()
  })
})

describe('comparação com amigo', () => {
  it('separa países em comum, só dela e só meus', () => {
    const res = compareVisited(
      [visit('BR', 'South America'), visit('FR', 'Europe')],
      [visit('FR', 'Europe'), visit('JP', 'Asia')],
    )
    expect(res.emComum.map((c) => c.cca2)).toEqual(['FR'])
    expect(res.soDela.map((c) => c.cca2)).toEqual(['JP'])
    expect(res.soMeus.map((c) => c.cca2)).toEqual(['BR'])
  })

  it('renderiza os números e os nomes em português', () => {
    render(
      <CompareCard
        theirName="bia"
        mine={[visit('FR', 'Europe')]}
        theirs={[visit('FR', 'Europe'), visit('JP', 'Asia')]}
      />,
    )
    expect(screen.getByText('Você e @bia')).toBeInTheDocument()
    expect(screen.getByText('França')).toBeInTheDocument()
    expect(screen.getByText('Japão')).toBeInTheDocument()
  })
})

describe('AchievementsCard', () => {
  it('mostra quantas conquistas foram alcançadas', () => {
    render(<AchievementsCard visited={[visit('FR', 'Europe')]} />)
    const total = computeAchievements([]).length
    expect(screen.getByText(`2 de ${total}`)).toBeInTheDocument()
  })
})

describe('countryNamePt', () => {
  it('traduz pelo código e usa o nome salvo como reserva', () => {
    expect(countryNamePt('DE', 'Germany')).toBe('Alemanha')
    expect(countryNamePt('ZZ', 'Lugar X')).toBe('Lugar X')
  })
})
