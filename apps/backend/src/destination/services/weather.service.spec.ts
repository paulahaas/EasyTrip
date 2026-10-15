/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { InternalServerErrorException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { WeatherService } from './weather.service';

function makeService(apiKey: string | undefined = 'test-key') {
  const response = {
    weather: [{ description: 'céu limpo' }],
    main: { temp: 22.4, feels_like: 20.1, humidity: 60 },
  };
  const http = { get: jest.fn().mockReturnValue(of({ data: response })) };
  const config = { get: jest.fn().mockReturnValue(apiKey) };
  return { svc: new WeatherService(http as never, config as never), http };
}

describe('WeatherService', () => {
  it('retorna dados de clima formatados', async () => {
    const { svc } = makeService();
    const res = await svc.getWeather('Tokyo');
    expect(res).toMatchObject({
      descricao: 'céu limpo',
      temperatura: '22°C',
      sensacao: '20°C',
      umidade: '60%',
    });
  });

  it('lança InternalServerErrorException sem apiKey', async () => {
    const http = { get: jest.fn() };
    const config = { get: jest.fn().mockReturnValue(undefined) };
    const svc = new WeatherService(http as never, config as never);
    await expect(svc.getWeather('Tokyo')).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
  });

  it('normaliza diacríticos na cidade (Brasília → Brasilia)', async () => {
    const { svc, http } = makeService();
    await svc.getWeather('Brasília');
    const [, opts] = http.get.mock.calls[0];
    expect(opts.params.q).toBe('Brasilia');
  });

  it('lança InternalServerErrorException em falha HTTP', async () => {
    const http = {
      get: jest
        .fn()
        .mockReturnValue(throwError(() => new Error('network error'))),
    };
    const config = { get: jest.fn().mockReturnValue('key') };
    const svc = new WeatherService(http as never, config as never);
    await expect(svc.getWeather('Tokyo')).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
  });
});
