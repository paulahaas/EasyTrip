import { Injectable, NotFoundException } from '@nestjs/common';
import { CountriesService } from '../../countries/countries.service';

@Injectable()
export class CountryService {
  constructor(private readonly countries: CountriesService) {}

  getCountryInfo(countryName: string) {
    const country = this.countries.getByName(countryName);
    if (!country) {
      throw new NotFoundException(`País "${countryName}" não encontrado.`);
    }

    const currency = country.currencyDetails[0];
    const moeda = currency
      ? `${currency.name} (${currency.symbol})`
      : (country.currencies[0] ?? 'N/A');

    return {
      capital: country.capital || country.name,
      idioma: country.languages[0] ?? 'N/A',
      moeda,
      codigoMoeda: country.currencies[0] ?? 'N/A',
      populacao: 'N/A',
      continente: country.continent,
      cca2: country.cca2,
      cca3: country.cca3,
    };
  }
}
