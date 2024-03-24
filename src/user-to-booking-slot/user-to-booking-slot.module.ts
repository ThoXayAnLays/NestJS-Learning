import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserToBookingSlotEntity } from "./entity/user-to-booking-slot.entity";
import { UserToBookingSlotService } from "./services/user-to-booking-slot.service";
import { UserToBookingSlotController } from "./controllers/user-to-booking-slot.controller";
import { UsersModule } from "src/user/user.module";
import { UserEntity } from "src/user/entities/users.entity";
import { BookingSlotEntity } from "src/booking-slot/entities/booking-slot.entity";
import { BullModule } from "@nestjs/bull";
import { RequestWorker } from "./request.woker";
import { QueueService } from "./services/queue.service";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([UserToBookingSlotEntity, UserEntity, BookingSlotEntity]),
        UsersModule,
        BullModule.registerQueue({
            name: 'bookingQueue'
        }),
    ],
    providers: [UserToBookingSlotService, QueueService, RequestWorker],
    controllers: [UserToBookingSlotController],
    exports: [UserToBookingSlotService, QueueService]
})
export class UserToBookingSlotModule { }