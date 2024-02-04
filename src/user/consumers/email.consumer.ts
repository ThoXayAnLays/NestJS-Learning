import { MailerService } from "@nestjs-modules/mailer";
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";

@Processor('sendMail')
export class EmailConsumer {
    constructor(private mailService: MailerService) {}

    @Process('register-email')
    async registerEmail(job: Job<unknown>) {
        console.log('Sending mail to', job.data);
        const time1 = new Date();
        await this.mailService.sendMail({
            to: job.data['to'],
            subject: 'Welcome to NestJS',
            template: './welcome', 
            context: {
                name: job.data['firstName'],
            }
        });
        const time2 = new Date();
        console.log('Send Success: ', time2.getTime() - time1.getTime(), 'ms');
    }
}