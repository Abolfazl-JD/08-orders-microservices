import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi'
import { AUTH_SERVICE, RabbitmqModule } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URL: Joi.string().required(),
        RABBIT_MQ_BILLING_QUEUE: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required() 
      }),
      envFilePath: './apps/billing/.env'
    }),
    RabbitmqModule.register({
      name: AUTH_SERVICE,
      queue: "AUTH"
    })
  ],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}
