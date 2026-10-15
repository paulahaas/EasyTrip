import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsString, MinLength } from 'class-validator';

export class BulkHistoryDto {
  @ApiProperty({
    description:
      'Lista de queries para adicionar ao histórico em lote (usado na migração do localStorage após login). Máx 64 itens.',
    example: ['Spain', 'France', 'Italy'],
    maxItems: 64,
  })
  @IsArray()
  @ArrayMaxSize(64)
  @IsString({ each: true })
  @MinLength(1, { each: true })
  queries!: string[];
}
