import { Expose } from 'class-transformer';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class UserDto {
    @Expose()
    id: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export class LoginUserDto {
    @IsNotEmpty() 
    email: string;

    @IsNotEmpty() 
    password: string;
}