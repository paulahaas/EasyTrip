import { describe, expect, it } from 'vitest'
import { normalizeCountryName, sameCountry } from './countryMatch'

describe('countryMatch', () => {
  it('normaliza aliases conhecidos', () => {
    expect(normalizeCountryName('usa')).toBe('United States of America')
    expect(normalizeCountryName('UK')).toBe('United Kingdom')
    expect(normalizeCountryName('Czechia')).toBe('Czech Republic')
  })

  it('sameCountry é case-insensitive', () => {
    expect(sameCountry('Brazil', 'BRAZIL')).toBe(true)
    expect(sameCountry('USA', 'United States of America')).toBe(true)
    expect(sameCountry('Spain', 'France')).toBe(false)
  })
})
