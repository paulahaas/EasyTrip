import { StatsService } from './stats.service';

describe('StatsService', () => {
  function makeService(
    groupResult: Array<{ continent: string; count: number }>,
  ) {
    const prisma = {
      visitedCountry: {
        groupBy: jest.fn().mockResolvedValue(
          groupResult.map((r) => ({
            continent: r.continent,
            _count: { _all: r.count },
          })),
        ),
      },
    };
    return new StatsService(prisma as never);
  }

  it('devolve todos os 7 continentes mesmo zerados', async () => {
    const svc = makeService([]);
    const res = await svc.continents('u1');
    expect(res.totalVisited).toBe(0);
    expect(res.perContinent).toHaveLength(7);
    for (const row of res.perContinent) {
      expect(row.visited).toBe(0);
      expect(row.percent).toBe(0);
    }
  });

  it('calcula percentuais com 1 decimal', async () => {
    const svc = makeService([{ continent: 'Europe', count: 10 }]);
    const res = await svc.continents('u1');
    expect(res.totalVisited).toBe(10);
    const europe = res.perContinent.find((r) => r.continent === 'Europe')!;
    expect(europe.visited).toBe(10);
    expect(europe.total).toBe(53);
    expect(europe.percent).toBe(18.9);
  });

  it('ignora continente desconhecido mas soma no total', async () => {
    const svc = makeService([
      { continent: 'Atlantis', count: 3 },
      { continent: 'Asia', count: 5 },
    ]);
    const res = await svc.continents('u1');
    expect(res.totalVisited).toBe(8);
    expect(res.perContinent.find((r) => r.continent === 'Asia')?.visited).toBe(
      5,
    );
  });
});
