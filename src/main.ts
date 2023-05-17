import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SwaggerAuthMiddleware } from './middlewares/swagger-auth.middleware';
import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './middlewares/exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v3');
  app.enableCors();
  app.use(cookieParser());
  // app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('Pazareo API')
    .setDescription('Pazareo API Documentation')
    .setVersion('1.0')
    .addTag('users')
    .setContact(
      'Dev Team In Discord',
      'https://discord.gg/TSnhsqAu',
      'support@example.com',
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  app.use('/api-doc', SwaggerAuthMiddleware);

  await app.listen(5000);
}
bootstrap();
