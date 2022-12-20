import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))
  const configService = app.get(ConfigService)
  await app.listen(configService.get<number>('PORT'));
}
bootstrap();
