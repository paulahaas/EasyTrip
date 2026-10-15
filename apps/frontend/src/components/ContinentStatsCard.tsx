import { BarChart2 } from 'lucide-react'
import type { StatsPerContinent } from '@easytrip/shared'
import { useContinentStats } from '@/hooks/useContinentStats'

const CONTINENT_PT: Record<string, string> = {
  Africa:         'África',
  Antarctica:     'Antártida',
  Asia:           'Ásia',
  Europe:         'Europa',
  Americas:       'Américas',
  'North America':'América do Norte',
  Oceania:        'Oceania',
  'South America':'América do Sul',
}

interface ContinentStatsCardProps {
  data?: { totalVisited: number; perContinent: StatsPerContinent[] } | null
  heading?: string
}

export function ContinentStatsCard({ data, heading }: ContinentStatsCardProps = {}) {
  const self  = useContinentStats()
  const stats = data ?? self.data

  return (
    <div className="et-card p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <BarChart2 size={16} style={{ color: '#7dd3fc' }} />
        <h2
          className="text-lg font-normal"
          style={{ color: '#f0f2f8' }}
        >
          {heading ?? 'Por continente'}
        </h2>
        {stats && (
          <span className="et-label ml-auto">
            {stats.totalVisited} visitado{stats.totalVisited !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {!stats && self.isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="et-shimmer h-2.5 w-28 rounded" />
              <div className="et-progress-track">
                <div className="et-progress-fill" style={{ width: '0%' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {stats?.perContinent.map((row) => (
        <div key={row.continent} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span style={{ color: '#f0f2f8' }}>
              {CONTINENT_PT[row.continent] ?? row.continent}
            </span>
            <span style={{ color: '#7c8194' }}>
              {row.visited}/{row.total}
              <span
                className="ml-1.5 font-medium"
                style={{ color: row.percent > 0 ? '#7dd3fc' : '#4e5468' }}
              >
                {row.percent}%
              </span>
            </span>
          </div>
          <div
            className="et-progress-track"
            role="progressbar"
            aria-valuenow={row.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${row.continent} ${row.percent}%`}
          >
            <div
              className="et-progress-fill"
              style={{ width: `${Math.min(100, row.percent)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
