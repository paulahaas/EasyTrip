import { Building2, Coins, Globe2, Users } from 'lucide-react'
import type { CountryInfo } from '@easytrip/shared'

interface InfoGridProps {
  info: CountryInfo
}

const items = [
  { key: 'capital',   label: 'Capital',    icon: Building2 },
  { key: 'idioma',    label: 'Idioma',     icon: Globe2 },
  { key: 'moeda',     label: 'Moeda',      icon: Coins },
  { key: 'populacao', label: 'População',  icon: Users },
] as const

export function InfoGrid({ info }: InfoGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map(({ key, label, icon: Icon }) => (
        <div
          key={key}
          className="rounded-lg p-3 flex flex-col gap-1.5"
          style={{ background: '#1e2029' }}
        >
          <div className="flex items-center gap-1.5 et-label">
            <Icon size={10} style={{ color: '#4f8ef7' }} />
            {label}
          </div>
          <span className="text-sm font-medium leading-snug" style={{ color: '#f0f2f8' }}>
            {info[key] || '—'}
          </span>
        </div>
      ))}
    </div>
  )
}
