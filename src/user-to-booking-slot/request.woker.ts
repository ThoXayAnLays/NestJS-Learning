import { OnQueueActive, OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { UserToBookingSlotService } from './services/user-to-booking-slot.service';
import { DeepPartial, Repository } from 'typeorm';
import { UserToBookingSlotEntity } from './entity/user-to-booking-slot.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/users.entity';
import { BookingSlotEntity } from 'src/booking-slot/entities/booking-slot.entity';

@Processor('bookingQueue')
export class RequestWorker {
    constructor(
        @InjectRepository(UserToBookingSlotEntity) private readonly userToBookingSlotRepository: Repository<UserToBookingSlotEntity>,
        private readonly userToBookingSlotService: UserToBookingSlotService,
    ) { }

    private readonly logger = new Logger(RequestWorker.name);

    @Process('processQueue')
    async handleRequest(job: Job<any>) {
        console.log('Job data:', job.data);
        const userToBookingSlotData = job.data;
        const currentTime = new Date().getTime();
        const requestTime = new Date(userToBookingSlotData.requestTime).getTime();
        if (currentTime - requestTime >= 24 * 60 * 60 * 1000) {
            await this.userToBookingSlotService.rejectRequest(userToBookingSlotData.id)
        }
        console.log(`Processed job ${job.id} of type ${job.name} with data ${userToBookingSlotData.id}`);
    }

    @OnQueueActive()
    onActive(job: Job) {
        console.log(`Processing job ${job.id} of type ${job.name} `);
    }

    @OnQueueCompleted()
    onCompleted(job: Job) {
        console.log(`Completed job ${job.id} of type ${job.name}. `);
    }
}
