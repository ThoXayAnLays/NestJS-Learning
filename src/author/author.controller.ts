import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { AuthorService } from "./author.service";
import { AuthorEntity } from "src/author/entities/authors.entity";
import { CreateAuthorDto, UpdateAuthorDto } from "./dto";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "src/auth/decorator/public.decorator";

@ApiTags('Authors')
@Controller('api/authors')
export class AuthorController {
    constructor(private readonly authorService: AuthorService){}

    @Get()
    @Public()
    async getAll(): Promise<AuthorEntity[]> {
        return await this.authorService.getAll();
    }

    @Get(':id')
    @Public()
    async getAuthor(@Param('id') id: string): Promise<AuthorEntity> {
        return await this.authorService.getById(id);
    }

    @Post()
    @Public()
    async createAuthor(@Body() author: Partial<CreateAuthorDto>): Promise<AuthorEntity> {
        return await this.authorService.createAuthor(author);
    }

    @Put(':id')
    @Public()
    async updateAuthor(@Param('id') id: string, @Body() author: Partial<UpdateAuthorDto>): Promise<AuthorEntity> {
        return await this.authorService.updateAuthor(id, author);
    }

    @Delete(':id')
    @Public()
    async deleteAuthor(@Param('id') id: string): Promise<void> {
        return await this.authorService.deleteAuthor(id);
    }
}