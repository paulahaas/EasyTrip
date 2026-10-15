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
import type { WishlistItem } from '@easytrip/shared';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { OkResponseDto, WishlistItemDto } from '../common/swagger-responses';
import { AddWishlistDto } from './dto/add-wishlist.dto';
import { WishlistService } from './wishlist.service';

@ApiTags('Wishlist')
@ApiBearerAuth('jwt')
@Controller('wishlist')
@Roles()
export class WishlistController {
  constructor(private readonly wishlist: WishlistService) {}

  @Get()
  @ApiOperation({ summary: 'Lista países na wishlist do usuário' })
  @ApiOkResponse({ type: [WishlistItemDto] })
  list(@CurrentUser() user: AuthUser): Promise<WishlistItem[]> {
    return this.wishlist.list(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Adiciona um país à wishlist' })
  @ApiResponse({ status: 201, type: WishlistItemDto })
  @ApiResponse({ status: 409, description: 'Já está na wishlist' })
  add(
    @CurrentUser() user: AuthUser,
    @Body() dto: AddWishlistDto,
  ): Promise<WishlistItem> {
    return this.wishlist.add(user.id, dto);
  }

  @Delete(':cca2')
  @HttpCode(200)
  @ApiOperation({ summary: 'Remove um país da wishlist' })
  @ApiParam({ name: 'cca2', example: 'JP', description: 'Código ISO alpha-2' })
  @ApiOkResponse({ type: OkResponseDto })
  async remove(@CurrentUser() user: AuthUser, @Param('cca2') cca2: string) {
    await this.wishlist.remove(user.id, cca2);
    return { ok: true };
  }
}
