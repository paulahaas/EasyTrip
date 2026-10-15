import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import type { Role } from '@easytrip/shared';
import { RolesGuard } from '../guards/roles.guard';

export const ROLES_KEY = 'easytrip:roles';

/**
 * @Roles() — qualquer usuário autenticado.
 * @Roles(Role.ADMIN) — apenas a role listada.
 * Aplica também o RolesGuard (que faz verificação de JWT + role).
 */
export function Roles(...roles: Role[]) {
  return applyDecorators(SetMetadata(ROLES_KEY, roles), UseGuards(RolesGuard));
}
