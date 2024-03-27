import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { BookingSlotService } from "../serivces/booking-slot.service";
import { Public } from "src/auth/decorator/public.decorator";
import { FilterBookingSlotDto } from "../dto/filter-booking-slot";
import { BookingSlotEntity } from "../entities/booking-slot.entity";
import { CreateBookingSlotDto, UpdateBookingSlotDto } from "../dto";
import { Roles } from "src/auth/decorator/types.decorator";

@ApiBearerAuth()
@ApiTags('BookingSlots')
@Controller('api/booking-slot')
export class BookingSlotController {
    constructor(private readonly bookingSlotService: BookingSlotService) { }

    @Public()
    @ApiQuery({ name: 'item_per_page'})
    @ApiQuery({ name: 'page'})
    @Get()
    async getAllBookingSlots(@Query() query: FilterBookingSlotDto): Promise<BookingSlotEntity> {
        try {
            return await this.bookingSlotService.getAllBookingSlots(query);
        } catch (error) {
            return error;
        }
    }

    @Public()
    @Get(':id')
    async getBookingSlotById(@Param('id') id: string):Promise<BookingSlotEntity> {
        return await this.bookingSlotService.getBookingSlotById(id);
    }

    @Public()
    @Roles('Doctor')
    @Post()
    async createBookingSlot(@Body() bookingSlotData: CreateBookingSlotDto, @Req() req:any): Promise<BookingSlotEntity> {
        console.log('User id:',req.user.id)
        return await this.bookingSlotService.createBookingSlot(bookingSlotData, req.user.id);
    }

    @Public()
    @Roles('Doctor')
    @Put(':id')
    async updateBookingSlot(@Param('id') id: string, @Body() bookingSlotData: UpdateBookingSlotDto): Promise<BookingSlotEntity> {
        return await this.bookingSlotService.updateBookingSlot(id, bookingSlotData);
    }

    @Public()
    @Roles('Doctor')
    @Delete(':id')
    async deleteBookingSlot(@Param('id') id: string): Promise<void> {
        return await this.bookingSlotService.deleteBookingSlot(id);
    }
}