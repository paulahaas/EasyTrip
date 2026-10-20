import { applyDecorators } from '@nestjs/common';
import { IsDateString, Matches } from 'class-validator';

/** Data no formato AAAA-MM-DD, entre 1900 e o ano que vem. */
export function IsVisitDate() {
  return applyDecorators(
    Matches(/^(19|20)\d{2}-\d{2}-\d{2}$/, {
      message: 'visitedAt deve estar no formato AAAA-MM-DD',
    }),
    IsDateString({ strict: true }, { message: 'visitedAt não é uma data válida' }),
  );
}
