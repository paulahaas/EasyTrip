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

export const CONTINENT_TOTALS: Record<ContinentKey, number> = {
  Africa: 54,
  Antarctica: 1,
  Asia: 50,
  Europe: 53,
  'North America': 41,
  Oceania: 25,
  'South America': 14,
};

export function isContinentKey(value: string): value is ContinentKey {
  return (CONTINENT_KEYS as readonly string[]).includes(value);
}
