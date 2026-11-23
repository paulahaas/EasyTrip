import type { ContinentKey } from '@easytrip/shared'

/** Cor de cada continente no mapa e no gráfico (tokens em styles/globals.css). */
export const CONTINENT_COLOR: Record<ContinentKey, string> = {
  Africa: 'var(--color-continent-africa)',
  Antarctica: 'var(--color-continent-antarctica)',
  Asia: 'var(--color-continent-asia)',
  Europe: 'var(--color-accent)',
  'North America': 'var(--color-continent-north-america)',
  Oceania: 'var(--color-continent-oceania)',
  'South America': 'var(--color-continent-south-america)',
}

export function continentColor(continent: string): string {
  return (CONTINENT_COLOR as Record<string, string>)[continent] ?? 'var(--color-accent)'
}
