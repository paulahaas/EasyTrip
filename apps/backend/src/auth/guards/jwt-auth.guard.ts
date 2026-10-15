/**
 * Mantido para compat — novos endpoints devem usar @Roles() do roles.decorator.
 * Este guard só verifica JWT, sem checar role.
 */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Role } from '@easytrip/shared';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly users: UsersService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request>();
    const header = req.headers['authorization'];
    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token ausente');
    }
    try {
      const payload = this.jwt.verify<JwtPayload>(
        header.slice('Bearer '.length),
      );
      const user = await this.users.findById(payload.sub);
      if (!user) throw new UnauthorizedException();
      (
        req as Request & {
          user: { id: string; email: string; role: Role };
        }
      ).user = {
        id: user.id,
        email: user.email,
        role: user.role,
      };
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
