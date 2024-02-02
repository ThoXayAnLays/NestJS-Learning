import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { CategoriesEntity } from 'src/entities/categories.entity';
import { ProductsEntity } from 'src/entities/products.entity';
import { UserEntity } from './src/entities/users.entity';
import { DataSource } from 'typeorm';


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
    entities: [UserEntity],
})