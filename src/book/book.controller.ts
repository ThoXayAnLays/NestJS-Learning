import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { BookService } from "./book.service";
import { BookEntity } from "src/entities/books.entity";
import { CreateBookDto, UpdateBookDto } from "./dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Books')
@Controller('books')
export class BookController{
    constructor(private readonly bookService: BookService) {}

    @Get()
    async getAll(): Promise<BookEntity[]> {
        return await this.bookService.getAll();
    }

    @Get(':id')
    async getById(@Param('id') id: string): Promise<BookEntity>{
        return await this.bookService.getById(id);
    }

    @Get('author/:authorId')
    async getBooksByAuthor(@Param('authorId') authorId: string): Promise<BookEntity[]>{
        return await this.bookService.getBooksByAuthor(authorId);
    }

    @Post()
    async createBook(@Body() bookData: Partial<CreateBookDto>): Promise<BookEntity>{
        return await this.bookService.createBook(bookData);
    }

    @Put(':id')
    async updateBook(@Param('id') id: string, @Body() bookData: Partial<UpdateBookDto>): Promise<BookEntity>{
        return await this.bookService.updateBook(id, bookData);
    }

    @Delete(':id')
    async deleteBook(@Param('id') id: string): Promise<void>{
        return await this.bookService.deleteBook(id);
    }
}