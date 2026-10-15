import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { StatsResponse } from '@easytrip/shared';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { StatsResponseDto } from '../common/swagger-responses';
import { StatsService } from './stats.service';

@ApiTags('Stats')
@ApiBearerAuth('jwt')
@Controller('stats')
@Roles()
export class StatsController {
  constructor(private readonly stats: StatsService) {}

  @Get('continents')
  @ApiOperation({
    summary: 'Estatísticas de países visitados por continente',
    description:
      'Para cada continente retorna `visited`, `total` (snapshot RestCountries) e `percent` (1 casa decimal).',
  })
  @ApiOkResponse({ type: StatsResponseDto })
  continents(@CurrentUser() user: AuthUser): Promise<StatsResponse> {
    return this.stats.continents(user.id);
  }
}
