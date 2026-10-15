/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { createTestApp, resetDb } from './helpers';

describe('PublicProfile (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let token: string;
  let userId: string;

  beforeAll(async () => {
    const ctx = await createTestApp();
    app = ctx.app;
    prisma = ctx.prisma;
  });

  beforeEach(async () => {
    await resetDb(prisma);
    const reg = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'pp@ex.com', password: 'secret123' });
    token = reg.body.tokens.accessToken;
    userId = reg.body.user.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('retorna perfil público com auth', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/users/${userId}/profile`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.id).toBe(userId);
    expect(res.body.email).toBe('pp@ex.com');
    expect(res.body.perContinent).toHaveLength(7);
    expect(res.body.totalVisited).toBe(0);
  });

  it('401 sem token', async () => {
    await request(app.getHttpServer())
      .get(`/api/users/${userId}/profile`)
      .expect(401);
  });

  it('404 com id inexistente', async () => {
    await request(app.getHttpServer())
      .get('/api/users/nao-existe-id/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });

  it('USER retorna role USER no /me', async () => {
    const me = await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(me.body.role).toBe('USER');
  });
});
