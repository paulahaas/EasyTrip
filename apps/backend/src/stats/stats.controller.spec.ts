import { StatsController } from './stats.controller';

const USER = { id: 'u1', email: 'a@b.com', role: 'USER' as const };

describe('StatsController', () => {
  it('continents delega para service.continents', async () => {
    const statsResponse = {
      totalVisited: 5,
      perContinent: [],
      updatedAt: new Date().toISOString(),
    };
    const service = { continents: jest.fn().mockResolvedValue(statsResponse) };
    const ctrl = new StatsController(service as never);
    const res = await ctrl.continents(USER);
    expect(service.continents).toHaveBeenCalledWith('u1');
    expect(res).toEqual(statsResponse);
  });
});
