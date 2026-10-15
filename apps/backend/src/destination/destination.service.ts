import { Injectable } from '@nestjs/common';
import { CountryService } from './services/country.service';
import { WeatherService } from './services/weather.service';
import { ExchangeService } from './services/exchange.service';

@Injectable()
export class DestinationService {
  constructor(
    private readonly countryService: CountryService,
    private readonly weatherService: WeatherService,
    private readonly exchangeService: ExchangeService,
  ) {}

  async getDestination(name: string) {
    const pais = this.countryService.getCountryInfo(name);
    const clima = await this.weatherService.getWeather(pais.capital);
    const cambio = await this.exchangeService.convertToBRL(pais.codigoMoeda);

    return {
      destino: name,
      clima,
      informacoesDoPais: pais,
      cambio,
      geradoEm: new Date().toLocaleString('pt-BR'),
    };
  }
}
