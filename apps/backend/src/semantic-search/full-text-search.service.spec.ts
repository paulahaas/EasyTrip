jest.mock('natural', () => ({ PorterStemmerPt: { stem: (t: string) => t } }));

import { FullTextSearchService } from './full-text-search.service';

function makeCountry(
  overrides: Partial<{
    cca2: string;
    cca3: string;
    name: string;
    continent: string;
    subregion: string;
    capital: string;
    languages: string[];
    currencies: string[];
    currencyDetails: { code: string; name: string; symbol: string }[];
    landlocked: boolean;
    latlng: [number, number];
    flag: string;
    altSpellings: string[];
  }> = {},
) {
  return {
    cca2: overrides.cca2 ?? 'BR',
    cca3: overrides.cca3 ?? 'BRA',
    name: overrides.name ?? 'Brazil',
    continent: overrides.continent ?? 'South America',
    subregion: overrides.subregion ?? 'South America',
    capital: overrides.capital ?? 'Brasília',
    languages: overrides.languages ?? ['Portuguese'],
    currencies: overrides.currencies ?? ['BRL'],
    currencyDetails: overrides.currencyDetails ?? [
      { code: 'BRL', name: 'Brazilian real', symbol: 'R$' },
    ],
    landlocked: overrides.landlocked ?? false,
    latlng: overrides.latlng ?? ([-15, -47] as [number, number]),
    flag: overrides.flag ?? 'https://flagcdn.com/br.svg',
    altSpellings: overrides.altSpellings ?? ['BR', 'Brasil'],
  };
}

function makeService(countries: ReturnType<typeof makeCountry>[]) {
  const countriesSvc = {
    loadAll: jest.fn().mockResolvedValue(undefined),
    getAll: jest.fn().mockReturnValue(countries),
  };
  return new FullTextSearchService(countriesSvc as never);
}

describe('FullTextSearchService', () => {
  describe('buildIndex', () => {
    it('constrói índice com os países', async () => {
      const svc = makeService([makeCountry()]);
      await svc.buildIndex();
      const res = await svc.search('Brazil');
      expect(res.length).toBeGreaterThan(0);
      expect(res[0].cca2).toBe('BR');
    });

    it('é idempotente — segundo build não duplica', async () => {
      const svc = makeService([makeCountry()]);
      await svc.buildIndex();
      await svc.buildIndex();
      const res = await svc.search('Brazil');
      expect(res).toHaveLength(1);
    });

    it('não indexa quando lista vazia', async () => {
      const svc = makeService([]);
      await svc.buildIndex();
      const res = await svc.search('Brazil');
      expect(res).toEqual([]);
    });
  });

  describe('search', () => {
    let svc: FullTextSearchService;

    beforeEach(async () => {
      svc = makeService([
        makeCountry({
          cca2: 'BR',
          name: 'Brazil',
          altSpellings: ['BR', 'Brasil'],
        }),
        makeCountry({
          cca2: 'JP',
          name: 'Japan',
          continent: 'Asia',
          subregion: 'Eastern Asia',
          languages: ['Japanese'],
          currencies: ['JPY'],
          currencyDetails: [],
          altSpellings: ['JP', 'Nippon'],
          latlng: [36, 138],
        }),
        makeCountry({
          cca2: 'FR',
          name: 'France',
          continent: 'Europe',
          subregion: 'Western Europe',
          languages: ['French'],
          currencies: ['EUR'],
          currencyDetails: [],
          altSpellings: ['FR'],
          latlng: [46, 2],
        }),
      ]);
      await svc.buildIndex();
    });

    it('encontra Brasil por nome', async () => {
      const res = await svc.search('Brazil');
      expect(res.some((r) => r.cca2 === 'BR')).toBe(true);
    });

    it('encontra Brasil por altSpelling (Brasil)', async () => {
      const res = await svc.search('Brasil');
      expect(res.some((r) => r.cca2 === 'BR')).toBe(true);
    });

    it('encontra Japan', async () => {
      const res = await svc.search('Japan');
      expect(res.some((r) => r.cca2 === 'JP')).toBe(true);
    });

    it('retorna bm25 > 0 para hits', async () => {
      const res = await svc.search('Brazil');
      for (const r of res) {
        expect(r.bm25).toBeGreaterThan(0);
      }
    });

    it('retorna [] para query sem match', async () => {
      const res = await svc.search('xyzwqabc123noresult');
      expect(res).toEqual([]);
    });

    it('faz rebuild lazy se índice não estava pronto', async () => {
      const fresh = makeService([makeCountry()]);
      const res = await fresh.search('Brazil');
      expect(res.length).toBeGreaterThan(0);
    });

    it('normaliza diacríticos na query', async () => {
      const res = await svc.search('Bràzil');
      expect(res.some((r) => r.cca2 === 'BR')).toBe(true);
    });
  });
});
