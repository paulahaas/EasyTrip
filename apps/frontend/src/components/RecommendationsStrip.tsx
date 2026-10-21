import type { RecommendationItem } from '@easytrip/shared'
import { CountryFlag } from '@/components/CountryFlag'
import { countryNamePt } from '@/lib/countryName'

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
            <CountryFlag cca2={item.cca2} size={12} />
            <span className="font-medium">{countryNamePt(item.cca2, item.countryName)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
