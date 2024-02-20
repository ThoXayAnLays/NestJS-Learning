import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { AuthorService } from "./author.service";
import { AuthorEntity } from "src/entities/authors.entity";
import { CreateAuthorDto, UpdateAuthorDto } from "./dto";

@Controller('authors')
export class AuthorController {
    constructor(private readonly authorService: AuthorService){}

    @Get()
    async getAll(): Promise<AuthorEntity[]> {
        return await this.authorService.getAll();
    }

    @Get(':id')
    async getAuthor(@Param('id') id: string): Promise<AuthorEntity> {
        return await this.authorService.getById(id);
    }

    @Post()
    async createAuthor(@Body() author: Partial<CreateAuthorDto>): Promise<AuthorEntity> {
        return await this.authorService.createAuthor(author);
    }

    @Put(':id')
    async updateAuthor(@Param('id') id: string, @Body() author: Partial<UpdateAuthorDto>): Promise<AuthorEntity> {
        return await this.authorService.updateAuthor(id, author);
    }

    @Delete(':id')
    async deleteAuthor(@Param('id') id: string): Promise<void> {
        return await this.authorService.deleteAuthor(id);
    }
}