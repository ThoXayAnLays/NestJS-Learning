import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MovieEntity } from "src/movie/entities/movies.entity";
import MovieController from "./movie.controller";
import MovieService from "./movie.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([MovieEntity])
    ],
    controllers: [
        MovieController
    ],
    providers: [
        MovieService
    ],
})
export class MovieModule {}