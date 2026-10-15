import { NotFoundException } from '@nestjs/common';
import { UsersController } from './users.controller';

const statsRes = {
  totalVisited: 3,
  perContinent: [],
  updatedAt: new Date().toISOString(),
};
const wishlistItems = [
  {
    id: 'w1',
    userId: 'u2',
    cca2: 'JP',
    countryName: 'Japan',
    continent: 'Asia',
    createdAt: '',
  },
];
const visitedItems = [
  {
    id: 'v1',
    userId: 'u2',
    cca2: 'BR',
    countryName: 'Brazil',
    continent: 'South America',
    createdAt: '',
  },
];

function makeCtrl(userExists = true) {
  const users = {
    findById: jest.fn().mockResolvedValue(
      userExists
        ? {
            id: 'u2',
            email: 'b@c.com',
            role: 'USER',
            createdAt: new Date('2026-01-01'),
          }
        : null,
    ),
  };
  const wishlist = { list: jest.fn().mockResolvedValue(wishlistItems) };
  const visited = { list: jest.fn().mockResolvedValue(visitedItems) };
  const stats = { continents: jest.fn().mockResolvedValue(statsRes) };
  return new UsersController(
    users as never,
    wishlist as never,
    visited as never,
    stats as never,
  );
}

describe('UsersController', () => {
  it('publicProfile retorna perfil agregado', async () => {
    const ctrl = makeCtrl(true);
    const res = await ctrl.publicProfile('u2');
    expect(res).toMatchObject({
      id: 'u2',
      email: 'b@c.com',
      totalVisited: 3,
      totalWishlist: 1,
    });
  });

  it('publicProfile lança NotFoundException quando usuário não existe', async () => {
    const ctrl = makeCtrl(false);
    await expect(ctrl.publicProfile('ghost')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
