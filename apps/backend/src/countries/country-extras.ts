import * as ct from 'countries-and-timezones';
import worldCountries from 'world-countries';
import { isContinentKey } from '@easytrip/shared';
import type { ContinentKey, TimezoneInfo } from '@easytrip/shared';

// Informações extras de cada país, todas calculadas offline.

const REGION_BY_CCA2 = new Map(
  worldCountries.map((c) => [c.cca2, { region: c.region, subregion: c.subregion }]),
);

/**
 * Continente usado por favoritos, visitados e estatísticas. O world-countries
 * agrupa tudo como "Americas"; aqui separamos América do Sul e do Norte
 * (Central e Caribe contam como América do Norte).
 */
export function continentKeyFor(cca2: string, fallback?: string): ContinentKey | null {
  const info = REGION_BY_CCA2.get(cca2.toUpperCase());
  if (!info) return fallback && isContinentKey(fallback) ? fallback : null;
  if (info.region === 'Americas') {
    return info.subregion === 'South America' ? 'South America' : 'North America';
  }
  if (info.region === 'Antarctic') return 'Antarctica';
  return isContinentKey(info.region) ? info.region : null;
}

const languageNames = new Intl.DisplayNames(['pt-BR'], { type: 'language' });

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Nome do idioma em português a partir do código ISO 639-3 (ex.: "por" → "Português"). */
export function languageNamePt(code: string, fallback: string): string {
  try {
    const name = languageNames.of(code);
    return name && name !== code ? capitalize(name) : fallback;
  } catch {
    return fallback;
  }
}

const CONTINENT_PT: Record<string, string> = {
  Africa: 'África',
  Americas: 'Américas',
  Antarctica: 'Antártida',
  Asia: 'Ásia',
  Europe: 'Europa',
  Oceania: 'Oceania',
};

const AMERICAS_SUBREGION_PT: Record<string, string> = {
  'South America': 'América do Sul',
  'North America': 'América do Norte',
  'Central America': 'América Central',
  Caribbean: 'Caribe',
};

/** Nome do continente para exibição (nas Américas, usa a sub-região). */
export function continentNamePt(continent: string, subregion: string): string {
  if (continent === 'Americas' && AMERICAS_SUBREGION_PT[subregion]) {
    return AMERICAS_SUBREGION_PT[subregion];
  }
  return CONTINENT_PT[continent] ?? continent;
}

/** Código de discagem internacional (ex.: Brasil "+55", EUA "+1"). */
export function callingCode(idd?: { root?: string; suffixes?: string[] }): string | null {
  if (!idd?.root) return null;
  const suffixes = idd.suffixes ?? [];
  return suffixes.length === 1 ? `${idd.root}${suffixes[0]}` : idd.root;
}

// Países e territórios onde se dirige pela esquerda (ISO alpha-2).
const LEFT_HAND_TRAFFIC = new Set([
  'AG', 'AI', 'AU', 'BB', 'BD', 'BM', 'BN', 'BS', 'BT', 'BW', 'CC', 'CK', 'CX',
  'CY', 'DM', 'FJ', 'FK', 'GB', 'GD', 'GG', 'GY', 'HK', 'ID', 'IE', 'IM', 'IN',
  'JE', 'JM', 'JP', 'KE', 'KI', 'KN', 'KY', 'LC', 'LK', 'LS', 'MO', 'MS', 'MT',
  'MU', 'MV', 'MW', 'MY', 'MZ', 'NA', 'NF', 'NP', 'NR', 'NU', 'NZ', 'PG', 'PK',
  'PN', 'SB', 'SC', 'SG', 'SH', 'SR', 'SZ', 'TC', 'TH', 'TK', 'TL', 'TO', 'TT',
  'TV', 'TZ', 'UG', 'VC', 'VG', 'VI', 'WS', 'ZA', 'ZM', 'ZW',
]);

export function drivingSide(cca2: string): 'esquerda' | 'direita' {
  return LEFT_HAND_TRAFFIC.has(cca2.toUpperCase()) ? 'esquerda' : 'direita';
}

// Fuso da capital para países com vários fusos cujo nome não bate com a capital.
const CAPITAL_TIMEZONE: Record<string, string> = {
  AU: 'Australia/Sydney',
  BR: 'America/Sao_Paulo',
  CA: 'America/Toronto',
  CN: 'Asia/Shanghai',
  CL: 'America/Santiago',
  EC: 'America/Guayaquil',
  ES: 'Europe/Madrid',
  KZ: 'Asia/Almaty',
  NZ: 'Pacific/Auckland',
  PT: 'Europe/Lisbon',
  US: 'America/New_York',
};

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[\s.'-]+/g, '_')
    .toLowerCase();
}

function offsetLabel(minutes: number): string {
  const sign = minutes < 0 ? '−' : '+';
  const abs = Math.abs(minutes);
  const h = String(Math.floor(abs / 60)).padStart(2, '0');
  const m = String(abs % 60).padStart(2, '0');
  return `UTC${sign}${h}:${m}`;
}

export function timezoneInfo(cca2: string, capital: string): TimezoneInfo | null {
  const country = ct.getCountry(cca2.toUpperCase());
  if (!country || country.timezones.length === 0) return null;

  // O pacote às vezes lista fusos de outros países (ex.: AU inclui Asia/Tokyo).
  const zones = country.timezones.filter((name) =>
    ct.getTimezone(name)?.countries.includes(country.id),
  );
  const own = zones.length > 0 ? zones : country.timezones;

  const capitalKey = normalize(capital);
  const main =
    CAPITAL_TIMEZONE[country.id] ??
    own.find((name) => normalize(name.split('/').pop() ?? '') === capitalKey) ??
    own[0];

  const offsets = [
    ...new Set(own.map((name) => ct.getTimezone(name)?.utcOffset ?? 0)),
  ].sort((a, b) => b - a);
  const fusos =
    offsets.length === 1
      ? offsetLabel(offsets[0])
      : `${offsetLabel(offsets[0])} a ${offsetLabel(offsets[offsets.length - 1])}`;

  return { fusoPrincipal: main, fusos, quantidade: offsets.length };
}
