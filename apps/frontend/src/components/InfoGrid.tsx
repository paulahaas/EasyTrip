import { useEffect, useState } from 'react'
import {
  Building2,
  Car,
  Clock,
  Coins,
  Globe2,
  Phone,
  Users,
  type LucideIcon,
} from 'lucide-react'
import type { CountryInfo } from '@easytrip/shared'

interface InfoGridProps {
  info: CountryInfo
}

interface Item {
  key: string
  label: string
  icon: LucideIcon
  value: string
  hint?: string
}

/** Hora atual num fuso IANA, atualizada a cada 30 s. */
function useLocalTime(timeZone: string | undefined) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    if (!timeZone) return
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [timeZone])
  if (!timeZone) return null
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'short',
    }).format(now)
  } catch {
    return null
  }
}

export function InfoGrid({ info }: InfoGridProps) {
  const localTime = useLocalTime(info.fuso?.fusoPrincipal)

  const items: Item[] = [
    { key: 'capital', label: 'Capital', icon: Building2, value: info.capital },
    {
      key: 'idioma',
      label: info.idiomas.length > 1 ? 'Idiomas' : 'Idioma',
      icon: Globe2,
      value: info.idiomas.slice(0, 3).join(', ') || info.idioma,
    },
    { key: 'moeda', label: 'Moeda', icon: Coins, value: info.moeda },
    { key: 'populacao', label: 'População', icon: Users, value: info.populacao },
  ]
  if (info.fuso) {
    items.push({
      key: 'hora',
      label: 'Hora local (capital)',
      icon: Clock,
      value: localTime ?? '—',
      hint:
        info.fuso.quantidade > 1
          ? `${info.fuso.quantidade} fusos: ${info.fuso.fusos}`
          : info.fuso.fusos,
    })
  }
  if (info.ddi) {
    items.push({ key: 'ddi', label: 'Código de discagem', icon: Phone, value: info.ddi })
  }
  items.push({
    key: 'mao',
    label: 'Trânsito',
    icon: Car,
    value: info.maoDirecao === 'esquerda' ? 'Mão inglesa (esquerda)' : 'Mão direita',
  })

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map(({ key, label, icon: Icon, value, hint }) => (
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
            {value || '—'}
          </span>
          {hint && (
            <span className="text-[11px] leading-snug" style={{ color: '#7c8194' }}>
              {hint}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
