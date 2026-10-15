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
      .send({ email: 'alice@ex.com', username: 'Alice', password: 'secret123' })
      .expect(201);

    expect(reg.body.tokens.accessToken).toBeTruthy();
    expect(reg.body.user.email).toBe('alice@ex.com');
    // salvo em minúsculas
    expect(reg.body.user.username).toBe('alice');

    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ login: 'alice@ex.com', password: 'secret123' })
      .expect(200);

    const token = login.body.tokens.accessToken as string;
    expect(token).toBeTruthy();

    const me = await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(me.body.email).toBe('alice@ex.com');
    expect(me.body.username).toBe('alice');
  });

  it('login com nome de usuário (sem diferenciar maiúsculas)', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'carol@ex.com', username: 'carol.s', password: 'secret123' })
      .expect(201);
    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ login: 'Carol.S', password: 'secret123' })
      .expect(200);
    expect(login.body.user.email).toBe('carol@ex.com');
  });

  it('/me sem token → 401', async () => {
    await request(app.getHttpServer()).get('/api/auth/me').expect(401);
  });

  it('login com senha errada → 401', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'bob@ex.com', username: 'bob', password: 'secret123' })
      .expect(201);
    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ login: 'bob@ex.com', password: 'wrongpwd' })
      .expect(401);
  });

  it('register com email duplicado → 409', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'dup@ex.com', username: 'dup1', password: 'secret123' })
      .expect(201);
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'dup@ex.com', username: 'dup2', password: 'secret123' })
      .expect(409);
  });

  it('register com nome de usuário duplicado → 409', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'um@ex.com', username: 'mesmo', password: 'secret123' })
      .expect(201);
    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'dois@ex.com', username: 'MESMO', password: 'secret123' })
      .expect(409);
    expect(res.body.message).toMatch(/nome de usuário/i);
  });

  it('validação: email inválido → 400', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'not-email', username: 'valido', password: 'secret123' })
      .expect(400);
  });

  it('validação: nome de usuário inválido → 400', async () => {
    for (const username of ['ab', 'tem espaco', 'acentuação', 'x'.repeat(21)]) {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email: 'v@ex.com', username, password: 'secret123' })
        .expect(400);
    }
  });

  it('PATCH /me troca o nome de usuário e recusa nome em uso', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'ocupado@ex.com', username: 'ocupado', password: 'secret123' })
      .expect(201);
    const reg = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'dan@ex.com', username: 'dan', password: 'secret123' })
      .expect(201);
    const token = reg.body.tokens.accessToken as string;

    const ok = await request(app.getHttpServer())
      .patch('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'Dan.Viaja' })
      .expect(200);
    expect(ok.body.username).toBe('dan.viaja');

    await request(app.getHttpServer())
      .patch('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'ocupado' })
      .expect(409);

    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ login: 'dan.viaja', password: 'secret123' })
      .expect(200);
  });
});
