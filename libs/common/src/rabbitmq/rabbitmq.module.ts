import { DynamicModule, Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { RabbitmqService } from "./rabbitmq.service";
import { ConfigService } from '@nestjs/config';

interface RmqModuleOptions {
    name: string
    queue: string
}

@Module({
    providers: [RabbitmqService],
    exports: [RabbitmqService]
})
export class RabbitmqModule{
    static register({ name, queue }: RmqModuleOptions): DynamicModule {
        return {
            module: RabbitmqModule,
            imports: [
                ClientsModule.registerAsync([
                    {
                        name,
                        useFactory: (configService: ConfigService) => ({
                            transport: Transport.RMQ,
                            options: {
                                urls: [configService.get<string>('RABBIT_MQ_URL')],
                                queue : configService.get<string>(`RABBIT_MQ_${queue}_QUEUE`)
                            }
                        }),
                        inject: [ConfigService]
                    }
                ])
            ],
            exports : [ClientsModule]
        }
    }
}