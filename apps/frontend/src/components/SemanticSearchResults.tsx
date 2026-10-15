import { Globe } from 'lucide-react'
import type { SemanticSearchResult } from '@easytrip/shared'

interface SemanticSearchResultsProps {
  items: SemanticSearchResult[]
  onSelect?: (countryName: string) => void
}

function emojiFlag(cca2: string): string {
  const codePoints = cca2
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  Frio:             { bg: '#1e3a5f', color: '#7dd3fc' },
  Quente:           { bg: '#3d2a1e', color: '#fca5a5' },
  Tropical:         { bg: '#1e3a2f', color: '#86efac' },
  Polar:            { bg: '#1e2a3d', color: '#a5b4fc' },
  'Clima ameno':    { bg: '#1e2a1e', color: '#a3e635' },
  'Hemisfério Sul': { bg: '#1a1d28', color: '#7dd3fc' },
  'Hemisfério Norte': { bg: '#1a1d28', color: '#fca5a5' },
  Europa:           { bg: '#2a1e3a', color: '#c4b5fd' },
  Ásia:             { bg: '#3a1e1e', color: '#fca5a5' },
  África:           { bg: '#3a2a1e', color: '#fdba74' },
  Américas:         { bg: '#1e2a3a', color: '#93c5fd' },
  Oceania:          { bg: '#1e3a3a', color: '#5eead4' },
  Brasil:           { bg: '#1e3a1e', color: '#86efac' },
  Português:        { bg: '#1e2a3a', color: '#93c5fd' },
  Inglês:           { bg: '#2a2a1e', color: '#fde68a' },
  Espanhol:         { bg: '#3a1e2a', color: '#f9a8d4' },
  Euro:             { bg: '#2a2a1e', color: '#fde68a' },
}

function TagBadge({ tag }: { tag: string }) {
  const colors = TAG_COLORS[tag] ?? { bg: 'rgba(255,255,255,0.06)', color: '#7c8194' }
  return (
    <span
      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
      style={{ background: colors.bg, color: colors.color, border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {tag}
    </span>
  )
}

export function SemanticSearchResults({ items, onSelect }: SemanticSearchResultsProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-10 text-sm animate-fade-in" style={{ color: '#7c8194' }}>
        Nenhum país encontrado para essa busca.
      </div>
    )
  }

  return (
    <div className="mb-6 animate-fade-up">
      <div className="flex items-center gap-2 mb-3 et-label">
        <Globe size={12} />
        {items.length} resultado{items.length !== 1 ? 's' : ''}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((item) => (
          <button
            key={item.cca2}
            type="button"
            onClick={() => onSelect?.(item.name)}
            className="et-card et-card-hover text-left p-0 overflow-hidden flex flex-col cursor-pointer"
          >
            {/* Flag area */}
            <div
              className="w-full h-16 flex items-center justify-center shrink-0"
              style={{ background: '#1e2029' }}
            >
              {item.flag ? (
                <img
                  src={item.flag}
                  alt={item.name}
                  className="et-flag h-8 max-w-[75%] object-contain"
                />
              ) : (
                <span className="text-2xl">{emojiFlag(item.cca2)}</span>
              )}
            </div>

            {/* Info */}
            <div className="p-2.5 flex flex-col gap-1.5 flex-1">
              <h3
                className="text-sm font-medium leading-tight"
                style={{ color: '#f0f2f8' }}
              >
                {item.name}
              </h3>
              <p className="text-[11px]" style={{ color: '#7c8194' }}>
                {item.subregion || item.continent}
              </p>
              {item.matchedTags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {item.matchedTags.slice(0, 2).map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
