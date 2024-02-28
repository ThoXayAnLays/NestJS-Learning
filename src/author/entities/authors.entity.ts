import { IsNotEmpty } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BookEntity } from "../../book/entities/books.entity";

@Entity('authors')
export class AuthorEntity{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    @IsNotEmpty()
    name: string;

    @OneToMany(() => BookEntity, book => book.author)
    @IsNotEmpty()
    books: BookEntity[];
}