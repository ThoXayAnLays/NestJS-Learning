import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, BaseEntity } from 'typeorm';
import { ProductsEntity } from './products.entity';

@Entity('categories')
export class CategoriesEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    categoryName: string;

    @Column()
    description: string;

    @OneToMany(() => ProductsEntity, products => products.category)
    @JoinColumn()
    products: ProductsEntity[];
}