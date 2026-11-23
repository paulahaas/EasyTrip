/**
 * Fallback por nome para casar países com `properties.name` do world-atlas
 * TopoJSON quando não há código numérico (ex.: Kosovo). O caminho principal
 * do mapa é pelo ccn3 — ver `lib/ccn3.ts`.
 */
const ALIASES: Record<string, string> = {
  'united states': 'United States of America',
  usa: 'United States of America',
  uk: 'United Kingdom',
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
