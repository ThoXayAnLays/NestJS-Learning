import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export class UserDto {
    @IsNotEmpty({ message: 'Username is required' })
    @IsString({ message: 'Invalid username' })
    @ApiProperty()
    userName: string;

    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email'})
    @ApiProperty()
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Invalid password' })
    @ApiProperty()
    password: string;

    @IsOptional()
    @IsString({ message: 'Invalid role' })
    roles: string;
}

export class LoginUserDto {
    @IsNotEmpty({ message: 'Email is required' })  
    @ApiProperty()
    email: string;

    @IsNotEmpty({ message: 'Password is required' }) 
    @ApiProperty()
    password: string;
}