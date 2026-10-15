import type { ContinentKey } from '@easytrip/shared'

export const CONTINENT_PT: Record<ContinentKey, string> = {
  Africa: 'África',
  Antarctica: 'Antártida',
  Asia: 'Ásia',
  Europe: 'Europa',
  'North America': 'América do Norte',
  Oceania: 'Oceania',
  'South America': 'América do Sul',
}

export const CONTINENT_PT_SHORT: Record<ContinentKey, string> = {
  Africa: 'África',
  Antarctica: 'Antártida',
  Asia: 'Ásia',
  Europe: 'Europa',
  'North America': 'A. Norte',
  Oceania: 'Oceania',
  'South America': 'A. Sul',
}

export function translateContinent(continent: string): string {
  return (CONTINENT_PT as Record<string, string>)[continent] ?? continent
}
