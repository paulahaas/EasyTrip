import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Role } from '@easytrip/shared';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';
import { ROLES_KEY } from '../decorators/roles.decorator';

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly users: UsersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request>();
    const header = req.headers['authorization'];
    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token ausente');
    }

    let payload: JwtPayload;
    try {
      payload = this.jwt.verify<JwtPayload>(header.slice('Bearer '.length));
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    const user = await this.users.findById(payload.sub);
    if (!user) throw new UnauthorizedException('Usuário não encontrado');

    const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (required && required.length > 0 && !required.includes(user.role)) {
      throw new ForbiddenException('Permissão insuficiente');
    }

    (
      req as Request & { user: { id: string; email: string; role: Role } }
    ).user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return true;
  }
}
