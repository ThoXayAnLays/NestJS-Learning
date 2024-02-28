import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GenreEntity } from "src/genre/entities/genres.entity";
import { Repository } from "typeorm";
import GenreNotFoundException from "./exceptions/genreNotFound.exception";
import { CreateGenreDto, UpdateGenreDto } from "./dto";

@Injectable()
export default class GenreService {
    constructor(
        @InjectRepository(GenreEntity) private readonly genreRepository: Repository<GenreEntity>
    ) {}

    async getAll(): Promise<GenreEntity[]> {
        return await this.genreRepository.find({
            relations: {
                movies: true,
            }
        });
    }

    async getById(id: string): Promise<GenreEntity> {
        const genre = await this.genreRepository.findOne({ where: { id }, relations: ['movies'] });
        if (!genre) {
            throw new GenreNotFoundException(id);
        }
        return genre;
    }

    async createGenre(genreData: Partial<CreateGenreDto>): Promise<GenreEntity> {
        const genre = this.genreRepository.create(genreData);
        return await this.genreRepository.save(genre);
    }

    async updateGenre(id: string, genreData: Partial<UpdateGenreDto>): Promise<GenreEntity> {
        await this.genreRepository.update(id, genreData);
        const updatedGenre = await this.genreRepository.findOne({ 
            where: { id },
            relations: {
                movies: true
            }
        });
        if (!updatedGenre) {
            throw new GenreNotFoundException(id);
        }
        return updatedGenre;
    }

    async deleteGenre(id: string): Promise<void> {
        const genre = await this.genreRepository.findOne({ where: { id } });
        if (!genre) {
            throw new GenreNotFoundException(id);
        }
        await this.genreRepository.delete(id);
    }
}