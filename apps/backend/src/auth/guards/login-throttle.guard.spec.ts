import { HttpException } from '@nestjs/common';
import { LoginThrottleGuard } from './login-throttle.guard';

function ctx(login: string, ip = '1.2.3.4') {
  const req = { ip, body: { login } };
  return { switchToHttp: () => ({ getRequest: () => req }) } as never;
}

describe('LoginThrottleGuard', () => {
  it('deixa passar até 10 tentativas e bloqueia a 11ª', () => {
    const guard = new LoginThrottleGuard();
    for (let i = 0; i < 10; i++)
      expect(guard.canActivate(ctx('maria'))).toBe(true);
    expect(() => guard.canActivate(ctx('maria'))).toThrow(HttpException);
  });

  it('conta separado por login e por IP', () => {
    const guard = new LoginThrottleGuard();
    for (let i = 0; i < 10; i++) guard.canActivate(ctx('maria'));
    expect(guard.canActivate(ctx('joao'))).toBe(true);
    expect(guard.canActivate(ctx('maria', '5.6.7.8'))).toBe(true);
  });

  it('libera depois da janela de 15 minutos', () => {
    const guard = new LoginThrottleGuard();
    const now = jest.spyOn(Date, 'now').mockReturnValue(0);
    for (let i = 0; i < 11; i++) {
      try {
        guard.canActivate(ctx('maria'));
      } catch {
        // esperado na 11ª
      }
    }
    now.mockReturnValue(15 * 60 * 1000 + 1);
    expect(guard.canActivate(ctx('maria'))).toBe(true);
    now.mockRestore();
  });
});
