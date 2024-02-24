import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateBookDto{
    @Expose()
    id: string;

    @IsNotEmpty({ message: 'Title is required' })
    @ApiProperty()
    bookTitle: string;

    @IsNotEmpty({ message: 'Description is required' })
    @ApiProperty()
    description: string;

    @IsNotEmpty({ message: 'Price is required' })
    @IsNumber({}, { message: 'Price must be a number' })
    @ApiProperty()
    price: number;

    @IsNotEmpty({ message: 'Author is required' })
    @ApiProperty()
    author: string;
}

export class UpdateBookDto{
    @Expose()
    id: string;

    @IsOptional()
    @ApiProperty()
    bookTitle: string;

    @IsOptional()
    @ApiProperty()
    description: string;

    @IsOptional()
    @ApiProperty()
    @IsNumber({}, { message: 'Price must be a number' })
    price: number;

    @IsOptional()
    @ApiProperty()
    author: string;
}