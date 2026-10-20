import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length, MinLength } from 'class-validator';
import { IsVisitDate } from './visit-date.decorator';

export class AddVisitedDto {
  @ApiProperty({ example: 'FR', description: 'Código ISO alpha-2' })
  @IsString()
  @Length(2, 2)
  cca2!: string;

  @ApiProperty({ example: 'France' })
  @IsString()
  @MinLength(1)
  countryName!: string;

  @ApiProperty({
    description:
      'Continente informado pelo cliente. O servidor recalcula a partir do cca2 sempre que conhece o país.',
    enum: [
      'Africa',
      'Antarctica',
      'Asia',
      'Europe',
      'North America',
      'Oceania',
      'South America',
    ],
    example: 'Europe',
  })
  @IsString()
  @MinLength(1)
  continent!: string;

  @ApiPropertyOptional({
    description: 'Data da viagem (AAAA-MM-DD). Opcional.',
    example: '2024-03-01',
  })
  @IsOptional()
  @IsVisitDate()
  visitedAt?: string;
}
