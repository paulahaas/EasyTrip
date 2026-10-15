import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class AddHistoryDto {
  @ApiProperty({
    description: 'Nome do país pesquisado (resolvido via RestCountries).',
    example: 'Spain',
  })
  @IsString()
  @MinLength(1)
  query!: string;
}
