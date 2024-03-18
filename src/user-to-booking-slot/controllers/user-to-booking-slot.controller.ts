import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { UserToBookingSlotService } from "../services/user-to-booking-slot.service";
import { Public } from "src/auth/decorator/public.decorator";
import { CreateUserToBookingSlotDto, UpdateUserToBookingSlotDto, FilterUserToBookingSlotDto } from "../dto";
import { Types } from "src/auth/decorator/types.decorator";
import { UserToBookingSlotEntity } from "../entity/user-to-booking-slot.entity";

@ApiBearerAuth()
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

    @Public()
    @Types('Patient')
    @Post()
    async create(@Body() data: CreateUserToBookingSlotDto, @Req() req:any) : Promise<any>{
        console.log('User id:',req.user.id)
        const result = await this.userToBookingSlotService.create(data, req.user.id);
        return result;
    }

    @Types('Doctor')
    @Public()
    @Put(':id')
    async update(@Param('id') id: string, @Body() data: UpdateUserToBookingSlotDto, @Req() req:any): Promise<UserToBookingSlotEntity>{
        return this.userToBookingSlotService.update(id, data);
    }

    @Types('Doctor')
    @Public()
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void>{
        return await this.userToBookingSlotService.delete(id);
    }
}