import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateOrderRequest } from './create-order-request.dto';
import { OrderCreatedEvent } from './create-order.event';

@Injectable()
export class OrderService {
    constructor(
        @Inject('BILLING_SERVICE') private readonly billingClient: ClientKafka,
    ) { }

    getHello(): string {
        return 'Hello World!';
    }

    createOrder({ userId, price }: CreateOrderRequest) {
        this.billingClient.emit(
            'order_created',
            new OrderCreatedEvent('123', userId, price),
        );
    }
}