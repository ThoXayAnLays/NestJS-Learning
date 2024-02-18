import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MovieEntity } from "src/entities/movies.entity";
import { Repository } from "typeorm";
import { CreateMovieDto, UpdateMovieDto } from "./dto";
import { MovieNotFoundException } from "./exceptions/movieNotFound.exception";

@Injectable()
export default class MovieService {
    constructor(
        @InjectRepository(MovieEntity) private readonly movieRepository: Repository<MovieEntity>,
    ) {}

    async getAll(): Promise<MovieEntity[]> {
        return await this.movieRepository.find();
    }

    async getById(id: string): Promise<MovieEntity> {
        const movie = await this.movieRepository.findOne({ where: { id } });
        if (!movie) {
            throw new MovieNotFoundException(id);
        }
        return movie;
    }

    async getMoviesByGenre(id: string): Promise<MovieEntity[]> {
        const movies = await this.movieRepository.find({ where: { id }, relations: ['genre'] });
        if (!movies) {
            throw new MovieNotFoundException(id);
        }
        return movies;
    }

    async createMovie(movieData: Partial<CreateMovieDto>): Promise<MovieEntity> {
        const genres = movieData.genres.map(genreId => ({ id: genreId }));
        const movie = this.movieRepository.create({ ...movieData, genres });
        return await this.movieRepository.save(movie);
    }

    async updateMovie(id: string, movieData: Partial<UpdateMovieDto>): Promise<MovieEntity> {
        const genres = movieData.genres.map(genreId => ({ id: genreId }));
        await this.movieRepository.update(id, { ...movieData, genres });
        const updatedMovie = await this.movieRepository.findOne({ where: { id } });
        if (!updatedMovie) {
            throw new MovieNotFoundException(id);
        }
        return updatedMovie;
    }

    async deleteMovie(id: string): Promise<void> {
        const movie = await this.movieRepository.findOne({ where: { id } });
        if (!movie) {
            throw new MovieNotFoundException(id);
        }
        await this.movieRepository.delete(id);
    }
}