import { RabbitmqService } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const rmqService = app.get(RabbitmqService)
  app.connectMicroservice(rmqService.getOptions('AUTH', true))
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))
  const configService = app.get(ConfigService)
  await app.startAllMicroservices()
  await app.listen(configService.get<number>('PORT'));
}
bootstrap();
