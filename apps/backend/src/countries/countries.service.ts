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
    currencies: Object.keys(c.currencies ?? {}),
    currencyDetails,
    flag: `https://flagcdn.com/${c.cca2.toLowerCase()}.svg`,
    altSpellings: c.altSpellings ?? [],
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
  private readonly byNameLower = new Map<string, CountryMeta>(
    this.all.map((c) => [c.name.toLowerCase(), c]),
  );

  constructor() {
    this.logger.log(`${this.all.length} países carregados (world-countries)`);
  }

  async loadAll(): Promise<void> {}

  getAll(): CountryMeta[] {
    return this.all;
  }

  getByName(name: string): CountryMeta {
    const lower = name.toLowerCase().trim();
    const direct = this.byNameLower.get(lower);
    if (direct) return direct;

    const match = this.all.find(
      (c) =>
        c.altSpellings.some((s) => s.toLowerCase() === lower) ||
        c.name.toLowerCase().includes(lower),
    );
    if (match) return match;

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
