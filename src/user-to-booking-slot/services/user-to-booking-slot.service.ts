import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Like, Repository } from "typeorm";
import { UserToBookingSlotEntity } from "../entity/user-to-booking-slot.entity";
import { FilterUserToBookingSlotDto } from "../dto/filter-user-to-booking-slot.dto";
import { UserEntity } from "src/user/entities/users.entity";
import { BookingSlotEntity } from "src/booking-slot/entities/booking-slot.entity";
import { CreateUserToBookingSlotDto, UpdateUserToBookingSlotDto } from "../dto/user-to-booking-slot.dto";
import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";

@Injectable()
export class UserToBookingSlotService {
    constructor(
        @InjectRepository(UserToBookingSlotEntity) private readonly userToBookingSlotRepository: Repository<UserToBookingSlotEntity>,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(BookingSlotEntity) private readonly bookingSlotRepository: Repository<BookingSlotEntity>,
        @InjectQueue('bookingQueue') private scheduleQueue: Queue,
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
        const timestamp = new Date().getTime();
        if (!data.bookingSlot) {
            throw new Error('BookingSlotId is required');
        }
        const bookingSlot = await this.bookingSlotRepository.findOne({ where: { id: data.bookingSlot } });
        if (!bookingSlot) {
            throw new Error('BookingSlot not found');
        }
        if (!data.user) {
            throw new Error('UserId is required');
        }
        const user = await this.userRepository.findOne({ where: { id: data.user } });
        if (!user) {
            throw new Error('User not found');
        }
        if (user.types !== 'Patient') {
            throw new Error('Only Patient can book slot');
        } else {
            const newUserToBookingSlot = await this.userToBookingSlotRepository.create({
                request_time: new Date(timestamp),
                user: { id: data.user } as DeepPartial<UserEntity>,
                bookingSlot: { id: data.bookingSlot } as DeepPartial<BookingSlotEntity>
            }) as UserToBookingSlotEntity;
            const result = await this.userToBookingSlotRepository.save(newUserToBookingSlot);
            const queueId = newUserToBookingSlot.id;
            console.log('Added to db',queueId)
            try {
                await this.scheduleQueue.add(
                    'processQueue',
                    {
                        queueId,
                    },
                    {
                        delay: 60 *1000,
                        removeOnComplete: true,
                    }
                );
            } catch (error) {
                throw new Error('Failed to add job to queue');
            }
            return result;
        }
    }

    async processQueue(id: string) {
        const data = await this.userToBookingSlotRepository.findOne({ where: { id } });
        if (!data) {
            throw new Error('UserToBookingSlot not found');
        } else {
            if (data.status === 'Pending') {
                // const currentTime = new Date();
                // const requestTime = data.request_time;
                // const diff = currentTime.getTime() - requestTime.getTime();
                // if(diff >=  60 * 1000){
                //     await this.userToBookingSlotRepository.update(id,{status: 'Rejected'}); 
                // }
                await this.userToBookingSlotRepository.update(id, { status: 'Rejected' });
            }
        }
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