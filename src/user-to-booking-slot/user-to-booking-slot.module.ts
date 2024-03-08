import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserToBookingSlotEntity } from "./entity/user-to-booking-slot.ts";
import { UserToBookingSlotService } from "./services/user-to-booking-slot.service";
import { UserToBookingSlotController } from "./controllers/user-to-booking-slot.controller";
import { UsersModule } from "src/user/user.module";
import { BookingSlotModule } from "src/booking-slot/booking-slot.module";
import { UserEntity } from "src/user/entities/users.entity";
import { BookingSlotEntity } from "src/booking-slot/entities/booking-slot.entity";

@Module({
    imports: [
        UsersModule,
        BookingSlotModule,
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([UserToBookingSlotEntity,UserEntity, BookingSlotEntity])
    ],
    providers: [UserToBookingSlotService],
    controllers: [UserToBookingSlotController],
    exports: [UserToBookingSlotService]
})
export class UserToBookingSlotModule {}