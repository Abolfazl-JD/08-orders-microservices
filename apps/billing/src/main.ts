import { RabbitmqService } from '@app/common';
import { NestFactory } from '@nestjs/core';
import { BillingModule } from './billing.module';

async function bootstrap() {
  const app = await NestFactory.create(BillingModule);
  const rmqService = app.get(RabbitmqService)
  app.connectMicroservice(rmqService.getOptions('BILLING'))
  await app.startAllMicroservices();
}
bootstrap();
