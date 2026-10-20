import { AlertTriangle, Ban, ClipboardCheck, ShieldAlert, type LucideIcon } from 'lucide-react'
import type { CountryRule, RuleKind } from '@easytrip/shared'

interface RulesSectionProps {
  regras: CountryRule[]
  pais: string
}

const KIND: Record<RuleKind, { label: string; icon: LucideIcon; color: string; bg: string }> = {
  proibido: { label: 'Proibido', icon: Ban, color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
  obrigatorio: { label: 'Obrigatório', icon: ClipboardCheck, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  atencao: { label: 'Atenção', icon: AlertTriangle, color: '#7dd3fc', bg: 'rgba(125,211,252,0.1)' },
}

const ORDER: RuleKind[] = ['proibido', 'obrigatorio', 'atencao']

export function RulesSection({ regras, pais }: RulesSectionProps) {
  if (regras.length === 0) return null
  const sorted = [...regras].sort((a, b) => ORDER.indexOf(a.tipo) - ORDER.indexOf(b.tipo))

  return (
    <section className="flex flex-col gap-2" aria-labelledby="rules-title">
      <h3 id="rules-title" className="flex items-center gap-1.5 et-label">
        <ShieldAlert size={10} style={{ color: '#4f8ef7' }} />
        Regras importantes para turistas
      </h3>
      <ul className="flex flex-col gap-2">
        {sorted.map((regra) => {
          const kind = KIND[regra.tipo]
          const Icon = kind.icon
          return (
            <li
              key={regra.titulo}
              className="rounded-lg p-3 flex gap-3"
              style={{ background: '#1e2029' }}
            >
              <span
                className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                style={{ background: kind.bg }}
                aria-hidden
              >
                <Icon size={14} style={{ color: kind.color }} />
              </span>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm font-medium" style={{ color: '#f0f2f8' }}>
                  <span style={{ color: kind.color }}>{kind.label}:</span> {regra.titulo}
                </span>
                <span className="text-xs leading-snug" style={{ color: '#9ba1b4' }}>
                  {regra.descricao}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
      <p className="text-[11px] leading-snug" style={{ color: '#7c8194' }}>
        Informações gerais sobre {pais}, que podem mudar. Antes de viajar, confira o{' '}
        <a
          href="https://www.gov.br/mre/pt-br/assuntos/portal-consular"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2"
        >
          Portal Consular do Itamaraty
        </a>{' '}
        e o consulado do país.
      </p>
    </section>
  )
}
