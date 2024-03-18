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

        const [res, total] = await this.bookingSlotRepository.findAndCount({
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

    async getBookingSlotById(id:string): Promise<any> {
        const bookingSlot = await this.bookingSlotRepository.findOne({ where: { id } });
        if(!bookingSlot) {
            return("Booking slot not found");
        }
        return bookingSlot;
    }

    async createBookingSlot(bookingSlotData: Partial<CreateBookingSlotDto>, userId: string): Promise<any>{
        const { start_time, end_time, isBooked } = bookingSlotData;
        if(!userId) {
            return("User is required");
        }
        const checkUser = await this.userRepository.findOne({ where: { id: userId } });
        if(!checkUser){
            return("User not found");
        }
        if(!start_time || !end_time) {
            return("Start time and end time are required");
        }
        if(start_time >= end_time) {
            return("Start time must be less than end time");
        }
        const newBookingSlot = this.bookingSlotRepository.create({
            start_time,
            end_time,
            isBooked,
            user: { id: userId } as DeepPartial<UserEntity>
        }) as BookingSlotEntity;
        return await this.bookingSlotRepository.save(newBookingSlot);
    }

    async updateBookingSlot(id: string, bookingSlotData: Partial<UpdateBookingSlotDto>):Promise<any> {
        const bookingSlot = await this.bookingSlotRepository.findOne({ where: { id } });
        if(!bookingSlot) {
            return("Booking slot not found");
        }
        if(!bookingSlotData.user) {
            return ("User is required");
        }
        const checkUser = await this.userRepository.findOne({ where: { id: bookingSlotData.user } });
        if(!checkUser){
            return("User not found");
        }
        if(checkUser.roles !== 'Doctor') {
            return("Only doctor can update booking slot");
        }
        const { start_time, end_time, isBooked } = bookingSlotData;
        const updatedBookingSlot = {
            start_time, end_time, isBooked,
            user: { id: bookingSlotData.user } as DeepPartial<UserEntity>
        }
        await this.bookingSlotRepository.update({ id }, updatedBookingSlot);
        return await this.bookingSlotRepository.findOne({ where: { id } });
    }

    async deleteBookingSlot(id: string): Promise<any> {
        const bookingSlot = await this.bookingSlotRepository.findOne({ where: { id } });
        if(!bookingSlot) {
            return("Booking slot not found");
        }
        await this.bookingSlotRepository.delete({ id });
        return ('Booking slot deleted')
    }
}