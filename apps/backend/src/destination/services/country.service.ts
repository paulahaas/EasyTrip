import { Injectable, NotFoundException } from '@nestjs/common';
import type { CountryInfo } from '@easytrip/shared';
import { COUNTRY_RULES } from '../../countries/content/rules';
import { TYPICAL_FOODS } from '../../countries/content/foods';
import { CountriesService } from '../../countries/countries.service';
import {
  callingCode,
  continentNamePt,
  drivingSide,
  languageNamePt,
  timezoneInfo,
} from '../../countries/country-extras';
import population from '../../countries/population.json';

const POPULATION = population as Record<string, { value: number; year: number }>;

// Nome da moeda em português a partir do código ISO 4217 (ex.: BRL → "Real brasileiro").
const currencyNames = new Intl.DisplayNames(['pt-BR'], { type: 'currency' });

function currencyName(code: string, fallback: string): string {
  try {
    const name = currencyNames.of(code);
    // Sem tradução, o Intl devolve o próprio código.
    return name && name !== code
      ? name.charAt(0).toUpperCase() + name.slice(1)
      : fallback;
  } catch {
    return fallback;
  }
}

@Injectable()
export class CountryService {
  constructor(private readonly countries: CountriesService) {}

  getCountryInfo(countryName: string): CountryInfo {
    const country = this.countries.getByName(countryName);
    if (!country) {
      throw new NotFoundException(`País "${countryName}" não encontrado.`);
    }

    const currency = country.currencyDetails[0];
    const moeda = currency
      ? `${currencyName(currency.code, currency.name)} (${currency.symbol})`
      : (country.currencies[0] ?? 'N/A');

    const pop = POPULATION[country.cca3];
    const populacao = pop
      ? `${pop.value.toLocaleString('pt-BR')} (${pop.year})`
      : 'Não disponível';

    const idiomas = country.languageCodes.map((code, i) =>
      languageNamePt(code, country.languages[i]),
    );
    const capital = country.capital || country.name;

    return {
      capital,
      idioma: idiomas[0] ?? 'N/A',
      moeda,
      codigoMoeda: country.currencies[0] ?? 'N/A',
      populacao,
      continente: country.continent,
      cca2: country.cca2,
      cca3: country.cca3,
      nome: country.namePt,
      continenteNome: continentNamePt(country.continent, country.subregion),
      idiomas,
      fuso: timezoneInfo(country.cca2, capital),
      ddi: callingCode(country.idd),
      maoDirecao: drivingSide(country.cca2),
      comidas: TYPICAL_FOODS[country.cca2] ?? [],
      regras: COUNTRY_RULES[country.cca2] ?? [],
    };
  }
}
