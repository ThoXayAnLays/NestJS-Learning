import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CreateMovieDto, UpdateMovieDto } from "./dto";
import MovieService from "./movie.service";
import { MovieEntity } from "src/entities/movies.entity";

@Controller('movies')
export default class MovieController {
    constructor(
        private readonly movieService: MovieService
    ) {}

    @Get()
    async getAllMovies() {
        return await this.movieService.getAll();
    }

    @Get(':id')
    async getMovieById(@Param('id') id: string){
        return await this.movieService.getById(id);
    }

    @Get('genre/:id')
    async getMoviesByGenre(@Param('id') id: string){
        return await this.movieService.getMoviesByGenre(id);
    }

    @Post()
    async createMovie(@Body() movieData: Partial<CreateMovieDto>): Promise<MovieEntity> {
        return await this.movieService.createMovie(movieData);
    }

    @Put(':id')
    async updateMovie(@Body() movieData: Partial<UpdateMovieDto>, @Param('id') id: string): Promise<MovieEntity>{
        return await this.movieService.updateMovie(id, movieData);
    }

    @Delete(':id')
    async deleteMovie(@Param('id') id: string) {
        return await this.movieService.deleteMovie(id);
    }
}