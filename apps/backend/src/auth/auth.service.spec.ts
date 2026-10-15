import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  const jwt = {
    sign: jest.fn().mockReturnValue('signed.jwt.token'),
  } as unknown as JwtService;
  let users: jest.Mocked<UsersService>;
  let service: AuthService;

  function userRow(overrides: Partial<{ id: string; username: string; passwordHash: string }> = {}) {
    return {
      id: 'u1',
      email: 'a@b.com',
      username: 'maria',
      passwordHash: 'x',
      role: 'USER' as const,
      createdAt: new Date('2026-01-01T00:00:00Z'),
      ...overrides,
    };
  }

  beforeEach(() => {
    users = {
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      findByLogin: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      updateUsername: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;
    service = new AuthService(users, jwt);
    (jwt.sign as jest.Mock).mockClear();
  });

  it('register: cria hash e devolve token com o nome de usuário', async () => {
    users.findByEmail.mockResolvedValueOnce(null);
    users.findByUsername.mockResolvedValueOnce(null);
    users.create.mockImplementationOnce(
      (email: string, username: string, passwordHash: string) =>
        Promise.resolve({ ...userRow({ username, passwordHash }), email }),
    );

    const res = await service.register('a@b.com', 'maria', 'secret123');

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(users.create).toHaveBeenCalledTimes(1);
    const [, username, passwordHash] = users.create.mock.calls[0];
    expect(username).toBe('maria');
    expect(passwordHash).not.toBe('secret123');
    await expect(bcrypt.compare('secret123', passwordHash)).resolves.toBe(true);
    expect(res.tokens.accessToken).toBe('signed.jwt.token');
    expect(res.user).toMatchObject({ email: 'a@b.com', username: 'maria' });
  });

  it('register: rejeita email duplicado', async () => {
    users.findByEmail.mockResolvedValueOnce(userRow());
    await expect(
      service.register('a@b.com', 'outro', 'secret123'),
    ).rejects.toThrow('Email já cadastrado');
  });

  it('register: rejeita nome de usuário em uso', async () => {
    users.findByEmail.mockResolvedValueOnce(null);
    users.findByUsername.mockResolvedValueOnce(userRow());
    await expect(
      service.register('novo@b.com', 'maria', 'secret123'),
    ).rejects.toThrow('Nome de usuário já está em uso');
  });

  it('register: converte violação de unicidade do banco em 409', async () => {
    users.findByEmail.mockResolvedValueOnce(null);
    users.findByUsername.mockResolvedValueOnce(null);
    users.create.mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('unique', {
        code: 'P2002',
        clientVersion: 'test',
        meta: { target: ['username'] },
      }),
    );
    await expect(
      service.register('a@b.com', 'maria', 'secret123'),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('login: 401 em senha errada', async () => {
    const passwordHash = await bcrypt.hash('realpass', 10);
    users.findByLogin.mockResolvedValueOnce(userRow({ passwordHash }));
    await expect(service.login('a@b.com', 'wrong')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('login: devolve token em senha correta (email ou nome de usuário)', async () => {
    const passwordHash = await bcrypt.hash('realpass', 10);
    users.findByLogin.mockResolvedValue(userRow({ passwordHash }));
    const porEmail = await service.login('a@b.com', 'realpass');
    const porNome = await service.login('maria', 'realpass');
    expect(porEmail.tokens.accessToken).toBe('signed.jwt.token');
    expect(porNome.user.username).toBe('maria');
    expect(users.findByLogin).toHaveBeenCalledWith('maria');
  });

  it('login: 401 em usuário inexistente', async () => {
    users.findByLogin.mockResolvedValueOnce(null);
    await expect(
      service.login('none@b.com', 'secret123'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('me: retorna usuário público quando encontrado', async () => {
    users.findById.mockResolvedValueOnce(userRow());
    const res = await service.me('u1');
    expect(res).toMatchObject({
      id: 'u1',
      email: 'a@b.com',
      username: 'maria',
      role: 'USER',
    });
    expect(res).not.toHaveProperty('passwordHash');
  });

  it('me: 401 quando usuário não existe', async () => {
    users.findById.mockResolvedValueOnce(null);
    await expect(service.me('ghost')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('updateUsername: troca o nome quando está livre', async () => {
    users.findByUsername.mockResolvedValueOnce(null);
    users.updateUsername.mockResolvedValueOnce(userRow({ username: 'novo.nome' }));
    const res = await service.updateUsername('u1', 'novo.nome');
    expect(users.updateUsername).toHaveBeenCalledWith('u1', 'novo.nome');
    expect(res.username).toBe('novo.nome');
  });

  it('updateUsername: aceita manter o próprio nome', async () => {
    users.findByUsername.mockResolvedValueOnce(userRow());
    users.updateUsername.mockResolvedValueOnce(userRow());
    await expect(service.updateUsername('u1', 'maria')).resolves.toMatchObject({
      username: 'maria',
    });
  });

  it('updateUsername: 409 quando o nome é de outra pessoa', async () => {
    users.findByUsername.mockResolvedValueOnce(userRow({ id: 'outra' }));
    await expect(service.updateUsername('u1', 'maria')).rejects.toThrow(
      'Nome de usuário já está em uso',
    );
    expect(users.updateUsername).not.toHaveBeenCalled();
  });
});
