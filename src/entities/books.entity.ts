import { IsNotEmpty, IsNumber } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AuthorEntity } from "./authors.entity";

@Entity('books')
export class BookEntity{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column() 
    @IsNotEmpty()  
    bookTitle: string;

    @Column()
    @IsNotEmpty()
    description: string;

    @Column()
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ManyToOne(() => AuthorEntity, author => author.books)
    @IsNotEmpty()
    author: AuthorEntity;
}