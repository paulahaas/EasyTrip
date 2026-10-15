import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  const jwt = {
    sign: jest.fn().mockReturnValue('signed.jwt.token'),
  } as unknown as JwtService;
  let users: jest.Mocked<UsersService>;
  let service: AuthService;

  beforeEach(() => {
    users = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;
    service = new AuthService(users, jwt);
    (jwt.sign as jest.Mock).mockClear();
  });

  it('register: cria hash e devolve token', async () => {
    users.findByEmail.mockResolvedValueOnce(null);
    users.create.mockImplementationOnce((email: string, passwordHash: string) =>
      Promise.resolve({
        id: 'u1',
        email,
        passwordHash,
        createdAt: new Date('2026-04-23T10:00:00Z'),
      }),
    );

    const res = await service.register('a@b.com', 'secret123');

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(users.create).toHaveBeenCalledTimes(1);
    const [, passwordHash] = users.create.mock.calls[0];
    expect(passwordHash).not.toBe('secret123');
    await expect(bcrypt.compare('secret123', passwordHash)).resolves.toBe(true);
    expect(res.tokens.accessToken).toBe('signed.jwt.token');
    expect(res.user.email).toBe('a@b.com');
  });

  it('register: rejeita email duplicado', async () => {
    users.findByEmail.mockResolvedValueOnce({
      id: 'u1',
      email: 'a@b.com',
      passwordHash: 'x',
      createdAt: new Date(),
    });
    await expect(
      service.register('a@b.com', 'secret123'),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('login: 401 em senha errada', async () => {
    const passwordHash = await bcrypt.hash('realpass', 10);
    users.findByEmail.mockResolvedValueOnce({
      id: 'u1',
      email: 'a@b.com',
      passwordHash,
      createdAt: new Date(),
    });
    await expect(service.login('a@b.com', 'wrong')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('login: devolve token em senha correta', async () => {
    const passwordHash = await bcrypt.hash('realpass', 10);
    users.findByEmail.mockResolvedValueOnce({
      id: 'u1',
      email: 'a@b.com',
      passwordHash,
      createdAt: new Date(),
    });
    const res = await service.login('a@b.com', 'realpass');
    expect(res.tokens.accessToken).toBe('signed.jwt.token');
  });

  it('login: 401 em email inexistente', async () => {
    users.findByEmail.mockResolvedValueOnce(null);
    await expect(
      service.login('none@b.com', 'secret123'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('me: retorna usuário público quando encontrado', async () => {
    users.findById.mockResolvedValueOnce({
      id: 'u1',
      email: 'a@b.com',
      role: 'USER',
      createdAt: new Date('2026-01-01T00:00:00Z'),
    });
    const res = await service.me('u1');
    expect(res).toMatchObject({ id: 'u1', email: 'a@b.com', role: 'USER' });
  });

  it('me: 401 quando usuário não existe', async () => {
    users.findById.mockResolvedValueOnce(null);
    await expect(service.me('ghost')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
