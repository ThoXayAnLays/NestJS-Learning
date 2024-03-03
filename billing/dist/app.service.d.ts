import { ClientKafka } from '@nestjs/microservices';
import { OrderCreatedEvent } from './create-order.event';
export declare class AppService {
    private readonly authClient;
    constructor(authClient: ClientKafka);
    getHello(): string;
    handleOrderCreated(orderCreatedEvent: OrderCreatedEvent): void;
}
