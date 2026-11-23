import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import type { WeatherInfo } from '@easytrip/shared';
import { firstValueFrom } from 'rxjs';

interface WeatherApiResponse {
  weather: Array<{ description: string }>;
  main: { temp: number; feels_like: number; humidity: number };
}

// Clima muda devagar; 10 min de cache poupa a cota da OpenWeather.
const CACHE_MS = 10 * 60 * 1000;
const MAX_CACHE = 500;

@Injectable()
export class WeatherService {
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';
  private readonly cache = new Map<string, { at: number; data: WeatherInfo }>();

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Clima atual da cidade. O código do país (ISO alpha-2) evita capitais
   * homônimas: "Kingston,JM" em vez de Kingston no Canadá.
   */
  async getWeather(city: string, cca2?: string): Promise<WeatherInfo> {
    const apiKey = this.config.get<string>('OPENWEATHER_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException(
        'Chave da OpenWeather não configurada.',
      );
    }

    const plainCity = city.normalize('NFD').replace(/[̀-ͯ]/g, '');
    const q = cca2 ? `${plainCity},${cca2.toUpperCase()}` : plainCity;

    const cached = this.cache.get(q);
    if (cached && Date.now() - cached.at < CACHE_MS) return cached.data;

    try {
      const { data } = await firstValueFrom(
        this.http.get<WeatherApiResponse>(`${this.baseUrl}/weather`, {
          params: { q, appid: apiKey, units: 'metric', lang: 'pt_br' },
        }),
      );

      const info: WeatherInfo = {
        descricao: data.weather[0].description,
        temperatura: `${Math.round(data.main.temp)}°C`,
        sensacao: `${Math.round(data.main.feels_like)}°C`,
        umidade: `${data.main.humidity}%`,
      };
      if (this.cache.size >= MAX_CACHE) this.cache.clear();
      this.cache.set(q, { at: Date.now(), data: info });
      return info;
    } catch {
      throw new InternalServerErrorException(
        `Falha ao obter clima para ${city}.`,
      );
    }
  }
}
