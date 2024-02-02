import { Injectable } from "@nestjs/common";
import { UserDto } from "./dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entities/users.entity";
import { plainToInstance } from "class-transformer";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { UserCreatedEvent } from "src/events/user.event";
import { Cron, CronExpression, SchedulerRegistry } from "@nestjs/schedule";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private readonly eventEmitter: EventEmitter2,
        private scheduleRegistry: SchedulerRegistry,
    ) {}

    getHello(): string {
        return 'Hello World!';
    }

    async save(userDto: UserDto): Promise<UserDto> {
        const savedUser = await this.userRepository.save(userDto);
        this.eventEmitter.emit(
            'user.created', 
            new UserCreatedEvent(savedUser.id, savedUser.fullName)
        );
        const establishWsTimeout = setTimeout(() => {
            this.establishWsTimeout(savedUser.id), 5000;
        });
        this.scheduleRegistry.addTimeout(`${savedUser.id}_establish_ws`, establishWsTimeout);
        return plainToInstance(UserDto, savedUser, {
            excludeExtraneousValues: true,
        });
    }

    private establishWsTimeout(userId: string){
        console.log(`Establishing websocket connection for user ${userId}...`);
    }

    @Cron(CronExpression.EVERY_10_SECONDS, {name: 'delete_expired_users'})
    deleteExpiredUsers(){
        console.log('Deleting expired users...');
    }
    
    @OnEvent('user.created')
    welcomeNewUser(payload: UserCreatedEvent) {
        console.log(`Welcome ${payload.fullName}!`);
    }

    @OnEvent('user.created')
    async sendWelcomeEmail(payload: UserCreatedEvent) {
        console.log(`Sending welcome email to ${payload.fullName}...`);
        await new Promise<void>((resolve) => setTimeout(() => resolve(), 3000));
        console.log('Email sent!');
    }

    async update(id: string, userDto: UserDto): Promise<{ result: string }> {
        const updatedResult = await this.userRepository.update(id, userDto);
        return {result: 'success'}
    }

    async getUserById(id: string): Promise<UserDto> {
        const foundUser = this.userRepository.findOne({
            where: {
                id: id as any,
            },
        });
        if(foundUser === null){
            //
        }
        return plainToInstance(UserDto, foundUser, {
            excludeExtraneousValues: true,
        });
    }

    async deleteUserById(id: string): Promise<{ result: string }> {
        const deletedResult = await this.userRepository.softDelete(id);
        return {result: 'success'}
    }

    async editUser(
        userId: number,
        editUserDto: UserDto,
    ) {
        // const user = await this.prisma.user.update({
        //     where: { id: userId },
        //     data: {
        //         ...editUserDto,
        //     },
        // })
        // delete user.hash;
        // return user;
    }
}