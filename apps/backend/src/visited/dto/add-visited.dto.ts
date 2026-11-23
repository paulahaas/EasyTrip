import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { IsVisitDate } from './visit-date.decorator';

export class AddVisitedDto {
  @ApiProperty({ example: 'FR', description: 'Código ISO alpha-2' })
  @IsString()
  @Length(2, 2)
  cca2!: string;

  @ApiPropertyOptional({
    example: 'France',
    description: 'Ignorado: o servidor usa o nome canônico do país pelo cca2.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  countryName?: string;

  @ApiPropertyOptional({
    description: 'Ignorado: o servidor calcula o continente pelo cca2.',
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
  @IsOptional()
  @IsString()
  @MaxLength(40)
  continent?: string;

  @ApiPropertyOptional({
    description: 'Data da viagem (AAAA-MM-DD). Opcional.',
    example: '2024-03-01',
  })
  @IsOptional()
  @IsVisitDate()
  visitedAt?: string;
}
