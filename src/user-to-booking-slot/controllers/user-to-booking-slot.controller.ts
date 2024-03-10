import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { UserToBookingSlotService } from "../services/user-to-booking-slot.service";
import { Public } from "src/auth/decorator/public.decorator";
import { CreateUserToBookingSlotDto, UpdateUserToBookingSlotDto, FilterUserToBookingSlotDto } from "../dto";
import { Types } from "src/auth/decorator/types.decorator";
import { UserToBookingSlotEntity } from "../entity/user-to-booking-slot.entity";

@ApiTags('UserToBookingSlots')
@Controller('api/user-to-booking-slot')
export class UserToBookingSlotController {
    constructor(
        private readonly userToBookingSlotService: UserToBookingSlotService,
    ) { }

    @Public()
    @ApiQuery({ name: 'page'})
    @ApiQuery({ name: 'item_per_page'})
    @ApiQuery({ name: 'search'})
    @Get()
    async getAll(@Query() query: FilterUserToBookingSlotDto): Promise<any> {
        return this.userToBookingSlotService.getAll(query);
    }

    @Public()
    @Get(':id')
    async getById(@Param('id') id: string): Promise<any> {
        return this.userToBookingSlotService.getById(id);
    }

    //@Types('Patient')
    @Public()
    @Post()
    async create(@Body() data: CreateUserToBookingSlotDto): Promise<UserToBookingSlotEntity>{
        if(data.user === undefined){
            throw new Error('UserId is required');
        }
        if(data.bookingSlot === undefined){
            throw new Error('BookingSlotId is required');
        }
        const createUserToBookingSlot = await this.userToBookingSlotService.create(data);
        return createUserToBookingSlot;
    }

    //@Types('Doctor')
    @Public()
    @Put(':id')
    async update(@Param('id') id: string, @Body() data: UpdateUserToBookingSlotDto): Promise<UserToBookingSlotEntity>{
        return this.userToBookingSlotService.update(id, data);
    }

    //@Types('Doctor')
    @Public()
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void>{
        return await this.userToBookingSlotService.delete(id);
    }
}