/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { createTestApp, resetDb } from './helpers';

describe('Wishlist (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let token: string;

  beforeAll(async () => {
    const ctx = await createTestApp();
    app = ctx.app;
    prisma = ctx.prisma;
  });

  beforeEach(async () => {
    await resetDb(prisma);
    const reg = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'wl@ex.com', password: 'secret123' });
    token = reg.body.tokens.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('CRUD básico', async () => {
    await request(app.getHttpServer())
      .post('/api/wishlist')
      .set('Authorization', `Bearer ${token}`)
      .send({ cca2: 'JP', countryName: 'Japan', continent: 'Asia' })
      .expect(201);

    const list = await request(app.getHttpServer())
      .get('/api/wishlist')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].cca2).toBe('JP');

    await request(app.getHttpServer())
      .delete('/api/wishlist/JP')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const after = await request(app.getHttpServer())
      .get('/api/wishlist')
      .set('Authorization', `Bearer ${token}`);
    expect(after.body).toHaveLength(0);
  });

  it('duplicata → 409', async () => {
    const body = { cca2: 'JP', countryName: 'Japan', continent: 'Asia' };
    await request(app.getHttpServer())
      .post('/api/wishlist')
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .expect(201);
    await request(app.getHttpServer())
      .post('/api/wishlist')
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .expect(409);
  });

  it('sem token → 401', async () => {
    await request(app.getHttpServer()).get('/api/wishlist').expect(401);
  });
});
