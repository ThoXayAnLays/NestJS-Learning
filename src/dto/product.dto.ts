import { IsNotEmpty, IsNumber, IsString, Min, MinLength } from 'class-validator';

export class ProductDto{
    @IsNotEmpty({message: 'Category id is required'})
    categoryId?: number;

    @MinLength(5, {message: 'Product name must be at least 5 characters'})
    productName?: string;

    @IsNumber({}, {message: 'Price must be a number'})
    price?: number;
}