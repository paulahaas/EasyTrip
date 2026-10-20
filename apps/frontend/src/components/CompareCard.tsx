import { Users } from 'lucide-react'
import type { VisitedCountry } from '@easytrip/shared'
import { getCountryFlag } from '@/lib/flags'
import { countryNamePt } from '@/lib/countryName'

type Country = Pick<VisitedCountry, 'cca2' | 'countryName'>

interface CompareCardProps {
  mine: Country[]
  theirs: Country[]
  theirName: string
}

export function compareVisited(mine: Country[], theirs: Country[]) {
  const mineSet = new Set(mine.map((c) => c.cca2))
  const theirSet = new Set(theirs.map((c) => c.cca2))
  return {
    emComum: theirs.filter((c) => mineSet.has(c.cca2)),
    soDela: theirs.filter((c) => !mineSet.has(c.cca2)),
    soMeus: mine.filter((c) => !theirSet.has(c.cca2)),
  }
}

function Chips({ countries, empty }: { countries: Country[]; empty: string }) {
  if (countries.length === 0) {
    return <p className="text-xs" style={{ color: '#7c8194' }}>{empty}</p>
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {countries.map((c) => (
        <span key={c.cca2} className="et-chip" style={{ cursor: 'default' }}>
          <span aria-hidden>{getCountryFlag(c.countryName)}</span>
          {countryNamePt(c.cca2, c.countryName)}
        </span>
      ))}
    </div>
  )
}

export function CompareCard({ mine, theirs, theirName }: CompareCardProps) {
  const { emComum, soDela, soMeus } = compareVisited(mine, theirs)

  return (
    <div className="et-card p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Users size={16} style={{ color: '#a78bfa' }} />
        <h2 className="text-lg font-normal" style={{ color: '#f0f2f8' }}>
          Você e @{theirName}
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-px rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        {[
          { label: 'em comum', value: emComum.length, color: '#a78bfa' },
          { label: `só @${theirName}`, value: soDela.length, color: '#7dd3fc' },
          { label: 'só você', value: soMeus.length, color: '#34d399' },
        ].map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-1 py-3" style={{ background: '#16181f' }}>
            <span className="text-2xl font-light" style={{ color: '#f0f2f8' }}>{s.value}</span>
            <span className="text-[11px] text-center px-1" style={{ color: s.color }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="et-label">Países em comum</h3>
        <Chips countries={emComum} empty="Vocês ainda não visitaram nenhum país em comum." />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="et-label">Ideias de destino: só @{theirName} visitou</h3>
        <Chips countries={soDela} empty={`Você já visitou todos os países de @${theirName}!`} />
      </div>
    </div>
  )
}
