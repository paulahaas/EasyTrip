/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConflictException } from '@nestjs/common';
import { VisitedService } from './visited.service';

function makeRow(
  overrides: Partial<{
    id: string;
    cca2: string;
    countryName: string;
    continent: string;
  }> = {},
) {
  return {
    id: overrides.id ?? 'v1',
    userId: 'u1',
    cca2: overrides.cca2 ?? 'JP',
    countryName: overrides.countryName ?? 'Japan',
    continent: overrides.continent ?? 'Asia',
    createdAt: new Date('2026-02-01T00:00:00Z'),
  };
}

function makePrisma() {
  return {
    visitedCountry: {
      findMany: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
  };
}

describe('VisitedService', () => {
  let prisma: ReturnType<typeof makePrisma>;
  let svc: VisitedService;

  beforeEach(() => {
    prisma = makePrisma();
    svc = new VisitedService(prisma as never);
  });

  describe('list', () => {
    it('retorna lista mapeada como DTO', async () => {
      prisma.visitedCountry.findMany.mockResolvedValue([makeRow()]);
      const res = await svc.list('u1');
      expect(res).toHaveLength(1);
      expect(res[0]).toMatchObject({
        id: 'v1',
        userId: 'u1',
        cca2: 'JP',
        countryName: 'Japan',
        continent: 'Asia',
        createdAt: '2026-02-01T00:00:00.000Z',
      });
    });

    it('retorna [] quando vazio', async () => {
      prisma.visitedCountry.findMany.mockResolvedValue([]);
      expect(await svc.list('u1')).toEqual([]);
    });
  });

  describe('add', () => {
    it('cria com cca2 uppercase e retorna DTO', async () => {
      prisma.visitedCountry.create.mockResolvedValue(makeRow({ cca2: 'JP' }));
      const res = await svc.add('u1', {
        cca2: 'jp',
        countryName: 'Japan',
        continent: 'Asia',
      });
      expect(prisma.visitedCountry.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ cca2: 'JP' }),
        }),
      );
      expect(res.cca2).toBe('JP');
    });

    it('lança ConflictException em duplicata (P2002)', async () => {
      prisma.visitedCountry.create.mockRejectedValue({ code: 'P2002' });
      await expect(
        svc.add('u1', { cca2: 'JP', countryName: 'Japan', continent: 'Asia' }),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('relança erros desconhecidos', async () => {
      prisma.visitedCountry.create.mockRejectedValue(new Error('timeout'));
      await expect(
        svc.add('u1', { cca2: 'JP', countryName: 'Japan', continent: 'Asia' }),
      ).rejects.toThrow('timeout');
    });
  });

  describe('remove', () => {
    it('chama deleteMany com userId e cca2 uppercase', async () => {
      prisma.visitedCountry.deleteMany.mockResolvedValue({ count: 1 });
      await svc.remove('u1', 'jp');
      expect(prisma.visitedCountry.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'u1', cca2: 'JP' },
      });
    });
  });
});
