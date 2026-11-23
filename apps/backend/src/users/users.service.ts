import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /** Email não diferencia maiúsculas (contas antigas podem ter sido salvas com maiúsculas). */
  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { email: { equals: email.trim(), mode: 'insensitive' } },
    });
  }

  findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  /** Busca pelo email (se tiver "@") ou pelo nome de usuário. */
  findByLogin(login: string): Promise<User | null> {
    const value = login.trim();
    return value.includes('@')
      ? this.findByEmail(value)
      : this.findByUsername(value.toLowerCase());
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  create(email: string, username: string, passwordHash: string): Promise<User> {
    return this.prisma.user.create({
      data: { email: email.trim().toLowerCase(), username, passwordHash },
    });
  }

  updateUsername(id: string, username: string): Promise<User> {
    return this.prisma.user.update({ where: { id }, data: { username } });
  }
}
