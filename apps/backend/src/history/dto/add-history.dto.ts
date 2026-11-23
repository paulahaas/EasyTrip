import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class AddHistoryDto {
  @ApiProperty({
    description: 'Nome do país aberto (inglês, português ou sigla).',
    example: 'Spain',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  query!: string;
}
