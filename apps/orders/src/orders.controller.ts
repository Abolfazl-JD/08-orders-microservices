import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { AuthorizationGuard } from '@app/common';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthorizationGuard)
  @Post()
  createOrder(@Body() orderInfo: CreateOrderDto, @Req() req: any) {
    console.log('\n authorization checking was successfull for http request')
    console.log('\n getting authorization from req headers : ', req.headers.authorization)
    return this.ordersService.addNewOrder(orderInfo, req.headers.authorization)
  }
  
  @UseGuards(AuthorizationGuard)
  @Get()
  findOrders() {
    console.log('authorization checking was successfull')
    return this.ordersService.findAllOrders()
  }
}
