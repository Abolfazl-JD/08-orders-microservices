import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule, RabbitmqModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi'
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_LIFETIME: Joi.string().required(),
        PORT: Joi.number().required(),
        RABBIT_MQ_URL: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required()
      }),
      envFilePath: './apps/auth/.env'
    }),
    DatabaseModule,
    UsersModule,
    RabbitmqModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
