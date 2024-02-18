import { Expose } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAuthorDto {
    @Expose()
    id: string;

    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Invalid name' })
    name: string;
}

export class UpdateAuthorDto{
    @Expose()
    id: string;

    @IsOptional()
    @IsString({ message: 'Invalid name' })
    name: string;
}