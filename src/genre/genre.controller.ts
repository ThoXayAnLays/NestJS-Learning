import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreateGenreDto, UpdateGenreDto } from "./dto";
import GenreService from "./genre.service";
import { GenreEntity } from "src/genre/entities/genres.entity";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Public } from "src/auth/decorator/public.decorator";

@ApiBearerAuth()
@ApiTags('Genres')
@Controller('api/genres')
@UseInterceptors(ClassSerializerInterceptor)
export default class GenreController {
    constructor(private readonly genreService: GenreService) {}

    @Get()
    @Public()
    async getAllGenres() {
        return await this.genreService.getAll();
    }
    
    @Get(':id')
    @Public()
    async getGenreById(@Param('id') id: string) {
        return await this.genreService.getById(id);
    }

    @Post()
    @Public()
    async createGenre(@Body() genreData: CreateGenreDto): Promise<GenreEntity> {
        return await this.genreService.createGenre(genreData);
    }

    @Put(':id')
    @Public()
    async updateGenre(@Body() genreData:UpdateGenreDto, @Param('id') id: string): Promise<GenreEntity> {
        return await this.genreService.updateGenre(id, genreData);
    }

    @Delete(':id')
    @Public()
    async deleteGenre(@Param('id') id: string) {
        return await this.genreService.deleteGenre(id);
    }
}