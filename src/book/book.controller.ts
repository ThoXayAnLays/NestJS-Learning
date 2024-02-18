import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { BookService } from "./book.service";
import { BookEntity } from "src/entities/books.entity";
import { CreateBookDto } from "./dto";

@Controller('books')
export class BookController{
    constructor(private readonly bookService: BookService) {}

    @Get()
    async getAll() {
        return await this.bookService.getAll();
    }

    @Get(':id')
    async getById(@Param('id') id: string): Promise<BookEntity>{
        return await this.bookService.getById(id);
    }

    @Get('author/:id')
    async getBooksByAuthor(@Param('id') id: string): Promise<BookEntity>{
        return await this.bookService.getBooksByAuthor(id);
    }

    @Post()
    async createBook(@Body() bookData: CreateBookDto): Promise<BookEntity>{
        return await this.bookService.createBook(bookData);
    }

    @Put(':id')
    async updateBook(@Param('id') id: string, @Body() bookData: CreateBookDto): Promise<BookEntity>{
        return await this.bookService.updateBook(id, bookData);
    }

    @Delete(':id')
    async deleteBook(@Param('id') id: string): Promise<void>{
        return await this.bookService.deleteBook(id);
    }
}