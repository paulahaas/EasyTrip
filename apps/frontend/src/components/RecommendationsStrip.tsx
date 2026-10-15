import type { RecommendationItem } from '@easytrip/shared'
import { getCountryFlag } from '@/lib/flags'

interface RecommendationsStripProps {
  items: RecommendationItem[]
  onSelect: (countryName: string) => void
}

export function RecommendationsStrip({ items, onSelect }: RecommendationsStripProps) {
  if (items.length === 0) return null

  return (
    <div className="mb-5">
      <p className="et-label mb-2.5">Recomendados para você</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.cca2}
            type="button"
            onClick={() => onSelect(item.countryName)}
            className="et-chip et-chip-accent"
          >
            <span className="text-sm leading-none">{getCountryFlag(item.countryName)}</span>
            <span className="font-medium">{item.countryName}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
