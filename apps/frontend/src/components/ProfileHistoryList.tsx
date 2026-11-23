import { History, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { CountryFlag } from '@/components/CountryFlag'
import { countryNamePt } from '@/lib/countryName'

export function ProfileHistoryList() {
  const { entries, removeById, clear } = useSearchHistory()

  return (
    <div className="et-card p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <History size={16} style={{ color: 'var(--color-accent2)' }} />
        <h3
          className="text-lg font-normal"
          style={{ color: 'var(--color-foreground)' }}
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
            style={{ color: 'var(--color-muted2)' }}
          >
            <Trash2 size={11} /> Limpar
          </Button>
        )}
      </div>

      {entries.length === 0 ? (
        <p className="text-sm py-4 text-center" style={{ color: 'var(--color-muted)' }}>
          Ainda sem pesquisas registradas.
        </p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between text-sm rounded-lg px-3 py-2.5"
              style={{ background: 'var(--color-surface2)' }}
            >
              <span className="flex items-center gap-2.5" style={{ color: 'var(--color-foreground)' }}>
                <CountryFlag cca2={entry.cca2} />
                <span>{entry.cca2 ? countryNamePt(entry.cca2, entry.countryName) : entry.countryName}</span>
              </span>
              <button
                type="button"
                onClick={() => removeById(entry.id)}
                className="cursor-pointer transition-colors"
                style={{ color: 'var(--color-muted2)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-danger)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-muted2)' }}
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
