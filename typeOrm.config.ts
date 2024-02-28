import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { CategoriesEntity } from 'src/entities/categories.entity';
import { ProductsEntity } from 'src/entities/products.entity';
import { UserEntity } from './src/user/entities/users.entity';
import { DataSource } from 'typeorm';
import { ProfileEntity } from 'src/user/entities/profiles.entity';
import { GenreEntity } from 'src/genre/entities/genres.entity';
import { MovieEntity } from 'src/movie/entities/movies.entity';
import { AuthorEntity } from 'src/author/entities/authors.entity';
import { BookEntity } from 'src/book/entities/books.entity';


config();

const configService = new ConfigService();

export default new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5434,
    username: 'postgres',
    password: '123',
    database: 'nestjs',
    logger: 'advanced-console',
    logging: 'all',
    synchronize: true,
    migrations: ['migrations/**'],
    entities: [UserEntity, ProfileEntity, GenreEntity, MovieEntity, AuthorEntity, BookEntity],
})