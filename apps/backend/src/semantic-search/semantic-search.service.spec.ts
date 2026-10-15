/* eslint-disable @typescript-eslint/no-unsafe-assignment */
jest.mock('natural', () => ({ PorterStemmerPt: { stem: (t: string) => t } }));

import { SemanticSearchService } from './semantic-search.service';

function makeCountry(
  overrides: Partial<{
    cca2: string;
    cca3: string;
    name: string;
    continent: string;
    subregion: string;
    flag: string;
    landlocked: boolean;
    languages: string[];
    currencies: string[];
    latlng: [number, number];
  }> = {},
) {
  return {
    cca2: overrides.cca2 ?? 'BR',
    cca3: overrides.cca3 ?? 'BRA',
    name: overrides.name ?? 'Brazil',
    continent: overrides.continent ?? 'South America',
    subregion: overrides.subregion ?? 'South America',
    flag: overrides.flag ?? 'https://flagcdn.com/br.svg',
    landlocked: overrides.landlocked ?? false,
    languages: overrides.languages ?? ['Portuguese'],
    currencies: overrides.currencies ?? ['BRL'],
    latlng: overrides.latlng ?? ([-15, -47] as [number, number]),
    altSpellings: [],
    currencyDetails: [],
    capital: 'Brasília',
  };
}

function makeService(opts: {
  countries: ReturnType<typeof makeCountry>[];
  ftsResults: { cca2: string; bm25: number }[];
}) {
  const countriesSvc = {
    loadAll: jest.fn().mockResolvedValue(undefined),
    getAll: jest.fn().mockReturnValue(opts.countries),
  };
  const ftsSvc = {
    search: jest.fn().mockResolvedValue(opts.ftsResults),
  };
  return new SemanticSearchService(countriesSvc as never, ftsSvc as never);
}

describe('SemanticSearchService', () => {
  describe('search — com resultados FTS', () => {
    it('retorna resultado com campos corretos', async () => {
      const country = makeCountry();
      const svc = makeService({
        countries: [country],
        ftsResults: [{ cca2: 'BR', bm25: 5 }],
      });
      const res = await svc.search('Brasil');
      expect(res).toHaveLength(1);
      expect(res[0]).toMatchObject({
        cca2: 'BR',
        cca3: 'BRA',
        name: 'Brazil',
        continent: 'South America',
        flag: 'https://flagcdn.com/br.svg',
        matchedTags: expect.any(Array),
        score: expect.any(Number),
      });
    });

    it('score é bm25 + soma dos tag scores', async () => {
      const country = makeCountry();
      const svc = makeService({
        countries: [country],
        ftsResults: [{ cca2: 'BR', bm25: 10 }],
      });
      const res = await svc.search('Brasil');
      expect(res[0].score).toBeGreaterThanOrEqual(10);
    });

    it('ignora cca2 do FTS que não existe no getAll', async () => {
      const country = makeCountry({ cca2: 'BR' });
      const svc = makeService({
        countries: [country],
        ftsResults: [{ cca2: 'ZZ', bm25: 5 }],
      });
      const res = await svc.search('xyz');
      expect(res).toHaveLength(0);
    });

    it('ordena por score desc', async () => {
      const br = makeCountry({ cca2: 'BR', name: 'Brazil' });
      const jp = makeCountry({
        cca2: 'JP',
        name: 'Japan',
        continent: 'Asia',
        subregion: 'Eastern Asia',
        flag: 'https://flagcdn.com/jp.svg',
        languages: ['Japanese'],
        currencies: ['JPY'],
      });
      const svc = makeService({
        countries: [br, jp],
        ftsResults: [
          { cca2: 'JP', bm25: 3 },
          { cca2: 'BR', bm25: 8 },
        ],
      });
      const res = await svc.search('test');
      expect(res[0].cca2).toBe('BR');
    });

    it('limita a 15 resultados', async () => {
      const countries = Array.from({ length: 20 }, (_, i) =>
        makeCountry({ cca2: `C${i}`, name: `Country${i}` }),
      );
      const ftsResults = countries.map((c, i) => ({
        cca2: c.cca2,
        bm25: 20 - i,
      }));
      const svc = makeService({ countries, ftsResults });
      const res = await svc.search('country');
      expect(res.length).toBeLessThanOrEqual(15);
    });
  });

  describe('search — fallback quando FTS retorna vazio', () => {
    it('usa fallback por nome quando FTS vazio', async () => {
      const country = makeCountry();
      const svc = makeService({ countries: [country], ftsResults: [] });
      const res = await svc.search('Brazil');
      expect(res.some((r) => r.cca2 === 'BR')).toBe(true);
    });

    it('fallback retorna matchedTags vazio e score 1', async () => {
      const country = makeCountry();
      const svc = makeService({ countries: [country], ftsResults: [] });
      const res = await svc.search('Brazil');
      expect(res[0].matchedTags).toEqual([]);
      expect(res[0].score).toBe(1);
    });

    it('fallback funciona por cca2', async () => {
      const country = makeCountry({ cca2: 'BR' });
      const svc = makeService({ countries: [country], ftsResults: [] });
      const res = await svc.search('br');
      expect(res.some((r) => r.cca2 === 'BR')).toBe(true);
    });

    it('fallback retorna [] quando sem match', async () => {
      const country = makeCountry();
      const svc = makeService({ countries: [country], ftsResults: [] });
      const res = await svc.search('xyzwqnoresult999');
      expect(res).toEqual([]);
    });

    it('fallback normaliza diacríticos', async () => {
      const country = makeCountry({ name: 'Österreich' });
      const svc = makeService({ countries: [country], ftsResults: [] });
      const res = await svc.search('Osterreich');
      expect(res.some((r) => r.name === 'Österreich')).toBe(true);
    });
  });
});
