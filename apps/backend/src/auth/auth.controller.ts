import { Body, Controller, Get, HttpCode, Patch, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { AuthResponse, User as SharedUser } from '@easytrip/shared';
import {
  AuthResponseDto,
  ErrorResponseDto,
  UserResponseDto,
} from '../common/swagger-responses';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import type { AuthUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/roles.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Cadastra um novo usuário',
    description:
      'Cria um usuário com role `USER`. Retorna o usuário criado e um token JWT válido por 7 dias.',
  })
  @ApiResponse({
    status: 201,
    type: AuthResponseDto,
    description: 'Criado com sucesso',
  })
  @ApiResponse({
    status: 400,
    type: ErrorResponseDto,
    description: 'Payload inválido',
  })
  @ApiResponse({
    status: 409,
    type: ErrorResponseDto,
    description: 'Email ou nome de usuário já cadastrado',
  })
  register(@Body() dto: RegisterDto): Promise<AuthResponse> {
    return this.auth.register(dto.email, dto.username, dto.password);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Autentica e retorna um access token JWT',
    description:
      'Recebe email ou nome de usuário + senha e retorna o access token que deve ser usado em `Authorization: Bearer <token>`.',
  })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description: 'Credenciais inválidas',
  })
  login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.auth.login(dto.login, dto.password);
  }

  @Get('me')
  @Roles()
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Retorna o usuário autenticado' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description: 'Token ausente ou inválido',
  })
  me(@CurrentUser() user: AuthUser): Promise<SharedUser> {
    return this.auth.me(user.id);
  }

  @Patch('me')
  @Roles()
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Altera o nome de usuário do usuário autenticado' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: 'Nome de usuário já está em uso',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description: 'Token ausente ou inválido',
  })
  updateMe(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateProfileDto,
  ): Promise<SharedUser> {
    return this.auth.updateUsername(user.id, dto.username);
  }
}
