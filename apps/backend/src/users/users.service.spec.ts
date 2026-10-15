import { UsersService } from './users.service';

function makeUser(overrides: Partial<{ id: string; email: string }> = {}) {
  return {
    id: overrides.id ?? 'u1',
    email: overrides.email ?? 'test@example.com',
    passwordHash: 'hashed',
    createdAt: new Date('2026-01-01T00:00:00Z'),
    role: 'USER' as const,
  };
}

describe('UsersService', () => {
  let prisma: { user: { findUnique: jest.Mock; create: jest.Mock } };
  let svc: UsersService;

  beforeEach(() => {
    prisma = { user: { findUnique: jest.fn(), create: jest.fn() } };
    svc = new UsersService(prisma as never);
  });

  it('findByEmail delega para prisma com email', async () => {
    const user = makeUser();
    prisma.user.findUnique.mockResolvedValue(user);
    const res = await svc.findByEmail('test@example.com');
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
    expect(res).toEqual(user);
  });

  it('findByEmail retorna null quando não existe', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    expect(await svc.findByEmail('none@x.com')).toBeNull();
  });

  it('findById delega para prisma com id', async () => {
    const user = makeUser({ id: 'u42' });
    prisma.user.findUnique.mockResolvedValue(user);
    const res = await svc.findById('u42');
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'u42' },
    });
    expect(res).toEqual(user);
  });

  it('findById retorna null para id inexistente', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    expect(await svc.findById('ghost')).toBeNull();
  });

  it('create delega para prisma com email e passwordHash', async () => {
    const user = makeUser();
    prisma.user.create.mockResolvedValue(user);
    const res = await svc.create('test@example.com', 'hash123');
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: { email: 'test@example.com', passwordHash: 'hash123' },
    });
    expect(res).toEqual(user);
  });
});
