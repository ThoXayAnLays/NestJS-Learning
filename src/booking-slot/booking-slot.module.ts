import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookingSlotEntity } from "./entities/booking-slot.entity";
import { BookingSlotService } from "./serivces/booking-slot.service";
import { BookingSlotController } from "./controllers/booking-slot.controller";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "src/user/user.module";
import { UserEntity } from "src/user/entities/users.entity";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([BookingSlotEntity, UserEntity]),
        UsersModule,
    ],
    providers: [BookingSlotService,],
    controllers: [BookingSlotController],
    exports: [BookingSlotService]
})
export class BookingSlotModule {}