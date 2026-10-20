import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import type { ExchangeInfo } from '@easytrip/shared';
import { firstValueFrom } from 'rxjs';

/** Resposta da ExchangeRate-API: com chave vem `conversion_rates`, no acesso aberto vem `rates`. */
interface ExchangeApiResponse {
  conversion_rates?: Record<string, number>;
  rates?: Record<string, number>;
  time_last_update_unix?: number;
}

interface RatesTable {
  /** Quanto 1 real vale em cada moeda. */
  rates: Record<string, number>;
  updatedAt: Date;
  fetchedAt: number;
}

// As cotações da ExchangeRate-API mudam uma vez por dia; 6 h de cache evita
// uma chamada externa a cada visita.
const CACHE_MS = 6 * 60 * 60 * 1000;

function money(value: number, currency: string): string {
  const decimals = value >= 100 ? 2 : value >= 1 ? 2 : 4;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  }).format(value);
}

@Injectable()
export class ExchangeService {
  private readonly keyedUrl = 'https://v6.exchangerate-api.com/v6';
  // Acesso aberto, sem chave (exige crédito à ExchangeRate-API na interface).
  private readonly openUrl = 'https://open.er-api.com/v6/latest/BRL';
  private cache: RatesTable | null = null;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async convertToBRL(currencyCode: string): Promise<ExchangeInfo> {
    const code = currencyCode.toUpperCase();
    const table = await this.ratesFromBRL();
    const perReal = table.rates[code];
    if (!perReal) {
      throw new NotFoundException(`Sem cotação para ${code}.`);
    }

    // Para moedas que valem bem menos que o real, mostra um valor redondo
    // (ex.: "JP¥ 100 = R$ 3,19" em vez de "JP¥ 1 = R$ 0,0319").
    const inReais = 1 / perReal;
    const units =
      inReais < 1 ? Math.min(10 ** Math.ceil(-Math.log10(inReais)), 1_000_000) : 1;

    return {
      moedaOrigem: code,
      cotacaoEmBRL: `${money(units, code)} = ${money(units * inReais, 'BRL')}`,
      umRealEm: `${money(1, 'BRL')} = ${money(perReal, code)}`,
      atualizadoEm: table.updatedAt.toISOString(),
    };
  }

  private async ratesFromBRL(): Promise<RatesTable> {
    if (this.cache && Date.now() - this.cache.fetchedAt < CACHE_MS) {
      return this.cache;
    }
    const apiKey = this.config.get<string>('EXCHANGERATE_API_KEY');
    const url = apiKey ? `${this.keyedUrl}/${apiKey}/latest/BRL` : this.openUrl;

    try {
      const { data } = await firstValueFrom(
        this.http.get<ExchangeApiResponse>(url),
      );
      const rates = data.conversion_rates ?? data.rates;
      if (!rates) throw new Error('resposta sem cotações');
      this.cache = {
        rates,
        updatedAt: data.time_last_update_unix
          ? new Date(data.time_last_update_unix * 1000)
          : new Date(),
        fetchedAt: Date.now(),
      };
      return this.cache;
    } catch {
      // Se a atualização falhar, uma tabela antiga ainda é melhor que nada.
      if (this.cache) return this.cache;
      throw new InternalServerErrorException('Falha ao obter câmbio.');
    }
  }
}
