import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class ProfileDto {
    @Expose()
    id: string;

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