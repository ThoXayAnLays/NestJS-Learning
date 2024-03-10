import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserToBookingSlotEntity } from "./entity/user-to-booking-slot.entity";
import { UserToBookingSlotService } from "./services/user-to-booking-slot.service";
import { UserToBookingSlotController } from "./controllers/user-to-booking-slot.controller";
import { UsersModule } from "src/user/user.module";
import { BookingSlotModule } from "src/booking-slot/booking-slot.module";
import { UserEntity } from "src/user/entities/users.entity";
import { BookingSlotEntity } from "src/booking-slot/entities/booking-slot.entity";
import { BullModule } from "@nestjs/bull";

@Module({
    imports: [
        UsersModule,
        BookingSlotModule,
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([UserToBookingSlotEntity,UserEntity, BookingSlotEntity]),
        BullModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                redis: {
                    host: configService.get('REDIS_HOST'),
                    port: configService.get('REDIS_PORT'),
                },
            }),
        }),
        BullModule.registerQueue({
            name: 'userToBookingSlotQueue',
        }),
    ],
    providers: [UserToBookingSlotService],
    controllers: [UserToBookingSlotController],
    exports: [UserToBookingSlotService]
})
export class UserToBookingSlotModule {}