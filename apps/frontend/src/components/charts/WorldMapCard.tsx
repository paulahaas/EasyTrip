import { useMemo, useState } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps'
import type { VisitedCountry } from '@easytrip/shared'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { sameCountry } from '@/lib/countryMatch'
import { CONTINENT_PT, translateContinent } from '@/lib/i18n'

const GEO_URL = '/countries-110m.json'

const CONTINENT_COLOR: Record<string, string> = {
  Africa: '#f59e0b',
  Antarctica: '#a3a3a3',
  Asia: '#ef4444',
  Europe: '#4f8ef7',
  'North America': '#10b981',
  Oceania: '#8b5cf6',
  'South America': '#eab308',
}

interface WorldMapCardProps {
  visited: VisitedCountry[]
  heading?: string
}

interface Tip {
  name: string
  continent?: string
  x: number
  y: number
}

export function WorldMapCard({
  visited,
  heading = 'Seu mapa do mundo',
}: WorldMapCardProps) {
  const [tip, setTip] = useState<Tip | null>(null)

  const visitedByName = useMemo(() => {
    const m = new Map<string, VisitedCountry>()
    for (const v of visited) {
      m.set(v.countryName.toLowerCase(), v)
    }
    return m
  }, [visited])

  function findVisited(featureName: string): VisitedCountry | null {
    const hit = visitedByName.get(featureName.toLowerCase())
    if (hit) return hit
    for (const v of visited) {
      if (sameCountry(v.countryName, featureName)) return v
    }
    return null
  }

  return (
    <Card
      className="border-0"
      style={{
        background: '#16181f',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              className="text-lg font-semibold"
              style={{
                color: '#f0f2f8',
              }}
            >
              {heading}
            </h2>
            <p className="text-xs" style={{ color: '#7c8194' }}>
              {visited.length} países pintados
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-[10px]">
            {Object.entries(CONTINENT_COLOR).map(([continent, color]) => (
              <span
                key={continent}
                className="inline-flex items-center gap-1"
                style={{ color: '#7c8194' }}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: color }}
                />
                {(CONTINENT_PT as Record<string, string>)[continent] ?? continent}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div
          className="rounded-lg overflow-hidden"
          style={{ background: '#0e0f14' }}
        >
          <ComposableMap
            projection="geoEqualEarth"
            projectionConfig={{ scale: 165 }}
            width={900}
            height={420}
            style={{ width: '100%', height: 'auto' }}
          >
            <ZoomableGroup center={[0, 20]} maxZoom={5}>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const name = geo.properties.name as string
                    const hit = findVisited(name)
                    const fill = hit
                      ? CONTINENT_COLOR[hit.continent] ?? '#4f8ef7'
                      : '#1e2029'
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fill}
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth={0.4}
                        onMouseEnter={(e) => {
                          setTip({
                            name,
                            continent: hit?.continent,
                            x: e.clientX,
                            y: e.clientY,
                          })
                        }}
                        onMouseMove={(e) => {
                          setTip((prev) =>
                            prev
                              ? { ...prev, x: e.clientX, y: e.clientY }
                              : prev,
                          )
                        }}
                        onMouseLeave={() => setTip(null)}
                        style={{
                          default: { outline: 'none' },
                          hover: {
                            outline: 'none',
                            fill: hit
                              ? CONTINENT_COLOR[hit.continent]
                              : '#2a2d3a',
                            cursor: 'pointer',
                          },
                          pressed: { outline: 'none' },
                        }}
                      />
                    )
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>
        {tip && (
          <div
            className="fixed pointer-events-none z-50 px-2 py-1 rounded text-xs"
            style={{
              left: tip.x + 12,
              top: tip.y + 12,
              background: '#1e2029',
              color: '#f0f2f8',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div className="font-medium">{tip.name}</div>
            {tip.continent ? (
              <div style={{ color: '#7dd3fc' }}>
                ✓ visitado — {translateContinent(tip.continent)}
              </div>
            ) : (
              <div style={{ color: '#7c8194' }}>ainda não visitado</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
