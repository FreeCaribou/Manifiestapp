import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { mockingData } from './mocking-data';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);

  if (process.env.NODE_ENV == 'dev' || process.env.NODE_ENV == 'test') {
    await mockingData();
    console.log('DB Init ok');
  }

}
bootstrap();
