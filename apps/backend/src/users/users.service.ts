import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
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
    return this.prisma.user.create({ data: { email, username, passwordHash } });
  }

  updateUsername(id: string, username: string): Promise<User> {
    return this.prisma.user.update({ where: { id }, data: { username } });
  }
}
