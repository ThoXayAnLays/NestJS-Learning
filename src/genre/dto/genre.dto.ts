import { Expose } from "class-transformer";
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateGenreDto {
    @Expose()
    @ApiProperty()
    id: string;

    @IsNotEmpty({ message: 'Name is required' })
    @IsString()
    @ApiProperty()
    name: string;

    @IsNotEmpty({ message: 'Description is required' })
    @IsString()
    @ApiProperty()
    description: string;
}

export class UpdateGenreDto {
    @Expose()
    @IsOptional()
    @ApiProperty()
    id: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    name: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    description: string;
}