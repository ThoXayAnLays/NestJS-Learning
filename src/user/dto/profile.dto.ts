import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ProfileDto {
    @IsNotEmpty({ message: 'First name is required' })
    @IsString({ message: 'Invalid first name' })
    @ApiProperty()
    firstName: string;

    @IsNotEmpty({ message: 'Last name is required' })
    @IsString({ message: 'Invalid last name' })
    @ApiProperty()
    lastName: string;

    user: string;
}