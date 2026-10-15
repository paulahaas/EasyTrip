import { X, TrendingUp } from 'lucide-react'
import { useVisited } from '@/hooks/useVisited'
import { getCountryFlag } from '@/lib/flags'

export function VisitedSection() {
  const { items, remove } = useVisited()

  return (
    <div className="et-card p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <TrendingUp size={16} style={{ color: '#34d399' }} />
        <h3
          className="text-lg font-normal"
          style={{ color: '#f0f2f8' }}
        >
          Países visitados
        </h3>
        <span className="et-label ml-auto">{items.length} país{items.length !== 1 ? 'es' : ''}</span>
      </div>

      {items.length === 0 ? (
        <p className="text-sm py-4 text-center" style={{ color: '#7c8194' }}>
          Marque países visitados na busca para ver suas estatísticas.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item.cca2}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
              style={{ background: '#1e2029', color: '#f0f2f8', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <span>{getCountryFlag(item.countryName)}</span>
              <span>{item.countryName}</span>
              <button
                type="button"
                onClick={() => remove(item.cca2)}
                className="cursor-pointer transition-colors ml-0.5"
                style={{ color: '#4e5468' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#4e5468' }}
                aria-label={`Remover ${item.countryName}`}
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
