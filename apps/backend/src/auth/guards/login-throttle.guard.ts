import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const MAX_KEYS = 10_000;

interface Bucket {
  count: number;
  resetAt: number;
}

/**
 * Limita tentativas de login/cadastro por IP + identificador (10 a cada 15 min).
 * Em memória: suficiente para uma instância; com várias, troque por Redis.
 */
@Injectable()
export class LoginThrottleGuard implements CanActivate {
  private readonly buckets = new Map<string, Bucket>();

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<Request>();
    const body = (req.body ?? {}) as { login?: unknown; email?: unknown };
    const raw = body.login ?? body.email;
    const id = typeof raw === 'string' ? raw.trim().toLowerCase() : '';
    const key = `${req.ip ?? 'unknown'}|${id}`;
    const now = Date.now();

    if (this.buckets.size > MAX_KEYS) this.sweep(now);

    const bucket = this.buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      this.buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
      return true;
    }
    bucket.count += 1;
    if (bucket.count > MAX_ATTEMPTS) {
      throw new HttpException(
        'Muitas tentativas. Aguarde alguns minutos e tente de novo.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    return true;
  }

  private sweep(now: number) {
    for (const [key, bucket] of this.buckets) {
      if (bucket.resetAt <= now) this.buckets.delete(key);
    }
  }
}
