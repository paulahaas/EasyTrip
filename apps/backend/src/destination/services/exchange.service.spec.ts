import { InternalServerErrorException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { ExchangeService } from './exchange.service';

function makeService(apiKey: string | undefined = 'test-key') {
  const response = { conversion_rates: { BRL: 0.037 } };
  const http = { get: jest.fn().mockReturnValue(of({ data: response })) };
  const config = { get: jest.fn().mockReturnValue(apiKey) };
  return { svc: new ExchangeService(http as never, config as never) };
}

describe('ExchangeService', () => {
  it('retorna cotação formatada', async () => {
    const { svc } = makeService();
    const res = await svc.convertToBRL('JPY');
    expect(res).toMatchObject({
      moedaOrigem: 'JPY',
      cotacaoEmBRL: '1 JPY = R$ 0.037',
    });
  });

  it('lança InternalServerErrorException sem apiKey', async () => {
    const http = { get: jest.fn() };
    const config = { get: jest.fn().mockReturnValue(undefined) };
    const svc = new ExchangeService(http as never, config as never);
    await expect(svc.convertToBRL('JPY')).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
  });

  it('lança InternalServerErrorException em falha HTTP', async () => {
    const http = {
      get: jest
        .fn()
        .mockReturnValue(throwError(() => new Error('network error'))),
    };
    const config = { get: jest.fn().mockReturnValue('key') };
    const svc = new ExchangeService(http as never, config as never);
    await expect(svc.convertToBRL('USD')).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
  });
});
