/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RecommendationsService } from './recommendations.service';

const SUBREGION = 'Western Europe';

const META = {
  FR: {
    cca2: 'FR',
    cca3: 'FRA',
    name: 'France',
    continent: 'Europe',
    subregion: SUBREGION,
  },
  DE: {
    cca2: 'DE',
    cca3: 'DEU',
    name: 'Germany',
    continent: 'Europe',
    subregion: SUBREGION,
  },
  BE: {
    cca2: 'BE',
    cca3: 'BEL',
    name: 'Belgium',
    continent: 'Europe',
    subregion: SUBREGION,
  },
  NL: {
    cca2: 'NL',
    cca3: 'NLD',
    name: 'Netherlands',
    continent: 'Europe',
    subregion: SUBREGION,
  },
  AT: {
    cca2: 'AT',
    cca3: 'AUT',
    name: 'Austria',
    continent: 'Europe',
    subregion: SUBREGION,
  },
  CH: {
    cca2: 'CH',
    cca3: 'CHE',
    name: 'Switzerland',
    continent: 'Europe',
    subregion: SUBREGION,
  },
  LU: {
    cca2: 'LU',
    cca3: 'LUX',
    name: 'Luxembourg',
    continent: 'Europe',
    subregion: SUBREGION,
  },
  MC: {
    cca2: 'MC',
    cca3: 'MCO',
    name: 'Monaco',
    continent: 'Europe',
    subregion: SUBREGION,
  },
  LI: {
    cca2: 'LI',
    cca3: 'LIE',
    name: 'Liechtenstein',
    continent: 'Europe',
    subregion: SUBREGION,
  },
} as const;

function build(opts: {
  history: Array<{ cca2: string }>;
  wishlist?: Array<{ cca2: string }>;
  visited?: Array<{ cca2: string }>;
}) {
  const prisma = {
    searchHistory: {
      findMany: jest.fn().mockResolvedValue(
        opts.history.map((h, i) => ({
          id: `h${i}`,
          userId: 'u1',
          query: h.cca2,
          countryName: h.cca2,
          cca2: h.cca2,
          createdAt: new Date(Date.now() - i * 1000),
        })),
      ),
    },
    wishlist: { findMany: jest.fn().mockResolvedValue(opts.wishlist ?? []) },
    visitedCountry: {
      findMany: jest.fn().mockResolvedValue(opts.visited ?? []),
    },
  };

  const countries = {
    getByCca2: jest.fn((cca2: string) => (META as never)[cca2] ?? null),
    getBySubregion: jest.fn((subregion: string) =>
      Object.values(META).filter((m) => m.subregion === subregion),
    ),
  };

  return new RecommendationsService(prisma as never, countries as never);
}

describe('RecommendationsService', () => {
  it('retorna países da mesma sub-região com reason subregion', async () => {
    const svc = build({ history: [{ cca2: 'FR' }] });
    const res = await svc.forUser('u1');
    expect(res.length).toBeGreaterThan(0);
    for (const item of res) {
      expect(item.reason).toBe('subregion');
      expect(item.score).toBeGreaterThanOrEqual(1);
    }
  });

  it('exclui país que está no próprio histórico', async () => {
    const svc = build({ history: [{ cca2: 'FR' }] });
    const res = await svc.forUser('u1');
    expect(res.some((r) => r.cca2 === 'FR')).toBe(false);
  });

  it('exclui países em wishlist', async () => {
    const svc = build({
      history: [{ cca2: 'FR' }],
      wishlist: [{ cca2: 'DE' }],
    });
    const res = await svc.forUser('u1');
    expect(res.some((r) => r.cca2 === 'DE')).toBe(false);
  });

  it('exclui países em visited', async () => {
    const svc = build({ history: [{ cca2: 'FR' }], visited: [{ cca2: 'BE' }] });
    const res = await svc.forUser('u1');
    expect(res.some((r) => r.cca2 === 'BE')).toBe(false);
  });

  it('exclui todos os três simultaneamente', async () => {
    const svc = build({
      history: [{ cca2: 'FR' }],
      wishlist: [{ cca2: 'DE' }],
      visited: [{ cca2: 'BE' }],
    });
    const res = await svc.forUser('u1');
    for (const cca2 of ['FR', 'DE', 'BE']) {
      expect(res.some((r) => r.cca2 === cca2)).toBe(false);
    }
  });

  it('limita a 8 resultados', async () => {
    const svc = build({ history: [{ cca2: 'FR' }] });
    const res = await svc.forUser('u1');
    expect(res.length).toBeLessThanOrEqual(8);
  });

  it('history vazio → retorna []', async () => {
    const svc = build({ history: [] });
    expect(await svc.forUser('u1')).toEqual([]);
  });

  it('país sem subregion é ignorado graciosamente', async () => {
    const prisma = {
      searchHistory: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'h0',
            userId: 'u1',
            cca2: 'XX',
            countryName: 'XX',
            query: 'XX',
            createdAt: new Date(),
          },
        ]),
      },
      wishlist: { findMany: jest.fn().mockResolvedValue([]) },
      visitedCountry: { findMany: jest.fn().mockResolvedValue([]) },
    };
    const countries = {
      getByCca2: jest.fn().mockResolvedValue({ cca2: 'XX', subregion: '' }),
      getBySubregion: jest.fn().mockResolvedValue([]),
    };
    const svc = new RecommendationsService(prisma as never, countries as never);
    expect(await svc.forUser('u1')).toEqual([]);
  });

  it('score acumula quando país aparece em múltiplos históricos', async () => {
    const svc = build({ history: [{ cca2: 'FR' }, { cca2: 'DE' }] });
    const res = await svc.forUser('u1');
    const be = res.find((r) => r.cca2 === 'BE');
    expect(be).toBeDefined();
    expect(be!.score).toBe(2);
  });

  it('resultado tem campos corretos', async () => {
    const svc = build({ history: [{ cca2: 'FR' }] });
    const res = await svc.forUser('u1');
    const item = res[0];
    expect(item).toMatchObject({
      cca2: expect.any(String),
      cca3: expect.any(String),
      countryName: expect.any(String),
      continent: 'Europe',
      reason: 'subregion',
      score: expect.any(Number),
    });
  });
});
