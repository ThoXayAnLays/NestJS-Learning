import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BookEntity } from "src/book/entities/books.entity";
import { DeepPartial, Repository } from "typeorm";
import { CreateBookDto, UpdateBookDto } from "./dto";
import { AuthorEntity } from "src/author/entities/authors.entity";

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

    async getBooksByAuthor(authorId: string): Promise<BookEntity[]> {
        return await this.bookRepository.find({ where: { author: { id: authorId } } });
    }

    async createBook(bookData: Partial<CreateBookDto>): Promise<BookEntity> {
        const { author, ...rest } = bookData;
        const newBook = this.bookRepository.create({
            ...rest,
            author: { id: author } as DeepPartial<AuthorEntity>
        }) as BookEntity;
        return await this.bookRepository.save(newBook);
    }

    async updateBook(id: string, bookData: Partial<UpdateBookDto>): Promise<BookEntity> {
        const book = await this.bookRepository.findOne({ where: { id } });
        if (!book) {
            throw new Error('Book not found');
        }
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