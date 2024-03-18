import { Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { UserToBookingSlotService } from './services/user-to-booking-slot.service';
import { DeepPartial, Repository } from 'typeorm';
import { UserToBookingSlotEntity } from './entity/user-to-booking-slot.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/users.entity';
import { BookingSlotEntity } from 'src/booking-slot/entities/booking-slot.entity';

@Injectable()
@Processor('bookingQueue')
export class RequestWorker {
    constructor(
        @InjectRepository(UserToBookingSlotEntity) private readonly userToBookingSlotRepository: Repository<UserToBookingSlotEntity>,
        private readonly userToBookingSlotService: UserToBookingSlotService,
    ) { }
    @Process('processQueue')
    async handleRequest(job: Job<any>) {
        const {bookingSlot, userId}= job.data;
        console.log('Processing request');
        try {
            
            console.log('Request processed')
        } catch (error) {
            console.error('Error processing booking:', error);
            throw error;
        }
    }
}
