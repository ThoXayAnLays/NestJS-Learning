import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { CategoriesEntity } from 'src/entities/categories.entity';
import { ProductsEntity } from 'src/entities/products.entity';
import { UserEntity } from './src/entities/users.entity';
import { DataSource } from 'typeorm';
import { ProfileEntity } from 'src/entities/profiles.entity';
import { GenreEntity } from 'src/entities/genres.entity';
import { MovieEntity } from 'src/entities/movies.entity';
import { AuthorEntity } from 'src/entities/authors.entity';
import { BookEntity } from 'src/entities/books.entity';


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