import { VisitedController } from './visited.controller';

const USER = { id: 'u1', email: 'a@b.com', role: 'USER' as const };

describe('VisitedController', () => {
  let service: { list: jest.Mock; add: jest.Mock; remove: jest.Mock };
  let ctrl: VisitedController;

  beforeEach(() => {
    service = { list: jest.fn(), add: jest.fn(), remove: jest.fn() };
    ctrl = new VisitedController(service as never);
  });

  it('list delega para service.list', async () => {
    service.list.mockResolvedValue([]);
    await ctrl.list(USER);
    expect(service.list).toHaveBeenCalledWith('u1');
  });

  it('add delega para service.add', async () => {
    const dto = { cca2: 'JP', countryName: 'Japan', continent: 'Asia' };
    service.add.mockResolvedValue(dto);
    await ctrl.add(USER, dto);
    expect(service.add).toHaveBeenCalledWith('u1', dto);
  });

  it('remove delega para service.remove e retorna { ok: true }', async () => {
    service.remove.mockResolvedValue(undefined);
    const res = await ctrl.remove(USER, 'JP');
    expect(service.remove).toHaveBeenCalledWith('u1', 'JP');
    expect(res).toEqual({ ok: true });
  });
});
