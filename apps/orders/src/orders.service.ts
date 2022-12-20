import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BILLING_SERVICE } from '@app/common';
import { CreateOrderDto } from './dtos/create-order.dto';
import { Order, OrderDocument } from './order.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @Inject(BILLING_SERVICE)  private billingClient: ClientProxy
  ) {}
  
  async addNewOrder(orderInfo: CreateOrderDto, authorization: string) {
    console.log('\n adding new order ...')
    const order = await this.orderModel.create(orderInfo)
    console.log('\n order was successfully added : ', order)
    console.log('\n emmitting the order-created event to the billing service ...')
    this.billingClient.emit('order-created', { order, authorization })
    return order
  }

  findAllOrders() {
    return this.orderModel.find()
  }
}
