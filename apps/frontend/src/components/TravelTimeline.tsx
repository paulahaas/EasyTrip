import { CalendarDays } from 'lucide-react'
import type { VisitedCountry } from '@easytrip/shared'
import { CountryFlag } from '@/components/CountryFlag'
import { countryNamePt, formatVisitMonth } from '@/lib/countryName'
import { groupByYear } from '@/lib/travel'

interface TravelTimelineProps {
  visited: VisitedCountry[]
}

export function TravelTimeline({ visited }: TravelTimelineProps) {
  const { years, undated } = groupByYear(visited)

  return (
    <div className="et-card p-5 flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <CalendarDays size={16} style={{ color: 'var(--color-accent2)' }} />
        <h3 className="text-lg font-normal" style={{ color: 'var(--color-foreground)' }}>
          Linha do tempo
        </h3>
      </div>

      {years.length === 0 ? (
        <p className="text-sm py-4 text-center" style={{ color: 'var(--color-muted)' }}>
          {visited.length === 0
            ? 'Marque países visitados na busca para montar sua linha do tempo.'
            : 'Adicione o mês de cada viagem na aba Visitados para ver sua linha do tempo.'}
        </p>
      ) : (
        <ol className="flex flex-col gap-5">
          {years.map(([year, trips]) => (
            <li key={year} className="flex flex-col gap-2">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-light" style={{ color: 'var(--color-foreground)' }}>{year}</span>
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
                    <CountryFlag cca2={trip.cca2} size={12} />
                    <span style={{ color: 'var(--color-foreground)' }}>
                      {countryNamePt(trip.cca2, trip.countryName)}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
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
        <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
          {undated.length} país{undated.length !== 1 ? 'es' : ''} sem data:{' '}
          {undated.map((v) => countryNamePt(v.cca2, v.countryName)).join(', ')}.
        </p>
      )}
    </div>
  )
}
