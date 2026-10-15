import { DestinationService } from './destination.service';

describe('DestinationService', () => {
  const countryInfo = {
    capital: 'Tokyo',
    idioma: 'Japanese',
    moeda: 'Japanese yen (¥)',
    codigoMoeda: 'JPY',
    populacao: 'N/A',
    continente: 'Asia',
    cca2: 'JP',
    cca3: 'JPN',
  };

  const weather = {
    descricao: 'céu limpo',
    temperatura: '22°C',
    sensacao: '20°C',
    umidade: '60%',
  };

  const exchange = { moedaOrigem: 'JPY', cotacaoEmBRL: '1 JPY = R$ 0.03' };

  function makeService() {
    const country = {
      getCountryInfo: jest.fn().mockReturnValue(countryInfo),
    };
    const weatherSvc = { getWeather: jest.fn().mockResolvedValue(weather) };
    const exchangeSvc = { convertToBRL: jest.fn().mockResolvedValue(exchange) };
    const svc = new DestinationService(
      country as never,
      weatherSvc as never,
      exchangeSvc as never,
    );
    return { svc, country, weatherSvc, exchangeSvc };
  }

  it('agrega país + clima + câmbio', async () => {
    const { svc } = makeService();
    const res = await svc.getDestination('Japan');
    expect(res).toMatchObject({
      destino: 'Japan',
      clima: weather,
      informacoesDoPais: countryInfo,
      cambio: exchange,
    });
    expect(typeof res.geradoEm).toBe('string');
  });

  it('passa capital ao weatherService', async () => {
    const { svc, weatherSvc } = makeService();
    await svc.getDestination('Japan');
    expect(weatherSvc.getWeather).toHaveBeenCalledWith('Tokyo');
  });

  it('passa codigoMoeda ao exchangeService', async () => {
    const { svc, exchangeSvc } = makeService();
    await svc.getDestination('Japan');
    expect(exchangeSvc.convertToBRL).toHaveBeenCalledWith('JPY');
  });

  it('propaga erro do countryService', async () => {
    const { svc, country } = makeService();
    country.getCountryInfo.mockImplementation(() => {
      throw new Error('not found');
    });
    await expect(svc.getDestination('Unknown')).rejects.toThrow('not found');
  });
});
