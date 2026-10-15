/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConflictException } from '@nestjs/common';
import { WishlistService } from './wishlist.service';

function makeRow(
  overrides: Partial<{
    id: string;
    cca2: string;
    countryName: string;
    continent: string;
  }> = {},
) {
  return {
    id: overrides.id ?? 'w1',
    userId: 'u1',
    cca2: overrides.cca2 ?? 'BR',
    countryName: overrides.countryName ?? 'Brazil',
    continent: overrides.continent ?? 'South America',
    createdAt: new Date('2026-01-01T00:00:00Z'),
  };
}

function makePrisma() {
  return {
    wishlist: {
      findMany: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
  };
}

describe('WishlistService', () => {
  let prisma: ReturnType<typeof makePrisma>;
  let svc: WishlistService;

  beforeEach(() => {
    prisma = makePrisma();
    svc = new WishlistService(prisma as never);
  });

  describe('list', () => {
    it('retorna lista mapeada como DTO', async () => {
      prisma.wishlist.findMany.mockResolvedValue([makeRow()]);
      const res = await svc.list('u1');
      expect(res).toHaveLength(1);
      expect(res[0]).toMatchObject({
        id: 'w1',
        userId: 'u1',
        cca2: 'BR',
        countryName: 'Brazil',
        continent: 'South America',
        createdAt: '2026-01-01T00:00:00.000Z',
      });
    });

    it('retorna [] quando vazio', async () => {
      prisma.wishlist.findMany.mockResolvedValue([]);
      expect(await svc.list('u1')).toEqual([]);
    });
  });

  describe('add', () => {
    it('cria com cca2 uppercase e retorna DTO', async () => {
      const row = makeRow({ cca2: 'BR' });
      prisma.wishlist.create.mockResolvedValue(row);
      const res = await svc.add('u1', {
        cca2: 'br',
        countryName: 'Brazil',
        continent: 'South America',
      });
      expect(prisma.wishlist.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ cca2: 'BR' }),
        }),
      );
      expect(res.cca2).toBe('BR');
    });

    it('lança ConflictException em duplicata (P2002)', async () => {
      prisma.wishlist.create.mockRejectedValue({ code: 'P2002' });
      await expect(
        svc.add('u1', {
          cca2: 'BR',
          countryName: 'Brazil',
          continent: 'South America',
        }),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('relança erros desconhecidos', async () => {
      const err = new Error('db down');
      prisma.wishlist.create.mockRejectedValue(err);
      await expect(
        svc.add('u1', {
          cca2: 'BR',
          countryName: 'Brazil',
          continent: 'South America',
        }),
      ).rejects.toThrow('db down');
    });
  });

  describe('remove', () => {
    it('chama deleteMany com userId e cca2 uppercase', async () => {
      prisma.wishlist.deleteMany.mockResolvedValue({ count: 1 });
      await svc.remove('u1', 'br');
      expect(prisma.wishlist.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'u1', cca2: 'BR' },
      });
    });
  });
});
