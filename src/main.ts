import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
//const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();

// app.use(
//   cookieSession({
//     keys: ['geyimburada'],
//   }),
// );
// const app = await NestFactory.create(AppModule, {
//   logger: ['log', 'error', 'warn', 'debug', 'verbose'], // Include all log levels
// });

// app.useGlobalPipes(
//   new ValidationPipe({
//     //extra security that will remove any properties that are not in the DTO
//     whitelist: true,
//   }),
// );
