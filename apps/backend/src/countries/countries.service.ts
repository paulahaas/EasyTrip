import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import worldCountries from 'world-countries';

export interface CurrencyDetail {
  code: string;
  name: string;
  symbol: string;
}

export interface CountryMeta {
  cca2: string;
  cca3: string;
  name: string;
  continent: string;
  subregion: string;
  capital: string;
  latlng: [number, number];
  landlocked: boolean;
  languages: string[];
  currencies: string[];
  currencyDetails: CurrencyDetail[];
  flag: string;
  altSpellings: string[];
  /** Nome em português (ex.: "Alemanha"); igual a `name` quando não há tradução. */
  namePt: string;
  /** Códigos ISO 639-3 dos idiomas, na mesma ordem de `languages`. */
  languageCodes: string[];
  idd?: { root?: string; suffixes?: string[] };
  /** Países com fronteira terrestre (ISO alpha-3). */
  borders: string[];
}

function normalizeName(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

const regionToContinent: Record<string, string> = {
  Antarctic: 'Antarctica',
};

function toMeta(c: (typeof worldCountries)[number]): CountryMeta {
  const currencyDetails: CurrencyDetail[] = Object.entries(
    c.currencies ?? {},
  ).map(([code, cur]) => ({
    code,
    name: cur.name ?? '',
    symbol: cur.symbol ?? '',
  }));

  return {
    cca2: c.cca2,
    cca3: c.cca3,
    name: c.name.common,
    continent: regionToContinent[c.region] ?? c.region,
    subregion: c.subregion ?? '',
    capital: c.capital?.[0] ?? '',
    latlng: c.latlng ?? [0, 0],
    landlocked: c.landlocked ?? false,
    languages: Object.values(c.languages ?? {}),
    languageCodes: Object.keys(c.languages ?? {}),
    namePt: c.translations?.por?.common ?? c.name.common,
    idd: c.idd,
    borders: c.borders ?? [],
    currencies: Object.keys(c.currencies ?? {}),
    currencyDetails,
    flag: `https://flagcdn.com/${c.cca2.toLowerCase()}.svg`,
    // Inclui os nomes em português (ex.: "Estados Unidos", "Alemanha") para
    // que a busca e o getByName funcionem com o nome em PT.
    altSpellings: [
      ...new Set([
        ...(c.altSpellings ?? []),
        ...[c.translations?.por?.common, c.translations?.por?.official].filter(
          (s): s is string => !!s,
        ),
      ]),
    ],
  };
}

@Injectable()
export class CountriesService {
  private readonly logger = new Logger(CountriesService.name);

  private readonly all: CountryMeta[] = worldCountries.map(toMeta);
  private readonly byCca2 = new Map<string, CountryMeta>(
    this.all.map((c) => [c.cca2, c]),
  );
  private readonly byCca3 = new Map<string, CountryMeta>(
    this.all.map((c) => [c.cca3, c]),
  );
  /** Nome normalizado (sem acento, minúsculo) → país, para nomes exatos. */
  private readonly byExactName = new Map<string, CountryMeta>();

  constructor() {
    // Nome comum tem prioridade sobre grafias alternativas de outros países.
    for (const c of this.all) this.byExactName.set(normalizeName(c.name), c);
    for (const c of this.all) {
      for (const alt of [c.namePt, ...c.altSpellings]) {
        const key = normalizeName(alt);
        if (key && !this.byExactName.has(key)) this.byExactName.set(key, c);
      }
    }
    this.logger.log(`${this.all.length} países carregados (world-countries)`);
  }

  getAll(): CountryMeta[] {
    return this.all;
  }

  /**
   * Resolve um nome de país (inglês, português, sigla ou grafia alternativa,
   * com ou sem acento). Busca parcial só vale com 4+ letras e quando aponta
   * para um único país — "a" ou "congo" não viram um país qualquer.
   */
  getByName(name: string): CountryMeta {
    const key = normalizeName(name);
    const exact =
      this.byExactName.get(key) ??
      (key.length === 2 || key.length === 3
        ? (this.getByCca2(key) ?? this.getByCca3(key))
        : null);
    if (exact) return exact;

    if (key.length >= 4) {
      const partial = this.all.filter((c) =>
        [c.name, c.namePt].some((n) => normalizeName(n).includes(key)),
      );
      if (partial.length === 1) return partial[0];
    }

    throw new NotFoundException(`País "${name}" não encontrado.`);
  }

  getByCca2(cca2: string): CountryMeta | null {
    return this.byCca2.get(cca2.toUpperCase()) ?? null;
  }

  getByCca3(cca3: string): CountryMeta | null {
    return this.byCca3.get(cca3.toUpperCase()) ?? null;
  }

  getBySubregion(subregion: string): CountryMeta[] {
    if (!subregion) return [];
    const lower = subregion.toLowerCase();
    return this.all.filter((c) => c.subregion.toLowerCase() === lower);
  }
}
