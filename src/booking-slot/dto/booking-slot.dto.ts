import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateBookingSlotDto {
    @IsDateString()
    @ApiProperty()
    start_time: Date;

    @IsDateString()
    @ApiProperty()
    end_time: Date;

    @IsOptional()
    @ApiProperty()
    user: string;

    @IsOptional()
    @ApiProperty()
    isBooked: boolean;
}

export class UpdateBookingSlotDto {
    @IsDateString()
    @ApiProperty()
    start_time: Date;

    @IsDateString()
    @ApiProperty()
    end_time: Date;
    
    @IsBoolean()
    @ApiProperty()
    isBooked: boolean;

    @IsNotEmpty({ message:"User is required" })
    @ApiProperty()
    user: string;
}