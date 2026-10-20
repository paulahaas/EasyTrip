import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, ValidateIf } from 'class-validator';
import { IsVisitDate } from './visit-date.decorator';

export class UpdateVisitedDto {
  @ApiProperty({
    description: 'Data da viagem (AAAA-MM-DD) ou null para remover a data.',
    example: '2024-03-01',
    nullable: true,
    type: String,
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsVisitDate()
  visitedAt!: string | null;
}
