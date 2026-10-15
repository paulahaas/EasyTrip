import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { SearchHistoryEntry } from '@easytrip/shared';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  OkResponseDto,
  SearchHistoryEntryDto,
} from '../common/swagger-responses';
import { AddHistoryDto } from './dto/add-history.dto';
import { BulkHistoryDto } from './dto/bulk-history.dto';
import { HistoryService } from './history.service';

@ApiTags('History')
@ApiBearerAuth('jwt')
@Controller('history')
@Roles()
export class HistoryController {
  constructor(private readonly history: HistoryService) {}

  @Get()
  @ApiOperation({
    summary: 'Lista as últimas 8 pesquisas do usuário autenticado',
  })
  @ApiOkResponse({ type: [SearchHistoryEntryDto] })
  list(@CurrentUser() user: AuthUser): Promise<SearchHistoryEntry[]> {
    return this.history.list(user.id);
  }

  @Post()
  @ApiOperation({
    summary: 'Adiciona uma pesquisa ao histórico',
    description:
      'Resolve o país via RestCountries e mantém somente as 8 entradas mais recentes do usuário.',
  })
  @ApiResponse({ status: 201, type: SearchHistoryEntryDto })
  @ApiResponse({ status: 404, description: 'País não encontrado' })
  add(
    @CurrentUser() user: AuthUser,
    @Body() dto: AddHistoryDto,
  ): Promise<SearchHistoryEntry> {
    return this.history.addFromQuery(user.id, dto.query);
  }

  @Post('bulk')
  @ApiOperation({
    summary: 'Adiciona múltiplas pesquisas ao histórico (best-effort)',
    description:
      'Usado pelo frontend para migrar histórico do `localStorage` após login. Itens não encontrados são ignorados silenciosamente.',
  })
  @ApiResponse({ status: 201, type: [SearchHistoryEntryDto] })
  bulk(
    @CurrentUser() user: AuthUser,
    @Body() dto: BulkHistoryDto,
  ): Promise<SearchHistoryEntry[]> {
    return this.history.addBulk(user.id, dto.queries);
  }

  @Delete()
  @HttpCode(200)
  @ApiOperation({ summary: 'Remove todo o histórico do usuário' })
  @ApiOkResponse({ type: OkResponseDto })
  async clear(@CurrentUser() user: AuthUser) {
    await this.history.deleteAll(user.id);
    return { ok: true };
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Remove uma entrada específica do histórico' })
  @ApiParam({ name: 'id', example: 'cmoc0cudr0001aql4hyofnthb' })
  @ApiOkResponse({ type: OkResponseDto })
  async remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    await this.history.deleteById(user.id, id);
    return { ok: true };
  }
}
