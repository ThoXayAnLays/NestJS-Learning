import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";

@Injectable()
export class QueueService {
    constructor(
        @InjectQueue('bookingQueue') private bookingQueue: Queue,
    ){}

    async addToQueue(data: any) {
        await this.bookingQueue.add('processQueue', data, { removeOnComplete: true });
    }
}