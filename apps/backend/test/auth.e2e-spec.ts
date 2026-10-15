/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access */
import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { createTestApp, resetDb } from './helpers';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const ctx = await createTestApp();
    app = ctx.app;
    prisma = ctx.prisma;
  });

  beforeEach(async () => {
    await resetDb(prisma);
  });

  afterAll(async () => {
    await app.close();
  });

  it('register → login → /me', async () => {
    const reg = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'alice@ex.com', password: 'secret123' })
      .expect(201);

    expect(reg.body.tokens.accessToken).toBeTruthy();
    expect(reg.body.user.email).toBe('alice@ex.com');

    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'alice@ex.com', password: 'secret123' })
      .expect(200);

    const token = login.body.tokens.accessToken as string;
    expect(token).toBeTruthy();

    const me = await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(me.body.email).toBe('alice@ex.com');
  });

  it('/me sem token → 401', async () => {
    await request(app.getHttpServer()).get('/api/auth/me').expect(401);
  });

  it('login com senha errada → 401', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'bob@ex.com', password: 'secret123' })
      .expect(201);
    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'bob@ex.com', password: 'wrongpwd' })
      .expect(401);
  });

  it('register duplicado → 409', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'dup@ex.com', password: 'secret123' })
      .expect(201);
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'dup@ex.com', password: 'secret123' })
      .expect(409);
  });

  it('validação: email inválido → 400', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'not-email', password: 'secret123' })
      .expect(400);
  });
});
