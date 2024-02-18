import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthorEntity } from "src/entities/authors.entity";
import { AuthorController } from "./author.controller";
import { AuthorService } from "./author.service";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([AuthorEntity]),
    ],
    controllers: [
        AuthorController,
    ],
    providers: [
        AuthorService,
    ],
    exports: [
        AuthorService,
    ],
})
export class AuthorModule{}