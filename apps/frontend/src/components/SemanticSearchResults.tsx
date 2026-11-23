import { Globe } from 'lucide-react'
import type { SemanticSearchResult } from '@easytrip/shared'
import { CountryFlag } from '@/components/CountryFlag'

interface SemanticSearchResultsProps {
  items: SemanticSearchResult[]
  onSelect?: (countryName: string) => void
}

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  Frio:             { bg: 'var(--color-tag-bg-blue)', color: 'var(--color-accent2)' },
  Quente:           { bg: 'var(--color-tag-bg-brown)', color: 'var(--color-tag-red)' },
  Tropical:         { bg: 'var(--color-tag-bg-green)', color: 'var(--color-tag-green)' },
  Polar:            { bg: 'var(--color-tag-bg-indigo)', color: 'var(--color-tag-indigo)' },
  'Clima ameno':    { bg: 'var(--color-tag-bg-olive)', color: 'var(--color-tag-lime)' },
  'Hemisfério Sul': { bg: 'var(--color-tag-bg-slate)', color: 'var(--color-accent2)' },
  'Hemisfério Norte': { bg: 'var(--color-tag-bg-slate)', color: 'var(--color-tag-red)' },
  Europa:           { bg: 'var(--color-tag-bg-violet)', color: 'var(--color-tag-violet)' },
  Ásia:             { bg: 'var(--color-tag-bg-red)', color: 'var(--color-tag-red)' },
  África:           { bg: 'var(--color-tag-bg-orange)', color: 'var(--color-tag-orange)' },
  Américas:         { bg: 'var(--color-tag-bg-navy)', color: 'var(--color-tag-blue)' },
  Oceania:          { bg: 'var(--color-tag-bg-teal)', color: 'var(--color-tag-teal)' },
  Brasil:           { bg: 'var(--color-tag-bg-forest)', color: 'var(--color-tag-green)' },
  Português:        { bg: 'var(--color-tag-bg-navy)', color: 'var(--color-tag-blue)' },
  Inglês:           { bg: 'var(--color-tag-bg-khaki)', color: 'var(--color-tag-yellow)' },
  Espanhol:         { bg: 'var(--color-tag-bg-pink)', color: 'var(--color-tag-pink)' },
  Euro:             { bg: 'var(--color-tag-bg-khaki)', color: 'var(--color-tag-yellow)' },
}

function TagBadge({ tag }: { tag: string }) {
  const colors = TAG_COLORS[tag] ?? { bg: 'rgba(255,255,255,0.06)', color: 'var(--color-muted)' }
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
      <div className="text-center py-10 text-sm animate-fade-in" style={{ color: 'var(--color-muted)' }}>
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
              style={{ background: 'var(--color-surface2)' }}
            >
              {item.flag ? (
                <img
                  src={item.flag}
                  alt={item.namePt || item.name}
                  className="et-flag h-8 max-w-[75%] object-contain"
                />
              ) : (
                <CountryFlag cca2={item.cca2} size={24} />
              )}
            </div>

            {/* Info */}
            <div className="p-2.5 flex flex-col gap-1.5 flex-1">
              <h3
                className="text-sm font-medium leading-tight"
                style={{ color: 'var(--color-foreground)' }}
              >
                {item.namePt || item.name}
              </h3>
              <p className="text-[11px]" style={{ color: 'var(--color-muted)' }}>
                {item.regionPt || item.subregion || item.continent}
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
