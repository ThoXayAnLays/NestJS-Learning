import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BookEntity } from "src/entities/books.entity";
import { Repository } from "typeorm";
import { CreateBookDto, UpdateBookDto } from "./dto";

@Injectable()
export class BookService{
    constructor(
        @InjectRepository(BookEntity) private readonly bookRepository: Repository<BookEntity>
    ) {}

    async getAll(): Promise<BookEntity[]> {
        return await this.bookRepository.find();
    }

    async getById(id: string): Promise<BookEntity> {
        return await this.bookRepository.findOne({ where: { id } });
    }

    async getBooksByAuthor(id: string): Promise<BookEntity> {
        return await this.bookRepository.findOne({ where: { id }, relations: ['author'] });
    }

    async createBook(bookData: CreateBookDto): Promise<BookEntity> {
        const newBook = this.bookRepository.create({
            ...bookData,
            author: { id: bookData.author } // Assuming 'author' is a string representing the author's ID
        });
        return await this.bookRepository.save(newBook);
    }

    async updateBook(id: string, bookData: UpdateBookDto): Promise<BookEntity> {
        const { author, ...rest } = bookData;
        const updatedBookData = {
            ...rest,
            author: { id: author } // Assuming 'author' is a string representing the author's ID
        };
        await this.bookRepository.update(id, updatedBookData);
        return await this.bookRepository.findOne({ where: { id }});
    }

    async deleteBook(id: string): Promise<void> {
        const book = await this.bookRepository.findOne({ where: { id } });
        if (!book) {
            throw new Error('Book not found');
        }
        await this.bookRepository.delete(id);
    }
}