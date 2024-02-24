import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreateGenreDto, UpdateGenreDto } from "./dto";
import GenreService from "./genre.service";
import { GenreEntity } from "src/entities/genres.entity";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Genres')
@Controller('genres')
@UseInterceptors(ClassSerializerInterceptor)
export default class GenreController {
    constructor(private readonly genreService: GenreService) {}

    @Get()
    async getAllGenres() {
        return await this.genreService.getAll();
    }
    
    @Get(':id')
    async getGenreById(@Param('id') id: string) {
        return await this.genreService.getById(id);
    }

    @Post()
    async createGenre(@Body() genreData: Partial<CreateGenreDto>): Promise<GenreEntity> {
        return await this.genreService.createGenre(genreData);
    }

    @Put(':id')
    async updateGenre(@Body() genreData: Partial<UpdateGenreDto>, @Param('id') id: string): Promise<GenreEntity> {
        return await this.genreService.updateGenre(id, genreData);
    }

    @Delete(':id')
    async deleteGenre(@Param('id') id: string) {
        return await this.genreService.deleteGenre(id);
    }
}