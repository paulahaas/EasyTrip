import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Request, Response, NextFunction } from 'express';
import { existsSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('EasyTrip API')
    .setDescription(
      'API do EasyTrip — autenticação JWT, histórico de pesquisas, wishlist, países visitados, ' +
        'recomendações por fronteira/sub-região, estatísticas por continente e perfis compartilháveis. ' +
        'Todas as rotas protegidas exigem `Authorization: Bearer <token>` obtido via /auth/login.',
    )
    .setVersion('1.0.0')
    .setContact('EasyTrip', 'https://github.com/marcella-81/EasyTrip', '')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Cole o accessToken retornado por /auth/login ou /auth/register',
      },
      'jwt',
    )
    .addTag('Auth', 'Cadastro, login e perfil do usuário autenticado')
    .addTag('History', 'Histórico de pesquisas do usuário (máx 8)')
    .addTag('Wishlist', 'Países que o usuário quer visitar')
    .addTag('Visited', 'Países visitados (marcação manual)')
    .addTag('Recommendations', 'Sugestões por fronteira e sub-região')
    .addTag('Stats', 'Estatísticas de visitação por continente')
    .addTag('Users', 'Perfis públicos compartilháveis')
    .addTag(
      'Destination',
      'Busca de informações do destino (país + clima + câmbio)',
    )
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDoc, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const publicDir = join(__dirname, '..', 'public');
  if (existsSync(publicDir)) {
    app.useStaticAssets(publicDir);

    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.startsWith('/api')) return next();
      const indexPath = join(publicDir, 'index.html');
      if (existsSync(indexPath)) return res.sendFile(indexPath);
      next();
    });
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🌍 Servidor rodando em http://localhost:${port}`);
  console.log(`📘 Swagger UI em http://localhost:${port}/api/docs`);
}
void bootstrap();
