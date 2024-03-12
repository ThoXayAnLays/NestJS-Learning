import { Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { UserToBookingSlotService } from './services/user-to-booking-slot.service';

@Injectable()
@Processor('bookingQueue')
export class RequestWorker {
    constructor(
        private readonly userToBookingSlotService: UserToBookingSlotService,
    ) { }
    @Process('processQueue')
    async handleRequest(job: Job< {queueId:string} >) {
        const { queueId } = job.data;
        console.log('Processing request', queueId);
        try {
            await this.userToBookingSlotService.processQueue(queueId)
            console.log('Request processed')
        } catch (error) {
            Logger.error(error);
        }
    }
}
