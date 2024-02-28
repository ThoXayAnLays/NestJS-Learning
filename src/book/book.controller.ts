import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { BookService } from "./book.service";
import { BookEntity } from "src/book/entities/books.entity";
import { CreateBookDto, UpdateBookDto } from "./dto";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "src/auth/decorator/public.decorator";

@ApiTags('Books')
@Controller('api/books')
export class BookController{
    constructor(private readonly bookService: BookService) {}

    @Get()
    @Public()
    async getAll(): Promise<BookEntity[]> {
        return await this.bookService.getAll();
    }

    @Public()
    @Get(':id')
    async getById(@Param('id') id: string): Promise<BookEntity>{
        return await this.bookService.getById(id);
    }

    @Public()
    @Get('author/:authorId')
    async getBooksByAuthor(@Param('authorId') authorId: string): Promise<BookEntity[]>{
        return await this.bookService.getBooksByAuthor(authorId);
    }

    @Public()
    @Post()
    async createBook(@Body() bookData: Partial<CreateBookDto>): Promise<BookEntity>{
        return await this.bookService.createBook(bookData);
    }

    @Public()
    @Put(':id')
    async updateBook(@Param('id') id: string, @Body() bookData: Partial<UpdateBookDto>): Promise<BookEntity>{
        return await this.bookService.updateBook(id, bookData);
    }

    @Public()
    @Delete(':id')
    async deleteBook(@Param('id') id: string): Promise<void>{
        return await this.bookService.deleteBook(id);
    }
}