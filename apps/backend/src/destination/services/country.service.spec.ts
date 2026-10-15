import { NotFoundException } from '@nestjs/common';
import { CountryService } from './country.service';

function makeCountry(
  overrides: Partial<{
    cca2: string;
    cca3: string;
    name: string;
    capital: string;
    languages: string[];
    currencies: string[];
    currencyDetails: { code: string; name: string; symbol: string }[];
    continent: string;
  }> = {},
) {
  return {
    cca2: overrides.cca2 ?? 'BR',
    cca3: overrides.cca3 ?? 'BRA',
    name: overrides.name ?? 'Brazil',
    capital: overrides.capital ?? 'Brasília',
    languages: overrides.languages ?? ['Portuguese'],
    currencies: overrides.currencies ?? ['BRL'],
    currencyDetails: overrides.currencyDetails ?? [
      { code: 'BRL', name: 'Brazilian real', symbol: 'R$' },
    ],
    continent: overrides.continent ?? 'South America',
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
      idioma: 'Portuguese',
      moeda: 'Brazilian real (R$)',
      codigoMoeda: 'BRL',
      populacao: 'N/A',
      continente: 'South America',
      cca2: 'BR',
      cca3: 'BRA',
    });
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
    countries.getByName.mockReturnValue(makeCountry({ languages: [] }));
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
