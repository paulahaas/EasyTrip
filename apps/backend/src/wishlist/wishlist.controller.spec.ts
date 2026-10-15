import { WishlistController } from './wishlist.controller';

const USER = { id: 'u1', email: 'a@b.com', role: 'USER' as const };

describe('WishlistController', () => {
  let service: { list: jest.Mock; add: jest.Mock; remove: jest.Mock };
  let ctrl: WishlistController;

  beforeEach(() => {
    service = { list: jest.fn(), add: jest.fn(), remove: jest.fn() };
    ctrl = new WishlistController(service as never);
  });

  it('list delega para service.list', async () => {
    service.list.mockResolvedValue([]);
    await ctrl.list(USER);
    expect(service.list).toHaveBeenCalledWith('u1');
  });

  it('add delega para service.add', async () => {
    const dto = {
      cca2: 'BR',
      countryName: 'Brazil',
      continent: 'South America',
    };
    service.add.mockResolvedValue(dto);
    await ctrl.add(USER, dto);
    expect(service.add).toHaveBeenCalledWith('u1', dto);
  });

  it('remove delega para service.remove e retorna { ok: true }', async () => {
    service.remove.mockResolvedValue(undefined);
    const res = await ctrl.remove(USER, 'BR');
    expect(service.remove).toHaveBeenCalledWith('u1', 'BR');
    expect(res).toEqual({ ok: true });
  });
});
