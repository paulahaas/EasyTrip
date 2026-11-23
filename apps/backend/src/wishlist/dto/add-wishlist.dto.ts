import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class AddWishlistDto {
  @ApiProperty({ description: 'Código ISO alpha-2.', example: 'JP' })
  @IsString()
  @Length(2, 2)
  cca2!: string;

  @ApiPropertyOptional({
    example: 'Japan',
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
    example: 'Asia',
  })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  continent?: string;
}
