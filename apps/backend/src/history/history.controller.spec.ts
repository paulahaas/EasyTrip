import { HistoryController } from './history.controller';

const USER = { id: 'u1', email: 'a@b.com', role: 'USER' as const };

describe('HistoryController', () => {
  let service: {
    list: jest.Mock;
    addFromQuery: jest.Mock;
    addBulk: jest.Mock;
    deleteAll: jest.Mock;
    deleteById: jest.Mock;
  };
  let ctrl: HistoryController;

  beforeEach(() => {
    service = {
      list: jest.fn().mockResolvedValue([]),
      addFromQuery: jest.fn().mockResolvedValue({}),
      addBulk: jest.fn().mockResolvedValue([]),
      deleteAll: jest.fn().mockResolvedValue(undefined),
      deleteById: jest.fn().mockResolvedValue(undefined),
    };
    ctrl = new HistoryController(service as never);
  });

  it('list delega para service.list', async () => {
    await ctrl.list(USER);
    expect(service.list).toHaveBeenCalledWith('u1');
  });

  it('add delega para service.addFromQuery', async () => {
    await ctrl.add(USER, { query: 'Brazil' });
    expect(service.addFromQuery).toHaveBeenCalledWith('u1', 'Brazil');
  });

  it('bulk delega para service.addBulk', async () => {
    await ctrl.bulk(USER, { queries: ['Brazil', 'Japan'] });
    expect(service.addBulk).toHaveBeenCalledWith('u1', ['Brazil', 'Japan']);
  });

  it('clear delega para service.deleteAll e retorna { ok: true }', async () => {
    const res = await ctrl.clear(USER);
    expect(service.deleteAll).toHaveBeenCalledWith('u1');
    expect(res).toEqual({ ok: true });
  });

  it('remove delega para service.deleteById e retorna { ok: true }', async () => {
    const res = await ctrl.remove(USER, 'entry-id-1');
    expect(service.deleteById).toHaveBeenCalledWith('u1', 'entry-id-1');
    expect(res).toEqual({ ok: true });
  });
});
