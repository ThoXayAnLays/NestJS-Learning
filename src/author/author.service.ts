import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthorEntity } from "src/entities/authors.entity";
import { Repository } from "typeorm";
import { CreateAuthorDto, UpdateAuthorDto } from "./dto";

@Injectable()
export class AuthorService{
    constructor(
        @InjectRepository(AuthorEntity) 
        private readonly authorRepository: Repository<AuthorEntity>,
    ) {}

    async getAll(): Promise<AuthorEntity[]> {
        return await this.authorRepository.find();
    }

    async getById(id: string): Promise<AuthorEntity> {
        return await this.authorRepository.findOne({ where: { id } });
    }

    async createAuthor(author: Partial<CreateAuthorDto>): Promise<AuthorEntity> {
        const newAuthor = this.authorRepository.create(author) as AuthorEntity;
        return await this.authorRepository.save(newAuthor);
    }

    async updateAuthor(id: string, author: Partial<UpdateAuthorDto>): Promise<AuthorEntity> {
        await this.authorRepository.update(id, author);
        const updatedAuthor = await this.authorRepository.findOne({ where: { id }, relations: {books: true} });
        if (!updatedAuthor) {
            throw new Error('Author not found');
        }
        return updatedAuthor;
    }

    async deleteAuthor(id: string): Promise<void> {
        await this.authorRepository.delete(id);
    }
}