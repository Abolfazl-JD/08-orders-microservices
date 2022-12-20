import { RabbitmqService } from '@app/common';
import { Controller } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { OrderDocument } from 'apps/orders/src/order.schema';
import { BillingService } from './billing.service';
import { AuthorizationGuard } from '@app/common';

@Controller()
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly RmqService: RabbitmqService
  ) { }

  @UseGuards(AuthorizationGuard)
  @EventPattern('order-created')
  handleOrderCreated(@Payload() data: OrderDocument, @Ctx() context: RmqContext) {
    console.log('\n authorization check for billing RCP request was successfull')
    this.billingService.bill(data)
    console.log('acknowledging message')
    this.RmqService.ack(context)
  }
}
