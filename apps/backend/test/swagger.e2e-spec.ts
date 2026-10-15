/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Swagger (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.setGlobalPrefix('api');

    const config = new DocumentBuilder()
      .setTitle('EasyTrip API')
      .setVersion('1.0.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'jwt',
      )
      .build();
    const doc = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, doc);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/docs-json retorna OpenAPI 3 válido', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/docs-json')
      .expect(200);
    expect(res.body.openapi).toMatch(/^3/);
    expect(res.body.info.title).toBe('EasyTrip API');
  });

  it('contém endpoint /api/auth/register com exemplos e response 201', async () => {
    const res = await request(app.getHttpServer()).get('/api/docs-json');
    const register = res.body.paths['/api/auth/register'].post;
    expect(register).toBeDefined();
    expect(register.summary).toMatch(/Cadastra/i);
    expect(register.responses['201']).toBeDefined();
    expect(register.responses['409']).toBeDefined();
  });

  it('contém security scheme jwt e bearer em /api/auth/me', async () => {
    const res = await request(app.getHttpServer()).get('/api/docs-json');
    expect(res.body.components.securitySchemes.jwt).toMatchObject({
      type: 'http',
      scheme: 'bearer',
    });
    const me = res.body.paths['/api/auth/me'].get;
    expect(me.security).toContainEqual({ jwt: [] });
  });

  it('contém endpoint /api/users/{id}/profile', async () => {
    const res = await request(app.getHttpServer()).get('/api/docs-json');
    expect(res.body.paths['/api/users/{id}/profile']).toBeDefined();
  });
});
