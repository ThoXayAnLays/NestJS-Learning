import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/users.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { BullModule } from '@nestjs/bull';
import { EmailConsumer } from './consumers/email.consumer';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        BullModule.registerQueue({
            name: 'sendMail',
        }),
    ],
    controllers: [UserController],
    providers: [UserService, EmailConsumer],
})

export class UsersModule {
}