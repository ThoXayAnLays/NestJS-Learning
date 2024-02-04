import { Expose, Transform } from 'class-transformer';
import {
    IsEmail,
    IsOptional,
    IsString,
} from 'class-validator';

export class UserDto {
    @Expose()
    id: string;

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    password?: string;

    @Expose()
    @Transform(({obj}) => obj.firstName+' '+obj.lastName)
    fullName
}