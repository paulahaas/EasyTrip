import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, MinLength } from 'class-validator';

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
}
