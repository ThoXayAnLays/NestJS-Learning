import { HttpCode, HttpException, HttpStatus, Injectable } from "@nestjs/common";
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
import { QueueService } from "./queue.service";

@Injectable()
export class UserToBookingSlotService {
    constructor(
        @InjectRepository(UserToBookingSlotEntity) private readonly userToBookingSlotRepository: Repository<UserToBookingSlotEntity>,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(BookingSlotEntity) private readonly bookingSlotRepository: Repository<BookingSlotEntity>,
        private readonly queueService: QueueService,
    ) { }

    async getAll(query: FilterUserToBookingSlotDto): Promise<any> {
        const item_per_page = Number(query.item_per_page) || 10;
        const page = Number(query.page) || 1;
        const skip = (page - 1) * item_per_page;
        const search = query.search || '';

        const [res, total] = await this.userToBookingSlotRepository.findAndCount({
            where: [
                { status: Like('%' + search + '%') },
            ],
            take: item_per_page,
            skip: skip,
            select: ['id', 'requestTime', 'status', 'user', 'bookingSlot']
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
            throw new HttpException('User to booking slot not found', HttpStatus.NOT_FOUND);
        }
        return result;
    }

    async create(data: Partial<CreateUserToBookingSlotDto>, userId: string): Promise<any> {
        const timestamp = new Date().getTime();
        if (!data.bookingSlot) {
            throw new HttpException('BookingSlot is required', HttpStatus.BAD_REQUEST);
        }
        const bookingSlot = await this.bookingSlotRepository.findOne({ where: { id: data.bookingSlot } });
        if (!bookingSlot) {
            throw new HttpException('BookingSlot not found', HttpStatus.NOT_FOUND);
        }
        if (bookingSlot.isBooked === true) {
            throw new HttpException('BookingSlot is already booked', HttpStatus.BAD_REQUEST);
        }
        if (!userId) {
            throw new HttpException('User is required', HttpStatus.BAD_REQUEST);
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        const newUserToBookingSlot = this.userToBookingSlotRepository.create({
            requestTime: new Date(timestamp),
            user: { id: userId } as DeepPartial<UserEntity>,
            bookingSlot: { id: data.bookingSlot } as DeepPartial<BookingSlotEntity>
        }) as UserToBookingSlotEntity;
        const savedUserToBookingSlot = await this.userToBookingSlotRepository.save(newUserToBookingSlot);
        const job = await this.queueService.addToQueue(savedUserToBookingSlot);
        if(job !== null){
            throw new HttpException('User to booking slot created', HttpStatus.CREATED);
        }
    }

    // @Cron(CronExpression.EVERY_10_SECONDS, { name: 'Expire Request' })
    // async hanldeScheduledTasks() {
    //     console.log('Running cron job')
    //     const pendingRequests = await this.userToBookingSlotRepository.find({
    //         where: { status: 'Pending' },
    //         take: 100
    //     })
    //     await Promise.all(pendingRequests.map(async (booking) => {
    //         if(this.isExpired(booking)) {
    //             await this.userToBookingSlotRepository.update(booking.id, { status: 'Rejected' });
    //         }
    //     }));
    //     //for (const request of pendingRequests) {
    //     //     if (this.isExpired(request)) {
    //     //         await this.userToBookingSlotRepository.update(request.id, { status: 'Rejected' });
    //     //     }
    //     // }
    //     // 
    // }

    private isExpired(request: any): boolean {
        const currentTime = new Date();
        const requestTime = request.request_time;
        const diff = currentTime.getTime() - requestTime.getTime();
        const diffHours = Math.ceil(diff / (1000 * 60 * 60));
        return diffHours >= 24;
    }

    async rejectRequest(id: string) {
        const dataToUpdate = await this.userToBookingSlotRepository.findOne({ where: { id } });
        if (!dataToUpdate) {
            throw new HttpException('UserToBookingSlot not found', HttpStatus.NOT_FOUND);
        }
        if(dataToUpdate.status === 'Approved') {
            throw new HttpException('UserToBookingSlot is already Approved', HttpStatus.BAD_REQUEST);
        }
        if(dataToUpdate.status === 'Rejected') {
            throw new HttpException('UserToBookingSlot is already Rejected', HttpStatus.BAD_REQUEST);
        }
        await this.userToBookingSlotRepository.update({ id }, { status: 'Rejected' });
        throw new HttpException('UserToBookingSlot rejected', HttpStatus.OK);
    }

    async acceptRequest(id: string) {
        const dataToUpdate = await this.userToBookingSlotRepository.findOne({ where: { id }, relations: ['bookingSlot'] });
        if (!dataToUpdate) {
            throw new HttpException('UserToBookingSlot not found', HttpStatus.NOT_FOUND);
        }
        if(dataToUpdate.status === 'Approved') {
            throw new HttpException('UserToBookingSlot is already Approved', HttpStatus.BAD_REQUEST);
        }
        if(dataToUpdate.status === 'Rejected') {
            throw new HttpException('UserToBookingSlot is already Rejected', HttpStatus.BAD_REQUEST);
        }
        await this.bookingSlotRepository.update({ id: dataToUpdate.bookingSlot.id}, { isBooked: true });
        await this.userToBookingSlotRepository.update({ id }, { status: 'Approved' });
        throw new HttpException('UserToBookingSlot approved', HttpStatus.OK);
    }

    async update(id: string, data: Partial<UpdateUserToBookingSlotDto>): Promise<any> {
        const dataToUpdate = await this.userToBookingSlotRepository.findOne({ where: { id } });
        if (!dataToUpdate) {
            throw new HttpException('UserToBookingSlot not found', HttpStatus.NOT_FOUND);
        }
        const checkBookingSlot = await this.bookingSlotRepository.findOne({ where: { id: data.bookingSlot } });
        if (!checkBookingSlot) {
            throw new HttpException('BookingSlot not found', HttpStatus.NOT_FOUND);
        }
        if (checkBookingSlot.isBooked === true) {
            throw new HttpException('BookingSlot is already booked', HttpStatus.BAD_REQUEST);
        }
        const { bookingSlot, status } = data;
        const updatedData = await this.userToBookingSlotRepository.update({ id }, {
            status: status,
            bookingSlot: { id: bookingSlot } as DeepPartial<BookingSlotEntity>
        });
        if (updatedData.affected === 0) {
            throw new HttpException('UserToBookingSlot not updated', HttpStatus.NOT_FOUND);
        }
        return await this.userToBookingSlotRepository.findOne({ where: { id } });
    }

    async delete(id: string): Promise<any> {
        const result = await this.userToBookingSlotRepository.findOne({ where: { id }, relations: ['bookingSlot'] });
        if (!result) {
            throw new HttpException('UserToBookingSlot not found', HttpStatus.NOT_FOUND);
        }
        const bookingSlot = await this.bookingSlotRepository.findOne({ where: { id: result.bookingSlot.id} });
        if (!bookingSlot) {
            return('BookingSlot not found');
        }
        await this.bookingSlotRepository.update({ id: result.bookingSlot.id }, { isBooked: false });
        await this.userToBookingSlotRepository.delete({ id });
        throw new HttpException('UserToBookingSlot deleted', HttpStatus.OK);
    }
}