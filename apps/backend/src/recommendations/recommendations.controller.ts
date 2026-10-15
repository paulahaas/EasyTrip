import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { RecommendationItem } from '@easytrip/shared';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RecommendationItemDto } from '../common/swagger-responses';
import { RecommendationsService } from './recommendations.service';

@ApiTags('Recommendations')
@ApiBearerAuth('jwt')
@Controller('recommendations')
@Roles()
export class RecommendationsController {
  constructor(private readonly service: RecommendationsService) {}

  @Get()
  @ApiOperation({
    summary: 'Recomendações de países baseadas nas últimas pesquisas',
    description:
      'Pega as 5 pesquisas mais recentes e sugere países vizinhos (fronteira = peso 2) e da mesma sub-região (peso 1). Exclui países já em history/wishlist/visited. Retorna top 8.',
  })
  @ApiOkResponse({ type: [RecommendationItemDto] })
  list(@CurrentUser() user: AuthUser): Promise<RecommendationItem[]> {
    return this.service.forUser(user.id);
  }
}
