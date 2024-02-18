import { IsNotEmpty, IsOptional } from "class-validator";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { MovieEntity } from "./movies.entity";

@Entity('genres')
export class GenreEntity{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    @IsNotEmpty()
    name: string;

    @Column()
    @IsNotEmpty()
    description: string;

    @ManyToMany(() => MovieEntity, (movie:MovieEntity) => movie.genres)
    @IsOptional()
    movies: MovieEntity[];
}