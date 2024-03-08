import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserToBookingSlotDto {
    request_time: Date;

    @IsNotEmpty({ message: 'User is required' })
    @ApiProperty()
    user: string;

    @IsNotEmpty({ message: 'Booking Slot is required' })
    @ApiProperty()
    bookingSlot: string;
}

export class UpdateUserToBookingSlotDto {
    @ApiProperty({description: 'Pending, Approved, Rejected'})
    status: string;

    @IsOptional()
    @ApiProperty()
    bookingSlot: string;
}