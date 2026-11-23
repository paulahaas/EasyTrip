import { applyDecorators } from '@nestjs/common';
import { IsDateString, Matches, ValidateBy } from 'class-validator';

/** Ano máximo aceito: o ano que vem (viagem já marcada). */
export function maxVisitYear(now = new Date()): number {
  return now.getUTCFullYear() + 1;
}

/** Data no formato AAAA-MM-DD, entre 1900 e o ano que vem. */
export function IsVisitDate() {
  return applyDecorators(
    Matches(/^(19|20)\d{2}-\d{2}-\d{2}$/, {
      message: 'visitedAt deve estar no formato AAAA-MM-DD',
    }),
    IsDateString({ strict: true }, { message: 'visitedAt não é uma data válida' }),
    ValidateBy({
      name: 'isVisitYearInRange',
      validator: {
        validate: (value: unknown) =>
          typeof value === 'string' &&
          Number(value.slice(0, 4)) <= maxVisitYear(),
        defaultMessage: () =>
          `visitedAt não pode passar de ${maxVisitYear()}`,
      },
    }),
  );
}
