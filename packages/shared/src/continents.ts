export const CONTINENT_KEYS = [
  'Africa',
  'Antarctica',
  'Asia',
  'Europe',
  'North America',
  'Oceania',
  'South America',
] as const;

export type ContinentKey = (typeof CONTINENT_KEYS)[number];

/**
 * Quantos países e territórios do world-countries caem em cada continente
 * (mesma regra de `continentKeyFor` no backend). Um teste no backend garante
 * que estes números batem com a base — atualize os dois juntos.
 */
export const CONTINENT_TOTALS: Record<ContinentKey, number> = {
  Africa: 59,
  Antarctica: 5,
  Asia: 50,
  Europe: 53,
  'North America': 42,
  Oceania: 27,
  'South America': 14,
};

export function isContinentKey(value: string): value is ContinentKey {
  return (CONTINENT_KEYS as readonly string[]).includes(value);
}
