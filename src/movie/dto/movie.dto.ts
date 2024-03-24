import { Expose } from "class-transformer";
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateMovieDto {
    @IsNotEmpty({ message: 'Title is required' })
    @ApiProperty()
    title: string;

    @IsNotEmpty({ message: 'Description is required' })
    @ApiProperty()
    description: string;

    @IsNotEmpty({ message: 'Genre is required' })
    @ApiProperty()
    genres: string[];
}

export class UpdateMovieDto {
    @IsOptional()
    @ApiProperty()
    title: string;

    @IsOptional()
    @ApiProperty()
    description: string;

    @ApiProperty()
    @IsOptional()
    genres: string[];
}