import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookEntity } from "src/book/entities/books.entity";
import { BookController } from "./book.controller";
import { BookService } from "./book.service";
import { Module } from "@nestjs/common";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([BookEntity]),
    ],
    controllers: [
        BookController,
    ],
    providers: [
        BookService,
    ],
    exports: [
        BookService,
    ],
})
export class BookModule{}