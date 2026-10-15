import { History, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { getCountryFlag } from '@/lib/flags'

export function ProfileHistoryList() {
  const { entries, removeById, clear } = useSearchHistory()

  return (
    <div className="et-card p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <History size={16} style={{ color: '#7dd3fc' }} />
        <h3
          className="text-lg font-normal"
          style={{ color: '#f0f2f8' }}
        >
          Histórico de pesquisas
        </h3>
        <span className="et-label">{entries.length}/8</span>
        {entries.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clear}
            className="gap-1 text-xs ml-auto cursor-pointer"
            style={{ color: '#4e5468' }}
          >
            <Trash2 size={11} /> Limpar
          </Button>
        )}
      </div>

      {entries.length === 0 ? (
        <p className="text-sm py-4 text-center" style={{ color: '#7c8194' }}>
          Ainda sem pesquisas registradas.
        </p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between text-sm rounded-lg px-3 py-2.5"
              style={{ background: '#1e2029' }}
            >
              <span className="flex items-center gap-2.5" style={{ color: '#f0f2f8' }}>
                <span className="text-base leading-none">{getCountryFlag(entry.countryName)}</span>
                <span>{entry.countryName}</span>
              </span>
              <button
                type="button"
                onClick={() => removeById(entry.id)}
                className="cursor-pointer transition-colors"
                style={{ color: '#4e5468' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#4e5468' }}
                aria-label={`Remover ${entry.countryName}`}
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
