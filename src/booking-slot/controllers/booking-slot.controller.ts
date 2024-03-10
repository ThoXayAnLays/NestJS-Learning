import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { BookingSlotService } from "../serivces/booking-slot.service";
import { Public } from "src/auth/decorator/public.decorator";
import { FilterBookingSlotDto } from "../dto/filter-booking-slot";
import { BookingSlotEntity } from "../entities/booking-slot.entity";
import { CreateBookingSlotDto, UpdateBookingSlotDto } from "../dto";
import { Types } from "src/auth/decorator/types.decorator";

@ApiBearerAuth()
@ApiTags('BookingSlots')
@Controller('api/booking-slot')
export class BookingSlotController {
    constructor(private readonly bookingSlotService: BookingSlotService) { }

    @Public()
    @ApiQuery({ name: 'page'})
    @ApiQuery({ name: 'item_per_page'})
    @ApiQuery({ name: 'search'})
    @Get()
    async getAllBookingSlots(@Query() query: FilterBookingSlotDto): Promise<any> {
        return await this.bookingSlotService.getAllBookingSlots(query);
    }

    @Public()
    @Get(':id')
    async getBookingSlotById(@Param('id') id: string):Promise<BookingSlotEntity> {
        return await this.bookingSlotService.getBookingSlotById(id);
    }

    @Public()
    //@Types('Doctor')
    @Post()
    async createBookingSlot(@Body() bookingSlotData: Partial<CreateBookingSlotDto>): Promise<BookingSlotEntity> {
        if(bookingSlotData.user === undefined){
            throw new Error('UserId is required');
        }
        return await this.bookingSlotService.createBookingSlot(bookingSlotData);
    }

    @Public()
    //@Types('Doctor')
    @Put(':id')
    async updateBookingSlot(@Param('id') id: string, @Body() bookingSlotData: UpdateBookingSlotDto): Promise<BookingSlotEntity> {
        return await this.bookingSlotService.updateBookingSlot(id, bookingSlotData);
    }

    @Public()
    //@Types('Doctor')
    @Delete(':id')
    async deleteBookingSlot(@Param('id') id: string): Promise<void> {
        return await this.bookingSlotService.deleteBookingSlot(id);
    }
}