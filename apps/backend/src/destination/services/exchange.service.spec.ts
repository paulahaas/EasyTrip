import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { ExchangeService } from './exchange.service';

// 1 real = 0,20 dólar e 31,4 ienes
const RATES = { BRL: 1, USD: 0.2, JPY: 31.4 };

function makeService(apiKey?: string, data: object = { rates: RATES, time_last_update_unix: 1_790_000_000 }) {
  const http = { get: jest.fn().mockReturnValue(of({ data })) };
  const config = { get: jest.fn().mockReturnValue(apiKey) };
  return { svc: new ExchangeService(http as never, config as never), http };
}

// Intl usa espaço não separável entre símbolo e valor.
const plain = (text: string) => text.replace(/ /g, ' ');

describe('ExchangeService', () => {
  it('sem chave usa o acesso aberto e devolve a cotação nos dois sentidos', async () => {
    const { svc, http } = makeService(undefined);
    const res = await svc.convertToBRL('USD');

    expect(http.get).toHaveBeenCalledWith('https://open.er-api.com/v6/latest/BRL');
    expect(res.moedaOrigem).toBe('USD');
    expect(plain(res.cotacaoEmBRL)).toBe('US$ 1,00 = R$ 5,00');
    expect(plain(res.umRealEm)).toBe('R$ 1,00 = US$ 0,20');
    expect(res.atualizadoEm).toBe(new Date(1_790_000_000 * 1000).toISOString());
  });

  it('com chave usa a API com chave (campo conversion_rates)', async () => {
    const { svc, http } = makeService('minha-chave', { conversion_rates: RATES });
    const res = await svc.convertToBRL('jpy');

    expect(http.get).toHaveBeenCalledWith(
      'https://v6.exchangerate-api.com/v6/minha-chave/latest/BRL',
    );
    expect(plain(res.umRealEm)).toBe('R$ 1,00 = JP¥ 31,40');
    // moeda fraca: mostra 100 unidades em vez de 1
    expect(plain(res.cotacaoEmBRL)).toBe('JP¥ 100,00 = R$ 3,18');
  });

  it('guarda a tabela em cache entre chamadas', async () => {
    const { svc, http } = makeService(undefined);
    await svc.convertToBRL('USD');
    await svc.convertToBRL('JPY');
    expect(http.get).toHaveBeenCalledTimes(1);
  });

  it('404 quando a moeda não está na tabela', async () => {
    const { svc } = makeService(undefined);
    await expect(svc.convertToBRL('XYZ')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('lança InternalServerErrorException em falha HTTP sem cache', async () => {
    const http = {
      get: jest.fn().mockReturnValue(throwError(() => new Error('network error'))),
    };
    const config = { get: jest.fn().mockReturnValue(undefined) };
    const svc = new ExchangeService(http as never, config as never);
    await expect(svc.convertToBRL('USD')).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
  });
});
