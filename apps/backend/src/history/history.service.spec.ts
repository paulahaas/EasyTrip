import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { HistoryService } from './history.service';

function makeRow(
  id: string,
  userId: string,
  overrides: Partial<{ cca2: string; query: string; countryName: string }> = {},
) {
  return {
    id,
    userId,
    query: overrides.query ?? 'Spain',
    countryName: overrides.countryName ?? 'Spain',
    cca2: overrides.cca2 ?? 'ES',
    createdAt: new Date(),
  };
}

describe('HistoryService', () => {
  let prisma: {
    searchHistory: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      delete: jest.Mock;
      deleteMany: jest.Mock;
    };
  };
  let countries: { getByName: jest.Mock };
  let service: HistoryService;

  beforeEach(() => {
    prisma = {
      searchHistory: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
      },
    };
    countries = { getByName: jest.fn() };
    service = new HistoryService(prisma as never, countries as never);
  });

  it('addFromQuery resolve country + salva + trima para 8', async () => {
    countries.getByName.mockReturnValueOnce({
      cca2: 'ES',
      cca3: 'ESP',
      name: 'Spain',
      continent: 'Europe',
      region: 'Europe',
      subregion: 'Southern Europe',
      borders: [],
    });
    prisma.searchHistory.create.mockResolvedValueOnce(makeRow('h1', 'u1'));
    prisma.searchHistory.findMany.mockResolvedValueOnce(
      Array.from({ length: 10 }, (_, i) => ({ id: `h${i}` })),
    );

    await service.addFromQuery('u1', ' spain ');

    expect(prisma.searchHistory.create).toHaveBeenCalledWith({
      data: {
        userId: 'u1',
        query: 'spain',
        countryName: 'Spain',
        cca2: 'ES',
      },
    });
    expect(prisma.searchHistory.deleteMany).toHaveBeenCalledWith({
      where: { id: { in: ['h8', 'h9'] } },
    });
  });

  it('addBulk ignora não-encontrados e deduplica', async () => {
    countries.getByName.mockImplementation((q: string) => {
      if (q.toLowerCase() === 'spain') {
        return {
          cca2: 'ES',
          cca3: 'ESP',
          name: 'Spain',
          continent: 'Europe',
          region: 'Europe',
          subregion: 'Southern Europe',
          borders: [],
        };
      }
      throw new NotFoundException();
    });
    prisma.searchHistory.create.mockImplementation(
      ({ data }: { data: { cca2: string } }) =>
        Promise.resolve(makeRow('hx', 'u1', { cca2: data.cca2 })),
    );
    prisma.searchHistory.findMany.mockResolvedValue([]);

    const res = await service.addBulk('u1', ['Spain', 'spain', 'Atlantida']);
    expect(res).toHaveLength(1);
    expect(countries.getByName).toHaveBeenCalledTimes(2); // dedup 'spain' case-insensitive
  });

  it('deleteById bloqueia entrada de outro usuário', async () => {
    prisma.searchHistory.findUnique.mockResolvedValueOnce(
      makeRow('h1', 'other-user'),
    );
    await expect(service.deleteById('u1', 'h1')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(prisma.searchHistory.delete).not.toHaveBeenCalled();
  });

  it('deleteById 404 em id inexistente', async () => {
    prisma.searchHistory.findUnique.mockResolvedValueOnce(null);
    await expect(service.deleteById('u1', 'nope')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('list retorna entradas mapeadas', async () => {
    prisma.searchHistory.findMany.mockResolvedValueOnce([makeRow('h1', 'u1')]);
    const res = await service.list('u1');
    expect(res).toHaveLength(1);
    expect(res[0]).toMatchObject({ id: 'h1', userId: 'u1', cca2: 'ES' });
  });

  it('deleteAll chama deleteMany corretamente', async () => {
    prisma.searchHistory.deleteMany.mockResolvedValueOnce({ count: 3 });
    await service.deleteAll('u1');
    expect(prisma.searchHistory.deleteMany).toHaveBeenCalledWith({
      where: { userId: 'u1' },
    });
  });

  it('deleteById deleta com sucesso quando pertence ao usuário', async () => {
    prisma.searchHistory.findUnique.mockResolvedValueOnce(makeRow('h1', 'u1'));
    prisma.searchHistory.delete.mockResolvedValueOnce(makeRow('h1', 'u1'));
    await service.deleteById('u1', 'h1');
    expect(prisma.searchHistory.delete).toHaveBeenCalledWith({
      where: { id: 'h1' },
    });
  });
});
