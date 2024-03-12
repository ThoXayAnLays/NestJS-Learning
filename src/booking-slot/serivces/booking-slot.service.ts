import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BookingSlotEntity } from "../entities/booking-slot.entity";
import { DeepPartial, Like, Repository } from "typeorm";
import { FilterBookingSlotDto } from "../dto/filter-booking-slot";
import { CreateBookingSlotDto, UpdateBookingSlotDto } from "../dto";
import { UserEntity } from "src/user/entities/users.entity";

@Injectable()
export class BookingSlotService {
    constructor(
        @InjectRepository(BookingSlotEntity) 
        private readonly bookingSlotRepository: Repository<BookingSlotEntity>,
        @InjectRepository(UserEntity) 
        private readonly userRepository: Repository<UserEntity>
    ) {}

    async getAllBookingSlots(query: FilterBookingSlotDto): Promise<any> {
        const item_per_page = Number(query.item_per_page) || 10;
        const page = Number(query.page) || 1;
        const skip = (page - 1) * item_per_page;
        const search = query.search || '';

        const [res, total] = await this.bookingSlotRepository.findAndCount({
            where: [
                { user: Like('%' + search + '%') },
            ],
            take: item_per_page,
            skip: skip,
            select: ['id', 'start_time', 'end_time', 'user', 'isBooked']
        });
        const lastPage = Math.ceil(total / item_per_page);
        const nextPage = page + 1 > lastPage ? null : page + 1;
        const prevPage = page - 1 < 1 ? null : page - 1;

        await new Promise((resolve) => setTimeout(resolve, 1000));

        return{
            data: res,
            total,
            currentPage: page,
            nextPage,
            prevPage,
            lastPage
        }
    }

    async getBookingSlotById(id:string): Promise<BookingSlotEntity> {
        const bookingSlot = await this.bookingSlotRepository.findOne({ where: { id } });
        if(!bookingSlot) {
            throw new Error("Booking slot not found");
        }
        return bookingSlot;
    }

    async createBookingSlot(bookingSlotData: Partial<CreateBookingSlotDto>): Promise<BookingSlotEntity>{
        const { user, ...rest } = bookingSlotData;
        if(!user) {
            throw new Error("User is required");
        }
        const checkUser = await this.userRepository.findOne({ where: { id: user } });
        if(!checkUser){
            throw new Error("User not found");
        }
        if(!rest.start_time || !rest.end_time) {
            throw new Error("Start time and end time are required");
        }
        if(rest.start_time >= rest.end_time) {
            throw new Error("Start time must be less than end time");
        }
        if(checkUser.types !== 'Doctor') {
            throw new Error("Only doctor can create booking slot");
        }else{
            const newBookingSlot = this.bookingSlotRepository.create({
                ...rest,
                user: { id: user } as DeepPartial<UserEntity>
            }) as BookingSlotEntity;
            return await this.bookingSlotRepository.save(newBookingSlot);
        }
    }

    async updateBookingSlot(id: string, bookingSlotData: Partial<UpdateBookingSlotDto>):Promise<BookingSlotEntity> {
        const bookingSlot = await this.bookingSlotRepository.findOne({ where: { id } });
        if(!bookingSlot) {
            throw new Error("Booking slot not found");
        }
        const { user, ...rest } = bookingSlotData;
        const updatedBookingSlot = {
            ...rest,
            user: { id: user }
        }
        await this.bookingSlotRepository.update({ id }, updatedBookingSlot);
        return await this.bookingSlotRepository.findOne({ where: { id } });
    }

    async deleteBookingSlot(id: string): Promise<void> {
        const bookingSlot = await this.bookingSlotRepository.findOne({ where: { id } });
        if(!bookingSlot) {
            throw new Error("Booking slot not found");
        }
        await this.bookingSlotRepository.delete({ id });
    }
}