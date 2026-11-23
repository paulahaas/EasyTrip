import { describe, expect, it } from 'vitest'
import { CCN3_BY_CCA2 } from '@/lib/ccn3'
import geo from '../../../public/countries-110m.json'

describe('mapa do mundo × códigos', () => {
  it('todo país do world-atlas com id tem um cca2 correspondente', () => {
    const known = new Set(Object.values(CCN3_BY_CCA2))
    const ids = (geo as { objects: { countries: { geometries: { id?: string }[] } } })
      .objects.countries.geometries.map((g) => g.id)
      .filter((id): id is string => !!id)
    expect(ids.filter((id) => !known.has(id))).toEqual([])
  })

  it('países que falhavam pelo nome têm código', () => {
    for (const cca2 of ['CD', 'TR', 'BA', 'CI', 'SS', 'MK', 'DO', 'CF', 'CG']) {
      expect(CCN3_BY_CCA2[cca2]).toMatch(/^\d{3}$/)
    }
  })
})
