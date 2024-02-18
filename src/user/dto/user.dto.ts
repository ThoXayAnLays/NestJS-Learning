import { Expose } from 'class-transformer';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class UserDto {
    @Expose()
    id: string;

    @IsNotEmpty({ message: 'Username is required' })
    @IsString({ message: 'Invalid username' })
    userName: string;

    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email'})
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Invalid password' })
    password: string;
}

export class LoginUserDto {
    @IsNotEmpty({ message: 'Email is required' })  
    email: string;

    @IsNotEmpty({ message: 'Password is required' }) 
    password: string;
}