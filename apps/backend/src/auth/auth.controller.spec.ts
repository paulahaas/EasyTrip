import { AuthController } from './auth.controller';

const USER = { id: 'u1', email: 'a@b.com', role: 'USER' as const };
const TOKEN_RES = { user: USER, tokens: { accessToken: 'tok' } };

describe('AuthController', () => {
  let service: {
    register: jest.Mock;
    login: jest.Mock;
    me: jest.Mock;
    updateUsername: jest.Mock;
  };
  let ctrl: AuthController;

  beforeEach(() => {
    service = {
      register: jest
        .fn()
        .mockResolvedValue({ user: USER, tokens: { accessToken: 'tok' } }),
      login: jest
        .fn()
        .mockResolvedValue({ user: USER, tokens: { accessToken: 'tok' } }),
      me: jest.fn().mockResolvedValue(USER),
      updateUsername: jest.fn().mockResolvedValue(USER),
    };
    ctrl = new AuthController(service as never);
  });

  it('register delega para service.register', async () => {
    await ctrl.register({
      email: 'a@b.com',
      username: 'maria',
      password: 'pass123',
    });
    expect(service.register).toHaveBeenCalledWith(
      'a@b.com',
      'maria',
      'pass123',
    );
  });

  it('login delega para service.login', async () => {
    await ctrl.login({ login: 'maria', password: 'pass123' });
    expect(service.login).toHaveBeenCalledWith('maria', 'pass123');
  });

  it('me delega para service.me com user.id', async () => {
    await ctrl.me(USER);
    expect(service.me).toHaveBeenCalledWith('u1');
  });

  it('updateMe delega para service.updateUsername', async () => {
    await ctrl.updateMe(USER, { username: 'novo.nome' });
    expect(service.updateUsername).toHaveBeenCalledWith('u1', 'novo.nome');
  });
});
