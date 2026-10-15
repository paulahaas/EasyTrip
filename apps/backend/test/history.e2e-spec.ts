/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { CountriesService } from '../src/countries/countries.service';
import { createTestApp, resetDb } from './helpers';

describe('History (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let token: string;

  beforeAll(async () => {
    const ctx = await createTestApp();
    app = ctx.app;
    prisma = ctx.prisma;

    // Stub RestCountries (evita dependência de rede)
    const countries = app.get(CountriesService);
    jest.spyOn(countries, 'getByName').mockImplementation((name: string) => {
      const n = name.trim();
      return {
        cca2: n.slice(0, 2).toUpperCase(),
        cca3: n.slice(0, 3).toUpperCase(),
        name: n[0].toUpperCase() + n.slice(1).toLowerCase(),
        continent: 'Europe',
        region: 'Europe',
        subregion: 'Southern Europe',
        borders: [],
        latlng: [40, -4] as [number, number],
        landlocked: false,
        languages: ['Spanish'],
        currencies: ['EUR'],
        population: 47_000_000,
        area: 505_000,
        flag: '',
      };
    });
  });

  beforeEach(async () => {
    await resetDb(prisma);
    const reg = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'hist@ex.com', password: 'secret123' });
    token = reg.body.tokens.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST/GET/DELETE', async () => {
    await request(app.getHttpServer())
      .post('/api/history')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: 'Spain' })
      .expect(201);

    const list = await request(app.getHttpServer())
      .get('/api/history')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].countryName).toBe('Spain');

    await request(app.getHttpServer())
      .delete('/api/history')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const after = await request(app.getHttpServer())
      .get('/api/history')
      .set('Authorization', `Bearer ${token}`);
    expect(after.body).toHaveLength(0);
  });

  it('bulk aceita múltiplas queries', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/history/bulk')
      .set('Authorization', `Bearer ${token}`)
      .send({ queries: ['Spain', 'France', 'Italy'] })
      .expect(201);
    expect(res.body).toHaveLength(3);
  });

  it('sem token → 401', async () => {
    await request(app.getHttpServer()).get('/api/history').expect(401);
  });
});
