import { UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

function makeContext(authHeader: string | undefined) {
  const req = { headers: { authorization: authHeader } };
  return {
    switchToHttp: () => ({ getRequest: () => req }),
    getHandler: () => null,
    getClass: () => null,
  } as never;
}

function makeGuard(opts: { jwtPayload?: object; userExists?: boolean } = {}) {
  const jwt = {
    verify: jest
      .fn()
      .mockReturnValue(opts.jwtPayload ?? { sub: 'u1', email: 'a@b.com' }),
  };
  const users = {
    findById: jest
      .fn()
      .mockResolvedValue(
        opts.userExists === false
          ? null
          : { id: 'u1', email: 'a@b.com', role: 'USER' },
      ),
  };
  return new JwtAuthGuard(jwt as never, users as never);
}

describe('JwtAuthGuard', () => {
  it('retorna true com token válido e usuário existente', async () => {
    const guard = makeGuard();
    const ctx = makeContext('Bearer valid.jwt.token');
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
  });

  it('lança UnauthorizedException sem header', async () => {
    const guard = makeGuard();
    await expect(
      guard.canActivate(makeContext(undefined)),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('lança UnauthorizedException com header sem "Bearer "', async () => {
    const guard = makeGuard();
    await expect(
      guard.canActivate(makeContext('Basic abc')),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('lança UnauthorizedException quando jwt.verify lança', async () => {
    const jwt = {
      verify: jest.fn().mockImplementation(() => {
        throw new Error('bad token');
      }),
    };
    const users = { findById: jest.fn() };
    const guard = new JwtAuthGuard(jwt as never, users as never);
    await expect(
      guard.canActivate(makeContext('Bearer bad')),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('lança UnauthorizedException quando usuário não existe', async () => {
    const guard = makeGuard({ userExists: false });
    await expect(
      guard.canActivate(makeContext('Bearer valid')),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('injeta user no request', async () => {
    const guard = makeGuard();
    const req = { headers: { authorization: 'Bearer valid' } } as never;
    const ctx = {
      switchToHttp: () => ({ getRequest: () => req }),
      getHandler: () => null,
      getClass: () => null,
    } as never;
    await guard.canActivate(ctx);
    expect((req as { user: { id: string } }).user.id).toBe('u1');
  });
});
