import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, Matches } from 'class-validator';
import { USERNAME_REGEX } from '@easytrip/shared';

/** Nome de usuário: normaliza (trim + minúsculas) e valida 3–20 de [a-z0-9_.]. */
export function IsUsername() {
  return applyDecorators(
    ApiProperty({
      description:
        'Nome de usuário único: 3 a 20 caracteres, letras, números, "_" e ".". Salvo em minúsculas.',
      example: 'maria.silva',
      pattern: USERNAME_REGEX.source,
    }),
    Transform(({ value }: { value: unknown }) =>
      typeof value === 'string' ? value.trim().toLowerCase() : value,
    ),
    IsString(),
    Matches(USERNAME_REGEX, {
      message:
        'Nome de usuário deve ter 3 a 20 caracteres: letras, números, "_" ou "."',
    }),
  );
}
