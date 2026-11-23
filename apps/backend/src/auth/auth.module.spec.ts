import { ConfigService } from '@nestjs/config';
import { requireJwtSecret } from './auth.module';

const config = (env: Record<string, string | undefined>) =>
  ({ get: (k: string) => env[k] }) as unknown as ConfigService;

describe('requireJwtSecret', () => {
  it('falha sem JWT_SECRET', () => {
    expect(() => requireJwtSecret(config({}))).toThrow(/JWT_SECRET/);
  });

  it('aceita segredo simples fora de produção', () => {
    expect(requireJwtSecret(config({ JWT_SECRET: 'dev' }))).toBe('dev');
  });

  it('recusa placeholder ou segredo curto em produção', () => {
    expect(() =>
      requireJwtSecret(
        config({ JWT_SECRET: 'replace-me', NODE_ENV: 'production' }),
      ),
    ).toThrow(/fraco/);
    expect(
      requireJwtSecret(
        config({ JWT_SECRET: 'x'.repeat(32), NODE_ENV: 'production' }),
      ),
    ).toHaveLength(32);
  });
});
