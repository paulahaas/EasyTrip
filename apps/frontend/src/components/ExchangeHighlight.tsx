import type { ExchangeInfo } from '@easytrip/shared'
import { TrendingUp } from 'lucide-react'

interface ExchangeHighlightProps {
  cambio: ExchangeInfo | null
}

const gradientText = {
  background: 'linear-gradient(135deg, #4f8ef7, #7dd3fc)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
} as const

export function ExchangeHighlight({ cambio }: ExchangeHighlightProps) {
  if (!cambio || cambio.moedaOrigem === 'BRL') return null

  const atualizado = new Date(cambio.atualizadoEm).toLocaleDateString('pt-BR')

  return (
    <div
      className="rounded-lg p-4 flex items-start gap-4"
      style={{
        background: 'linear-gradient(135deg, rgba(79,142,247,0.1) 0%, rgba(125,211,252,0.05) 100%)',
        border: '1px solid rgba(79,142,247,0.18)',
      }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: 'rgba(79,142,247,0.15)' }}
      >
        <TrendingUp size={16} style={{ color: '#7dd3fc' }} />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="et-label mb-0.5">Câmbio com o Real (BRL)</p>
        <p className="text-sm font-semibold" style={gradientText}>
          {cambio.umRealEm}
        </p>
        <p className="text-sm font-semibold" style={gradientText}>
          {cambio.cotacaoEmBRL}
        </p>
        <p className="text-[11px] mt-1" style={{ color: '#7c8194' }}>
          Cotação de {atualizado} ·{' '}
          <a
            href="https://www.exchangerate-api.com"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            Rates by ExchangeRate-API
          </a>
        </p>
      </div>
    </div>
  )
}
