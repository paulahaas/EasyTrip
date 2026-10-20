/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConflictException, NotFoundException } from '@nestjs/common';
import { VisitedService } from './visited.service';

function makeRow(
  overrides: Partial<{
    id: string;
    cca2: string;
    countryName: string;
    continent: string;
    visitedAt: Date | null;
  }> = {},
) {
  return {
    id: overrides.id ?? 'v1',
    userId: 'u1',
    cca2: overrides.cca2 ?? 'JP',
    countryName: overrides.countryName ?? 'Japan',
    continent: overrides.continent ?? 'Asia',
    visitedAt: overrides.visitedAt ?? null,
    createdAt: new Date('2026-02-01T00:00:00Z'),
  };
}

function makePrisma() {
  return {
    visitedCountry: {
      findMany: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
      updateMany: jest.fn(),
      findUniqueOrThrow: jest.fn(),
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

  describe('continente e data da viagem', () => {
    it('recalcula o continente das Américas pelo código do país', async () => {
      prisma.visitedCountry.create.mockResolvedValue(makeRow({ cca2: 'BR' }));
      await svc.add('u1', { cca2: 'br', countryName: 'Brazil', continent: 'Americas' });
      expect(prisma.visitedCountry.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          cca2: 'BR',
          continent: 'South America',
          visitedAt: null,
        }),
      });
    });

    it('salva a data da viagem quando informada', async () => {
      prisma.visitedCountry.create.mockResolvedValue(
        makeRow({ visitedAt: new Date('2024-03-01T00:00:00Z') }),
      );
      const res = await svc.add('u1', {
        cca2: 'JP',
        countryName: 'Japan',
        continent: 'Asia',
        visitedAt: '2024-03-01',
      });
      expect(prisma.visitedCountry.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ visitedAt: new Date('2024-03-01') }),
      });
      expect(res.visitedAt).toBe('2024-03-01');
    });

    it('setVisitedAt atualiza e devolve o país', async () => {
      prisma.visitedCountry.updateMany.mockResolvedValue({ count: 1 });
      prisma.visitedCountry.findUniqueOrThrow.mockResolvedValue(
        makeRow({ visitedAt: new Date('2023-07-01T00:00:00Z') }),
      );
      const res = await svc.setVisitedAt('u1', 'jp', '2023-07-01');
      expect(prisma.visitedCountry.updateMany).toHaveBeenCalledWith({
        where: { userId: 'u1', cca2: 'JP' },
        data: { visitedAt: new Date('2023-07-01') },
      });
      expect(res.visitedAt).toBe('2023-07-01');
    });

    it('setVisitedAt com null remove a data', async () => {
      prisma.visitedCountry.updateMany.mockResolvedValue({ count: 1 });
      prisma.visitedCountry.findUniqueOrThrow.mockResolvedValue(makeRow());
      const res = await svc.setVisitedAt('u1', 'JP', null);
      expect(prisma.visitedCountry.updateMany).toHaveBeenCalledWith({
        where: { userId: 'u1', cca2: 'JP' },
        data: { visitedAt: null },
      });
      expect(res.visitedAt).toBeNull();
    });

    it('setVisitedAt 404 quando o país não foi marcado', async () => {
      prisma.visitedCountry.updateMany.mockResolvedValue({ count: 0 });
      await expect(
        svc.setVisitedAt('u1', 'FR', '2024-01-01'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
