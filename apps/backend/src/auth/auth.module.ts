import { Global, Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginThrottleGuard } from './guards/login-throttle.guard';
import { RolesGuard } from './guards/roles.guard';

const PLACEHOLDER_SECRETS = new Set(['', 'replace-me', 'changeme', 'secret']);

/** Falha no boot se o segredo do JWT faltar — melhor que 500 em todo login. */
export function requireJwtSecret(config: ConfigService): string {
  const secret = (config.get<string>('JWT_SECRET') ?? '').trim();
  if (!secret) {
    throw new Error('JWT_SECRET não configurado. Defina-o no .env.');
  }
  if (
    config.get<string>('NODE_ENV') === 'production' &&
    (PLACEHOLDER_SECRETS.has(secret) || secret.length < 32)
  ) {
    throw new Error(
      'JWT_SECRET fraco em produção: use um valor aleatório com 32+ caracteres.',
    );
  }
  return secret;
}

@Global()
@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: requireJwtSecret(config),
        signOptions: {
          expiresIn: (config.get<string>('JWT_EXPIRES_IN') ??
            '7d') as unknown as number,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, RolesGuard, LoginThrottleGuard],
  exports: [AuthService, RolesGuard, JwtModule, UsersModule],
})
export class AuthModule {}
