import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import type { AuthResponse, Role, User as SharedUser } from '@easytrip/shared';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

interface UserRow {
  id: string;
  email: string;
  username: string;
  role: Role;
  createdAt: Date;
}

const USERNAME_TAKEN = 'Nome de usuário já está em uso';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async register(
    email: string,
    username: string,
    password: string,
  ): Promise<AuthResponse> {
    if (await this.users.findByEmail(email)) {
      throw new ConflictException('Email já cadastrado');
    }
    if (await this.users.findByUsername(username)) {
      throw new ConflictException(USERNAME_TAKEN);
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.withUniqueCheck(() =>
      this.users.create(email, username, passwordHash),
    );
    return this.buildResponse(user);
  }

  async login(login: string, password: string): Promise<AuthResponse> {
    const user = await this.users.findByLogin(login);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return this.buildResponse(user);
  }

  async me(userId: string): Promise<SharedUser> {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    return this.toPublic(user);
  }

  async updateUsername(userId: string, username: string): Promise<SharedUser> {
    const owner = await this.users.findByUsername(username);
    if (owner && owner.id !== userId) {
      throw new ConflictException(USERNAME_TAKEN);
    }
    const user = await this.withUniqueCheck(() =>
      this.users.updateUsername(userId, username),
    );
    return this.toPublic(user);
  }

  // Cobre a corrida entre a checagem acima e a escrita (dois cadastros ao mesmo tempo).
  private async withUniqueCheck<T>(write: () => Promise<T>): Promise<T> {
    try {
      return await write();
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        const target = String(err.meta?.target ?? '');
        throw new ConflictException(
          target.includes('email') ? 'Email já cadastrado' : USERNAME_TAKEN,
        );
      }
      throw err;
    }
  }

  private buildResponse(user: UserRow): AuthResponse {
    const accessToken = this.jwt.sign({ sub: user.id, email: user.email });
    return {
      user: this.toPublic(user),
      tokens: { accessToken },
    };
  }

  private toPublic(user: UserRow): SharedUser {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
