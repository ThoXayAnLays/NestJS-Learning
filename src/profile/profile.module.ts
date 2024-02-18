import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProfileEntity } from "src/entities/profiles.entity";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([ProfileEntity]),
    ],
    controllers: [
        ProfileController,
    ],
    providers: [
        ProfileService,
    ],
    exports: [ProfileService],
})

export class ProfileModule {}