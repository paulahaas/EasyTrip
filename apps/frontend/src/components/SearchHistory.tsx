import { X } from 'lucide-react'

interface SearchHistoryProps {
  history: string[]
  onSelect: (query: string) => void
  onClear: () => void
}

export function SearchHistory({ history, onSelect, onClear }: SearchHistoryProps) {
  if (history.length === 0) return null

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2.5">
        <p className="et-label">Buscas recentes</p>
        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-1 text-[11px] transition-colors cursor-pointer"
          style={{ color: '#4e5468' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#4e5468' }}
        >
          <X size={11} /> Limpar
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onSelect(item)}
            className="et-chip"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}
