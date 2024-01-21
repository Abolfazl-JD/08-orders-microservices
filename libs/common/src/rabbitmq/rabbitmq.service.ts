import { Injectable } from "@nestjs/common";
import { RmqOptions, Transport, RmqContext } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitmqService {

    constructor(private configService: ConfigService){}

    getOptions(queue: string, noAck = false): RmqOptions {
        return {
            transport: Transport.RMQ,
            options: {
                urls: [this.configService.get<string>('RABBIT_MQ_URL')],
                queue: this.configService.get<string>(`RABBIT_MQ_${queue}_QUEUE`),
                noAck,
                persistent: true
            }
        }
    }

    ack(context: RmqContext) {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()
        console.log('\n message acknowledging')
        channel.ack(originalMessage)
        console.log('\n message acknowledged')
    }
} 