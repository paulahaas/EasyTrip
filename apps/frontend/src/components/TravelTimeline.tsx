import { CalendarDays } from 'lucide-react'
import type { VisitedCountry } from '@easytrip/shared'
import { getCountryFlag } from '@/lib/flags'
import { countryNamePt, formatVisitMonth } from '@/lib/countryName'

interface TravelTimelineProps {
  visited: VisitedCountry[]
}

/** Agrupa as viagens por ano, da mais recente para a mais antiga. */
export function groupByYear(visited: VisitedCountry[]) {
  const dated = visited
    .filter((v) => v.visitedAt)
    .sort((a, b) => b.visitedAt!.localeCompare(a.visitedAt!))
  const years = new Map<string, VisitedCountry[]>()
  for (const v of dated) {
    const year = v.visitedAt!.slice(0, 4)
    years.set(year, [...(years.get(year) ?? []), v])
  }
  return {
    years: [...years.entries()],
    undated: visited.filter((v) => !v.visitedAt),
  }
}

export function TravelTimeline({ visited }: TravelTimelineProps) {
  const { years, undated } = groupByYear(visited)

  return (
    <div className="et-card p-5 flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <CalendarDays size={16} style={{ color: '#7dd3fc' }} />
        <h3 className="text-lg font-normal" style={{ color: '#f0f2f8' }}>
          Linha do tempo
        </h3>
      </div>

      {years.length === 0 ? (
        <p className="text-sm py-4 text-center" style={{ color: '#7c8194' }}>
          {visited.length === 0
            ? 'Marque países visitados na busca para montar sua linha do tempo.'
            : 'Adicione o mês de cada viagem na aba Visitados para ver sua linha do tempo.'}
        </p>
      ) : (
        <ol className="flex flex-col gap-5">
          {years.map(([year, trips]) => (
            <li key={year} className="flex flex-col gap-2">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-light" style={{ color: '#f0f2f8' }}>{year}</span>
                <span className="et-label">
                  {trips.length} país{trips.length !== 1 ? 'es' : ''}
                </span>
              </div>
              <ul
                className="flex flex-col gap-1.5 pl-4"
                style={{ borderLeft: '2px solid rgba(125,211,252,0.25)' }}
              >
                {trips.map((trip) => (
                  <li key={trip.cca2} className="flex items-center gap-2 text-sm">
                    <span aria-hidden>{getCountryFlag(trip.countryName)}</span>
                    <span style={{ color: '#f0f2f8' }}>
                      {countryNamePt(trip.cca2, trip.countryName)}
                    </span>
                    <span className="text-xs" style={{ color: '#7c8194' }}>
                      {formatVisitMonth(trip.visitedAt!)}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}

      {undated.length > 0 && years.length > 0 && (
        <p className="text-xs" style={{ color: '#7c8194' }}>
          {undated.length} país{undated.length !== 1 ? 'es' : ''} sem data:{' '}
          {undated.map((v) => countryNamePt(v.cca2, v.countryName)).join(', ')}.
        </p>
      )}
    </div>
  )
}
