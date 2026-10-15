/**
 * Normaliza nomes de países para casar o que vem do RestCountries
 * com as `properties.name` do world-atlas TopoJSON.
 */
const ALIASES: Record<string, string> = {
  'united states': 'United States of America',
  usa: 'United States of America',
  'united kingdom': 'United Kingdom',
  uk: 'United Kingdom',
  russia: 'Russia',
  'south korea': 'South Korea',
  'north korea': 'North Korea',
  czechia: 'Czech Republic',
  myanmar: 'Myanmar',
  'republic of the congo': 'Republic of the Congo',
  'democratic republic of the congo': 'Democratic Republic of the Congo',
}

export function normalizeCountryName(raw: string): string {
  const lower = raw.trim().toLowerCase()
  return ALIASES[lower] ?? raw.trim()
}

export function sameCountry(a: string, b: string): boolean {
  const na = normalizeCountryName(a).toLowerCase()
  const nb = normalizeCountryName(b).toLowerCase()
  return na === nb
}
