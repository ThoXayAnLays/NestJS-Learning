import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderRequest } from './create-order-request.dto';

@Controller('api/order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Get()
    getHello(): string {
        return this.orderService.getHello();
    }

    @Post()
    createOrder(@Body() createOrderRequest: CreateOrderRequest) {
        this.orderService.createOrder(createOrderRequest);
    }
}