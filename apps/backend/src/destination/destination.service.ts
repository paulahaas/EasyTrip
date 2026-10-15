import { Injectable, Logger } from '@nestjs/common';
import { CountryService } from './services/country.service';
import { WeatherService } from './services/weather.service';
import { ExchangeService } from './services/exchange.service';

@Injectable()
export class DestinationService {
  private readonly logger = new Logger(DestinationService.name);

  constructor(
    private readonly countryService: CountryService,
    private readonly weatherService: WeatherService,
    private readonly exchangeService: ExchangeService,
  ) {}

  async getDestination(name: string) {
    const pais = this.countryService.getCountryInfo(name);
    // Clima e câmbio são opcionais: se a API externa falhar (ou a chave não
    // estiver configurada), o país ainda é exibido sem esses dados.
    const [clima, cambio] = await Promise.all([
      this.optional(this.weatherService.getWeather(pais.capital), 'clima'),
      this.optional(
        this.exchangeService.convertToBRL(pais.codigoMoeda),
        'câmbio',
      ),
    ]);

    return {
      destino: name,
      clima,
      informacoesDoPais: pais,
      cambio,
      geradoEm: new Date().toLocaleString('pt-BR'),
    };
  }

  private async optional<T>(promise: Promise<T>, what: string) {
    try {
      return await promise;
    } catch (err) {
      this.logger.warn(`${what} indisponível: ${(err as Error).message}`);
      return null;
    }
  }
}
