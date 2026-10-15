import type { ExchangeInfo } from '@easytrip/shared'
import { TrendingUp } from 'lucide-react'

interface ExchangeHighlightProps {
  cambio: ExchangeInfo
}

export function ExchangeHighlight({ cambio }: ExchangeHighlightProps) {
  if (cambio.moedaOrigem === 'BRL') return null

  return (
    <div
      className="rounded-lg p-4 flex items-center gap-4"
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
      <div>
        <p className="et-label mb-0.5">Câmbio para Real (BRL)</p>
        <p
          className="text-sm font-semibold"
          style={{
            background: 'linear-gradient(135deg, #4f8ef7, #7dd3fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {cambio.cotacaoEmBRL}
        </p>
      </div>
    </div>
  )
}
