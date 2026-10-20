import { UtensilsCrossed } from 'lucide-react'
import type { TypicalFood } from '@easytrip/shared'

interface FoodsSectionProps {
  comidas: TypicalFood[]
}

export function FoodsSection({ comidas }: FoodsSectionProps) {
  if (comidas.length === 0) return null

  return (
    <section className="flex flex-col gap-2" aria-labelledby="foods-title">
      <h3 id="foods-title" className="flex items-center gap-1.5 et-label">
        <UtensilsCrossed size={10} style={{ color: '#4f8ef7' }} />
        Comidas e bebidas típicas
      </h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {comidas.map((comida) => (
          <li
            key={comida.nome}
            className="rounded-lg p-3 flex flex-col gap-0.5"
            style={{ background: '#1e2029' }}
          >
            <span className="text-sm font-medium" style={{ color: '#f0f2f8' }}>
              {comida.nome}
            </span>
            <span className="text-xs leading-snug" style={{ color: '#9ba1b4' }}>
              {comida.descricao}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
