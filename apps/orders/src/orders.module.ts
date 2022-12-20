import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import * as Joi from 'joi'
import { DatabaseModule, RabbitmqModule } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './order.schema';
import { BILLING_SERVICE, AUTH_SERVICE } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        RABBIT_MQ_URL: Joi.string().required(),
        RABBIT_MQ_BILLING_QUEUE: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required()
      }),
      envFilePath: './apps/orders/.env'
    }),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    RabbitmqModule.register({
      name: BILLING_SERVICE,
      queue: 'BILLING'
    }),
    RabbitmqModule.register({
      name: AUTH_SERVICE,
      queue: 'AUTH'
    }),
    DatabaseModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
