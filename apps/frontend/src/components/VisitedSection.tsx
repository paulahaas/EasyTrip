import { X, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { useVisited } from '@/hooks/useVisited'
import { CountryFlag } from '@/components/CountryFlag'
import { countryNamePt } from '@/lib/countryName'

export function VisitedSection() {
  const { items, remove, setDate } = useVisited()

  async function changeDate(cca2: string, month: string) {
    try {
      // <input type="month"> devolve "AAAA-MM"; a API guarda o dia 1º do mês.
      await setDate(cca2, month ? `${month}-01` : null)
    } catch {
      toast.error('Não foi possível salvar a data')
    }
  }

  return (
    <div className="et-card p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <TrendingUp size={16} style={{ color: 'var(--color-success)' }} />
        <h3
          className="text-lg font-normal"
          style={{ color: 'var(--color-foreground)' }}
        >
          Países visitados
        </h3>
        <span className="et-label ml-auto">{items.length} país{items.length !== 1 ? 'es' : ''}</span>
      </div>

      {items.length === 0 ? (
        <p className="text-sm py-4 text-center" style={{ color: 'var(--color-muted)' }}>
          Marque países visitados na busca para ver suas estatísticas.
        </p>
      ) : (
        <>
          <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
            Informe quando foi cada viagem para montar sua linha do tempo.
          </p>
          <ul className="flex flex-col gap-2">
            {items.map((item) => {
              const nome = countryNamePt(item.cca2, item.countryName)
              return (
                <li
                  key={item.cca2}
                  className="flex items-center gap-3 rounded-lg px-3 py-2"
                  style={{ background: 'var(--color-surface2)' }}
                >
                  <CountryFlag cca2={item.cca2} />
                  <span className="text-sm flex-1 min-w-0 truncate" style={{ color: 'var(--color-foreground)' }}>
                    {nome}
                  </span>
                  <input
                    type="month"
                    aria-label={`Mês da viagem para ${nome}`}
                    value={item.visitedAt?.slice(0, 7) ?? ''}
                    max={new Date().toISOString().slice(0, 7)}
                    onChange={(e) => changeDate(item.cca2, e.target.value)}
                    className="text-xs rounded-md px-2 py-1 bg-transparent"
                    style={{
                      color: item.visitedAt ? 'var(--color-foreground)' : 'var(--color-muted)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      colorScheme: 'dark',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => remove(item.cca2)}
                    className="cursor-pointer transition-colors"
                    style={{ color: 'var(--color-muted2)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-danger)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-muted2)' }}
                    aria-label={`Remover ${nome}`}
                  >
                    <X size={13} />
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}
