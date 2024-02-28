import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { GenreEntity } from "../../genre/entities/genres.entity";

@Entity('movies')
export class MovieEntity{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    @IsNotEmpty()
    title: string;

    @Column()
    @IsNotEmpty()
    description: string;

    @ManyToMany(() => GenreEntity, (genre: GenreEntity) => genre.movies)
    @IsNotEmpty()
    @JoinTable()
    genres: GenreEntity[];
}