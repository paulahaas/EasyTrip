import { NotFoundException } from '@nestjs/common';
import { CountryService } from './country.service';

function makeCountry(
  overrides: Partial<{
    cca2: string;
    cca3: string;
    name: string;
    capital: string;
    languages: string[];
    languageCodes: string[];
    currencies: string[];
    currencyDetails: { code: string; name: string; symbol: string }[];
    continent: string;
    subregion: string;
  }> = {},
) {
  return {
    cca2: overrides.cca2 ?? 'BR',
    cca3: overrides.cca3 ?? 'BRA',
    name: overrides.name ?? 'Brazil',
    capital: overrides.capital ?? 'Brasília',
    languages: overrides.languages ?? ['Portuguese'],
    languageCodes: overrides.languageCodes ?? ['por'],
    currencies: overrides.currencies ?? ['BRL'],
    currencyDetails: overrides.currencyDetails ?? [
      { code: 'BRL', name: 'Brazilian real', symbol: 'R$' },
    ],
    continent: overrides.continent ?? 'Americas',
    subregion: overrides.subregion ?? 'South America',
    namePt: 'Brasil',
    idd: { root: '+5', suffixes: ['5'] },
  };
}

describe('CountryService', () => {
  let countries: { getByName: jest.Mock };
  let svc: CountryService;

  beforeEach(() => {
    countries = { getByName: jest.fn() };
    svc = new CountryService(countries as never);
  });

  it('retorna info completa com moeda', () => {
    countries.getByName.mockReturnValue(makeCountry());
    const res = svc.getCountryInfo('Brazil');
    expect(res).toMatchObject({
      capital: 'Brasília',
      idioma: 'Português',
      moeda: 'Real brasileiro (R$)',
      codigoMoeda: 'BRL',
      continente: 'Americas',
      cca2: 'BR',
      cca3: 'BRA',
      nome: 'Brasil',
      continenteNome: 'América do Sul',
      idiomas: ['Português'],
      ddi: '+55',
      maoDirecao: 'direita',
    });
    expect(res.fuso).toMatchObject({ fusoPrincipal: 'America/Sao_Paulo' });
  });

  it('inclui comidas típicas e regras do país quando existem', () => {
    countries.getByName.mockReturnValue(makeCountry());
    const br = svc.getCountryInfo('Brazil');
    expect(br.comidas.map((c) => c.nome)).toEqual(
      expect.arrayContaining(['Coxinha', 'Guaraná']),
    );
    expect(br.regras).toEqual([]);

    countries.getByName.mockReturnValue(makeCountry({ cca2: 'SG', cca3: 'SGP' }));
    const sg = svc.getCountryInfo('Singapore');
    expect(sg.regras.some((r) => r.tipo === 'proibido' && /chiclete/i.test(r.titulo))).toBe(true);
    expect(sg.maoDirecao).toBe('esquerda');
  });

  it('país sem conteúdo curado devolve listas vazias', () => {
    countries.getByName.mockReturnValue(makeCountry({ cca2: 'AQ', cca3: 'ATA' }));
    const res = svc.getCountryInfo('Antarctica');
    expect(res.comidas).toEqual([]);
    expect(res.regras).toEqual([]);
  });

  it('traduz a capital para exibição sem mudar o nome usado no clima', () => {
    countries.getByName.mockReturnValue(
      makeCountry({ cca2: 'JP', cca3: 'JPN', capital: 'Tokyo' }),
    );
    const jp = svc.getCountryInfo('Japan');
    expect(jp.capital).toBe('Tokyo');
    expect(jp.capitalNome).toBe('Tóquio');

    // capital igual em português: mantém
    countries.getByName.mockReturnValue(makeCountry());
    expect(svc.getCountryInfo('Brazil').capitalNome).toBe('Brasília');
  });

  it('população vem do Banco Mundial, formatada em pt-BR com o ano', () => {
    countries.getByName.mockReturnValue(makeCountry());
    const res = svc.getCountryInfo('Brazil');
    expect(res.populacao).toMatch(/^\d{1,3}(\.\d{3})+ \(\d{4}\)$/);
  });

  it('população "Não disponível" quando o país não tem dado', () => {
    countries.getByName.mockReturnValue(makeCountry({ cca3: 'ATA' }));
    expect(svc.getCountryInfo('Antarctica').populacao).toBe('Não disponível');
  });

  it('mantém o nome original da moeda quando não há tradução', () => {
    countries.getByName.mockReturnValue(
      makeCountry({
        currencyDetails: [{ code: 'XYZ', name: 'Moeda de teste', symbol: '¤' }],
      }),
    );
    expect(svc.getCountryInfo('X').moeda).toBe('Moeda de teste (¤)');
  });

  it('usa currencies[0] como fallback quando currencyDetails vazio', () => {
    countries.getByName.mockReturnValue(
      makeCountry({
        currencyDetails: [],
        currencies: ['EUR'],
      }),
    );
    const res = svc.getCountryInfo('TestLand');
    expect(res.moeda).toBe('EUR');
    expect(res.codigoMoeda).toBe('EUR');
  });

  it('retorna N/A quando sem moeda alguma', () => {
    countries.getByName.mockReturnValue(
      makeCountry({
        currencyDetails: [],
        currencies: [],
      }),
    );
    const res = svc.getCountryInfo('TestLand');
    expect(res.moeda).toBe('N/A');
    expect(res.codigoMoeda).toBe('N/A');
  });

  it('usa nome do país como capital fallback quando capital ausente', () => {
    countries.getByName.mockReturnValue(makeCountry({ capital: '' }));
    const res = svc.getCountryInfo('Brazil');
    expect(res.capital).toBe('Brazil');
  });

  it('usa N/A quando sem idiomas', () => {
    countries.getByName.mockReturnValue(
      makeCountry({ languages: [], languageCodes: [] }),
    );
    const res = svc.getCountryInfo('TestLand');
    expect(res.idioma).toBe('N/A');
  });

  it('lança NotFoundException para país inexistente', () => {
    countries.getByName.mockImplementation(() => {
      throw new NotFoundException('not found');
    });
    expect(() => svc.getCountryInfo('Neverland')).toThrow(NotFoundException);
  });
});
