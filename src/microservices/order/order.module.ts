import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'BILLING_SERVICE',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'billing',
                        brokers: ['localhost:9092'],
                    },
                    consumer: {
                        groupId: 'billing-consumer',
                    },
                },
            },
        ]),
    ],
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule { }