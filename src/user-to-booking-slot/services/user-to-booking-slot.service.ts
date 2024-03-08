import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Like, Repository } from "typeorm";
import { UserToBookingSlotEntity } from "../entity/user-to-booking-slot.ts";
import { FilterUserToBookingSlotDto } from "../dto/filter-user-to-booking-slot.dto.js";
import { UserEntity } from "src/user/entities/users.entity";
import { BookingSlotEntity } from "src/booking-slot/entities/booking-slot.entity.js";
import { CreateUserToBookingSlotDto, UpdateUserToBookingSlotDto } from "../dto/user-to-booking-slot.dto.js";

@Injectable()
export class UserToBookingSlotService {
    constructor(
        @InjectRepository(UserToBookingSlotEntity) private readonly userToBookingSlotRepository: Repository<UserToBookingSlotEntity>
    ) { }

    async getAll(query: FilterUserToBookingSlotDto): Promise<any> {
        const item_per_page = Number(query.item_per_page) || 10;
        const page = Number(query.page) || 1;
        const skip = (page - 1) * item_per_page;
        const search = query.search || '';

        const [res, total] = await this.userToBookingSlotRepository.findAndCount({
            where: [
                { status: Like('%' + search + '%') },
                { user: Like('%' + search + '%') },
                { bookingSlot: Like('%' + search + '%') }
            ],
            take: item_per_page,
            skip: skip,
            select: ['id', 'request_time', 'status', 'user', 'bookingSlot']
        });
        const lastPage = Math.ceil(total / item_per_page);
        const nextPage = page + 1 > lastPage ? null : page + 1;
        const prevPage = page - 1 < 1 ? null : page - 1;

        await new Promise((resolve) => setTimeout(resolve, 1000));

        return {
            data: res,
            total,
            currentPage: page,
            nextPage,
            prevPage,
            lastPage
        }
    }

    async getById(id: string): Promise<UserToBookingSlotEntity> {
        const result = await this.userToBookingSlotRepository.findOne({ where: { id } });
        if (!result) {
            throw new Error('UserToBookingSlot not found');
        }
        return result;
    }

    async create(data: Partial<CreateUserToBookingSlotDto>): Promise<UserToBookingSlotEntity> {
        const { user, bookingSlot} = data;
        const timestamp = new Date().getTime();
        const newUserToBookingSlot = await this.userToBookingSlotRepository.create({
            request_time: new Date(timestamp),
            user: { id: user } as DeepPartial<UserEntity>,
            bookingSlot: { id: bookingSlot } as DeepPartial<BookingSlotEntity>
        }) as UserToBookingSlotEntity;
        await this.userToBookingSlotRepository.save(newUserToBookingSlot);
        return newUserToBookingSlot;
    }

    async update(id: string, data: Partial<UpdateUserToBookingSlotDto>): Promise<UserToBookingSlotEntity> {
        const dataToUpdate = await this.userToBookingSlotRepository.findOne({ where: { id } });
        if (!dataToUpdate) {
            throw new Error('UserToBookingSlot not found');
        }
        const { bookingSlot, status } = data;
        const updatedData = await this.userToBookingSlotRepository.update({ id }, {
            status: status,
            bookingSlot: { id: bookingSlot } as DeepPartial<BookingSlotEntity>
        });
        return await this.userToBookingSlotRepository.findOne({ where: { id } });
    }

    async delete(id: string): Promise<void> {
        const result = await this.userToBookingSlotRepository.findOne({ where: { id } });
        if (!result) {
            throw new Error('UserToBookingSlot not found');
        }
        await this.userToBookingSlotRepository.delete({ id });
    }
}