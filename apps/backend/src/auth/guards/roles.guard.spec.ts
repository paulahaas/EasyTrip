import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from './roles.guard';

function buildContext(authHeader?: string): ExecutionContext {
  const req: { headers: Record<string, unknown>; user?: unknown } = {
    headers: authHeader ? { authorization: authHeader } : {},
  };
  return {
    switchToHttp: () => ({ getRequest: () => req }),
    getHandler: () => ({}),
    getClass: () => ({}),
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  const jwt = { verify: jest.fn() } as unknown as JwtService;
  const users = { findById: jest.fn() };
  const reflector = new Reflector();

  beforeEach(() => {
    (jwt.verify as jest.Mock).mockReset();
    users.findById.mockReset();
  });

  it('401 sem token', async () => {
    const g = new RolesGuard(jwt, users as never, reflector);
    await expect(g.canActivate(buildContext())).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('401 em token inválido', async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('bad');
    });
    const g = new RolesGuard(jwt, users as never, reflector);
    await expect(
      g.canActivate(buildContext('Bearer x')),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('passa quando @Roles() vazio (só auth)', async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ sub: 'u1', email: 'a@b.com' });
    users.findById.mockResolvedValueOnce({
      id: 'u1',
      email: 'a@b.com',
      role: 'USER',
    });
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);
    const g = new RolesGuard(jwt, users as never, reflector);
    await expect(g.canActivate(buildContext('Bearer x'))).resolves.toBe(true);
  });

  it('403 quando role não bate', async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ sub: 'u1', email: 'a@b.com' });
    users.findById.mockResolvedValueOnce({
      id: 'u1',
      email: 'a@b.com',
      role: 'USER',
    });
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);
    const g = new RolesGuard(jwt, users as never, reflector);
    await expect(
      g.canActivate(buildContext('Bearer x')),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('passa quando role bate', async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ sub: 'u1', email: 'a@b.com' });
    users.findById.mockResolvedValueOnce({
      id: 'u1',
      email: 'a@b.com',
      role: 'ADMIN',
    });
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);
    const g = new RolesGuard(jwt, users as never, reflector);
    await expect(g.canActivate(buildContext('Bearer x'))).resolves.toBe(true);
  });
});
