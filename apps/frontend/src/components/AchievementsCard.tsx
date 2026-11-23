import { Award } from 'lucide-react'
import { computeAchievements, type VisitedForAchievements } from '@easytrip/shared'

interface AchievementsCardProps {
  visited: VisitedForAchievements[]
  /** Título alternativo (ex.: no perfil público de outra pessoa). */
  title?: string
}

export function AchievementsCard({ visited, title = 'Conquistas' }: AchievementsCardProps) {
  const achievements = computeAchievements(visited)
  const earned = achievements.filter((a) => a.conquistada).length
  // Conquistadas primeiro; depois as mais perto de serem alcançadas.
  const sorted = [...achievements].sort((a, b) => {
    if (a.conquistada !== b.conquistada) return a.conquistada ? -1 : 1
    return b.progresso.atual / b.progresso.meta - a.progresso.atual / a.progresso.meta
  })

  return (
    <div className="et-card p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Award size={16} style={{ color: 'var(--color-warning)' }} />
        <h3 className="text-lg font-normal" style={{ color: 'var(--color-foreground)' }}>
          {title}
        </h3>
        <span className="et-label ml-auto">
          {earned} de {achievements.length}
        </span>
      </div>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {sorted.map((a) => {
          const pct = Math.round((a.progresso.atual / a.progresso.meta) * 100)
          return (
            <li
              key={a.id}
              title={a.descricao}
              aria-label={`${a.titulo}: ${a.descricao}. ${a.conquistada ? 'Conquistada' : `${a.progresso.atual} de ${a.progresso.meta}`}`}
              className="rounded-lg p-3 flex flex-col items-center text-center gap-1"
              style={{
                background: a.conquistada ? 'rgba(251,191,36,0.08)' : 'var(--color-surface2)',
                border: `1px solid ${a.conquistada ? 'rgba(251,191,36,0.3)' : 'rgba(255,255,255,0.05)'}`,
              }}
            >
              <span
                className="text-2xl leading-none"
                style={{ filter: a.conquistada ? 'none' : 'grayscale(1)', opacity: a.conquistada ? 1 : 0.4 }}
                aria-hidden
              >
                {a.icone}
              </span>
              <span
                className="text-xs font-medium leading-tight"
                style={{ color: a.conquistada ? 'var(--color-foreground)' : 'var(--color-text-soft)' }}
              >
                {a.titulo}
              </span>
              <span className="text-[10px] leading-tight" style={{ color: 'var(--color-muted)' }}>
                {a.descricao}
              </span>
              {!a.conquistada && (
                <div
                  className="w-full h-1 rounded-full mt-1 overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: 'var(--color-accent)' }}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
