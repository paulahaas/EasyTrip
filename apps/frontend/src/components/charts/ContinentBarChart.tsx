import type { StatsPerContinent } from '@easytrip/shared'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { continentColor } from '@/lib/palette'

const LABEL_PT: Record<string, string> = {
  Africa: 'África',
  Antarctica: 'Antártida',
  Asia: 'Ásia',
  Europe: 'Europa',
  'North America': 'A. Norte',
  Oceania: 'Oceania',
  'South America': 'A. Sul',
}

interface ContinentBarChartProps {
  perContinent: StatsPerContinent[]
}

export function ContinentBarChart({ perContinent }: ContinentBarChartProps) {
  const data = perContinent.map((row) => ({
    continent: LABEL_PT[row.continent] ?? row.continent,
    originalContinent: row.continent,
    Visitados: row.visited,
    Restantes: row.total - row.visited,
    total: row.total,
    percent: row.percent,
  }))

  return (
    <Card
      className="border-0"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <CardHeader>
        <h2
          className="text-lg font-semibold"
          style={{ color: 'var(--color-foreground)' }}
        >
          Cobertura por continente
        </h2>
        <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
          Visitados vs. restantes em cada continente
        </p>
      </CardHeader>
      <CardContent style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 16, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis
              dataKey="continent"
              stroke="var(--color-muted)"
              tick={{ fontSize: 11 }}
            />
            <YAxis stroke="var(--color-muted)" tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              cursor={{ fill: 'rgba(79,142,247,0.08)' }}
              contentStyle={{
                background: 'var(--color-surface2)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                color: 'var(--color-foreground)',
                fontSize: 12,
              }}
              labelFormatter={(label, payload) => {
                const item = (payload as unknown as Array<{ payload?: { percent: number; total: number } }>)?.[0]?.payload
                return item
                  ? `${String(label)} — ${item.percent}% (${item.total} países)`
                  : String(label ?? '')
              }}
            />
            <Legend
              wrapperStyle={{ color: 'var(--color-foreground)', fontSize: 12 }}
              iconType="circle"
            />
            <Bar dataKey="Visitados" stackId="a" radius={[6, 6, 0, 0]}>
              {data.map((entry) => (
                <Cell
                  key={entry.originalContinent}
                  fill={continentColor(entry.originalContinent)}
                />
              ))}
            </Bar>
            <Bar
              dataKey="Restantes"
              stackId="a"
              fill="rgba(255,255,255,0.06)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
