import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CreateMovieDto, UpdateMovieDto } from "./dto";
import MovieService from "./movie.service";
import { MovieEntity } from "src/movie/entities/movies.entity";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "src/auth/decorator/public.decorator";

@ApiTags('Movies')
@Controller('api/movies')
export default class MovieController {
    constructor(
        private readonly movieService: MovieService
    ) {}

    @Get()
    @Public()
    async getAllMovies() {
        return await this.movieService.getAll();
    }

    @Get(':id')
    @Public()
    async getMovieById(@Param('id') id: string){
        return await this.movieService.getById(id);
    }

    @Get('genre/:id')
    @Public()
    async getMoviesByGenre(@Param('id') id: string){
        return await this.movieService.getMoviesByGenre(id);
    }

    @Post()
    @Public()
    async createMovie(@Body() movieData: Partial<CreateMovieDto>): Promise<MovieEntity> {
        return await this.movieService.createMovie(movieData);
    }

    @Put(':id')
    @Public()
    async updateMovie(@Body() movieData: Partial<UpdateMovieDto>, @Param('id') id: string): Promise<MovieEntity>{
        return await this.movieService.updateMovie(id, movieData);
    }

    @Delete(':id')
    @Public()
    async deleteMovie(@Param('id') id: string) {
        return await this.movieService.deleteMovie(id);
    }
}