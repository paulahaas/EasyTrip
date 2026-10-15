import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CONTINENT_KEYS, CONTINENT_TOTALS } from '@easytrip/shared'

const WORLD_TOTAL = CONTINENT_KEYS.reduce(
  (sum, c) => sum + CONTINENT_TOTALS[c],
  0,
)

interface WorldPercentChartProps {
  totalVisited: number
}

export function WorldPercentChart({ totalVisited }: WorldPercentChartProps) {
  const remaining = Math.max(0, WORLD_TOTAL - totalVisited)
  const data = [
    { name: 'Visitados', value: totalVisited, color: '#4f8ef7' },
    { name: 'Restantes', value: remaining, color: 'rgba(255,255,255,0.08)' },
  ]
  const percent = Math.round((totalVisited / WORLD_TOTAL) * 1000) / 10

  return (
    <Card
      className="border-0"
      style={{
        background: '#16181f',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <CardHeader>
        <h2
          className="text-lg font-semibold"
          style={{ color: '#f0f2f8' }}
        >
          Percentual do mundo
        </h2>
        <p className="text-xs" style={{ color: '#7c8194' }}>
          {totalVisited} de {WORLD_TOTAL} países
        </p>
      </CardHeader>
      <CardContent
        style={{ height: 240 }}
        className="relative flex items-center justify-center"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={70}
              outerRadius={95}
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: '#1e2029',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                color: '#f0f2f8',
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            className="text-4xl font-semibold"
            style={{
              color: '#f0f2f8',
            }}
          >
            {percent}%
          </span>
          <span className="text-xs" style={{ color: '#7c8194' }}>
            do mundo
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
