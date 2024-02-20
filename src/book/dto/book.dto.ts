import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateBookDto{
    @Expose()
    id: string;

    @IsNotEmpty({ message: 'Title is required' })
    bookTitle: string;

    @IsNotEmpty({ message: 'Description is required' })
    description: string;

    @IsNotEmpty({ message: 'Price is required' })
    @IsNumber({}, { message: 'Price must be a number' })
    price: number;

    @IsNotEmpty({ message: 'Author is required' })
    author: string;
}

export class UpdateBookDto{
    @Expose()
    id: string;

    @IsOptional()
    bookTitle: string;

    @IsOptional()
    description: string;

    @IsOptional()
    @IsNumber({}, { message: 'Price must be a number' })
    price: number;

    @IsOptional()
    author: string;
}