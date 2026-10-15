import { RecommendationsController } from './recommendations.controller';

const USER = { id: 'u1', email: 'a@b.com', role: 'USER' as const };

describe('RecommendationsController', () => {
  it('list delega para service.forUser', async () => {
    const service = { forUser: jest.fn().mockResolvedValue([]) };
    const ctrl = new RecommendationsController(service as never);
    await ctrl.list(USER);
    expect(service.forUser).toHaveBeenCalledWith('u1');
  });
});
