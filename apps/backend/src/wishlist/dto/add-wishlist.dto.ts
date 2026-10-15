import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, MinLength } from 'class-validator';

export class AddWishlistDto {
  @ApiProperty({ description: 'Código ISO alpha-2.', example: 'JP' })
  @IsString()
  @Length(2, 2)
  cca2!: string;

  @ApiProperty({ example: 'Japan' })
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
    example: 'Asia',
  })
  @IsString()
  @MinLength(1)
  continent!: string;
}
