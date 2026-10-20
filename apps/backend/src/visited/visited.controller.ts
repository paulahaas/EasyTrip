import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
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
import type { VisitedCountry as SharedVisitedCountry } from '@easytrip/shared';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { OkResponseDto, VisitedCountryDto } from '../common/swagger-responses';
import { AddVisitedDto } from './dto/add-visited.dto';
import { UpdateVisitedDto } from './dto/update-visited.dto';
import { VisitedService } from './visited.service';

@ApiTags('Visited')
@ApiBearerAuth('jwt')
@Controller('visited')
@Roles()
export class VisitedController {
  constructor(private readonly visited: VisitedService) {}

  @Get()
  @ApiOperation({
    summary: 'Lista países marcados como visitados pelo usuário',
  })
  @ApiOkResponse({ type: [VisitedCountryDto] })
  list(@CurrentUser() user: AuthUser): Promise<SharedVisitedCountry[]> {
    return this.visited.list(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Marca um país como visitado' })
  @ApiResponse({ status: 201, type: VisitedCountryDto })
  @ApiResponse({ status: 409, description: 'Já marcado como visitado' })
  add(
    @CurrentUser() user: AuthUser,
    @Body() dto: AddVisitedDto,
  ): Promise<SharedVisitedCountry> {
    return this.visited.add(user.id, dto);
  }

  @Patch(':cca2')
  @ApiOperation({ summary: 'Define ou remove a data da viagem' })
  @ApiParam({ name: 'cca2', example: 'FR' })
  @ApiOkResponse({ type: VisitedCountryDto })
  @ApiResponse({ status: 404, description: 'País não está entre os visitados' })
  setDate(
    @CurrentUser() user: AuthUser,
    @Param('cca2') cca2: string,
    @Body() dto: UpdateVisitedDto,
  ): Promise<SharedVisitedCountry> {
    return this.visited.setVisitedAt(user.id, cca2, dto.visitedAt ?? null);
  }

  @Delete(':cca2')
  @HttpCode(200)
  @ApiOperation({ summary: 'Remove marcação de visitado' })
  @ApiParam({ name: 'cca2', example: 'FR' })
  @ApiOkResponse({ type: OkResponseDto })
  async remove(@CurrentUser() user: AuthUser, @Param('cca2') cca2: string) {
    await this.visited.remove(user.id, cca2);
    return { ok: true };
  }
}
