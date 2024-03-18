import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Like, Repository } from "typeorm";
import { UserToBookingSlotEntity } from "../entity/user-to-booking-slot.entity";
import { FilterUserToBookingSlotDto } from "../dto/filter-user-to-booking-slot.dto";
import { UserEntity } from "src/user/entities/users.entity";
import { BookingSlotEntity } from "src/booking-slot/entities/booking-slot.entity";
import { CreateUserToBookingSlotDto, UpdateUserToBookingSlotDto } from "../dto/user-to-booking-slot.dto";
import { Job, Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";
import { Cron, CronExpression } from "@nestjs/schedule";

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

    async getById(id: string): Promise<any> {
        const result = await this.userToBookingSlotRepository.findOne({ where: { id } });
        if (!result) {
            return('UserToBookingSlot not found');
        }
        return result;
    }

    async create(data: Partial<CreateUserToBookingSlotDto>, userId: string): Promise<any> {
        const timestamp = new Date().getTime();
        if (!data.bookingSlot) {
            return ('BookingSlotId is required');
        }
        const bookingSlot = await this.bookingSlotRepository.findOne({ where: { id: data.bookingSlot } });
        if (!bookingSlot) {
            return('BookingSlot not found');
        }
        if (bookingSlot.isBooked === true) {
            return('BookingSlot is already booked');
        }
        if (!userId) {
            return('UserId is required');
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            return('User not found');
        }
        const newUserToBookingSlot = await this.userToBookingSlotRepository.create({
            request_time: new Date(timestamp),
            user: { id: userId } as DeepPartial<UserEntity>,
            bookingSlot: { id: data.bookingSlot } as DeepPartial<BookingSlotEntity>
        }) as UserToBookingSlotEntity;
        await this.bookingSlotRepository.update({ id: data.bookingSlot }, { isBooked: true });
        const result = await this.userToBookingSlotRepository.save(newUserToBookingSlot);
        const queueId = newUserToBookingSlot.id;
        console.log('Added to db', queueId)
        // try {
        //     await this.scheduleQueue.add(
        //         'processQueue',
        //         {
        //             queueId: queueId,
        //         },
        //         {
        //             removeOnComplete: true,
        //         }
        //     );
        // } catch (error) {
        //     throw new Error('Failed to add job to queue');
        // }
        return result;
    }

    @Cron(CronExpression.EVERY_10_SECONDS, { name: 'Expire Request' })
    async hanldeScheduledTasks() {
        console.log('Running cron job')
        const pendingRequests = await this.userToBookingSlotRepository.find({ where: { status: 'Pending' } });
        for (const request of pendingRequests) {
            if (this.isExpired(request)) {
                await this.userToBookingSlotRepository.update(request.id, { status: 'Rejected' });
            }
        }
    }

    private isExpired(request: any): boolean {
        const currentTime = new Date();
        const requestTime = request.request_time;
        const diff = currentTime.getTime() - requestTime.getTime();
        const diffHours = Math.ceil(diff / (1000 * 60 * 60));
        return diffHours >= 24;
    }

    async update(id: string, data: Partial<UpdateUserToBookingSlotDto>): Promise<any> {
        const dataToUpdate = await this.userToBookingSlotRepository.findOne({ where: { id } });
        if (!dataToUpdate) {
            return('UserToBookingSlot not found');
        }
        const checkBookingSlot = await this.bookingSlotRepository.findOne({ where: { id: data.bookingSlot } });
        if (!checkBookingSlot) {
            return('BookingSlot not found');
        }
        if(checkBookingSlot.isBooked === true) {
            return('BookingSlot is already booked');
        }
        const { bookingSlot, status } = data;
        const updatedData = await this.userToBookingSlotRepository.update({ id }, {
            status: status,
            bookingSlot: { id: bookingSlot } as DeepPartial<BookingSlotEntity>
        });
        if(updatedData.affected === 0) {
            return('Failed to update UserToBookingSlot');
        }
        return await this.userToBookingSlotRepository.findOne({ where: { id } });
    }

    async delete(id: string): Promise<any> {
        const result = await this.userToBookingSlotRepository.findOne({ where: { id } });
        if (!result) {
            return('UserToBookingSlot not found');
        }
        // const bookingSlot = await this.bookingSlotRepository.findOne({ where: { id: result.bookingSlot.id} });
        // if (!bookingSlot) {
        //     return('BookingSlot not found');
        // }
        // await this.bookingSlotRepository.update({ id: result.bookingSlot.id }, { isBooked: false });
        await this.userToBookingSlotRepository.delete({ id });
        return('UserToBookingSlot deleted');
    }
}