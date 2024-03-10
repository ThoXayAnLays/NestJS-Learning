import { Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { UserToBookingSlotService } from './services/user-to-booking-slot.service';

@Injectable()
@Processor('userToBookingSlotQueue')
export class RequestWorker {
    constructor(private readonly userToBookingSlotSerivce: UserToBookingSlotService) { }
    @Process('expireUserToBookingSlot')
    async handleRequest(job: Job) {
        const id = job.data.id;
        try {
            await this.userToBookingSlotSerivce.processQueue(id);
        } catch (error) {
            Logger.error(`Failed to expire UserToBookingSlot with id ${id}`, error.stack);
        }
    }
}
