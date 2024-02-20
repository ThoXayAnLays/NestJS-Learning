import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { LoginUserDto, UserDto } from "../dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entities/users.entity";
import { plainToInstance } from "class-transformer";
import * as bcrypt from 'bcrypt';

import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { Cron, CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        //private readonly eventEmitter: EventEmitter2,
        // private scheduleRegistry: SchedulerRegistry,
        // @InjectQueue('send-mail') 
        // private sendMail: Queue,
    ) {}

    // getHello(): string {
    //     return 'Hello World!';
    // }

    async create(userDto: UserDto) {
        userDto.password = await bcrypt.hash(userDto.password, 10);

        //check exists
        const userExists = await this.userRepository.findOne({where: {email: userDto.email}});
        if(userExists){
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }

        // await this.sendMail.add(
        //     'register',
        //     {
        //         to: userDto.email,
        //         firstName: userDto.firstName,
        //     },
        //     {
        //         removeOnComplete: true,
        //     },
        // );

        return await this.userRepository.create(userDto);
        // return plainToInstance(UserDto, savedUser, {
        //     excludeExtraneousValues: true,
        // });

        // this.eventEmitter.emit(
        //     'user.created', 
        //     new UserCreatedEvent(savedUser.id, savedUser.firstName)
        // );
        // const establishWsTimeout = setTimeout(() => {
        //     this.establishWsTimeout(savedUser.id), 5000;
        // });
        // this.scheduleRegistry.addTimeout(`${savedUser.id}_establish_ws`, establishWsTimeout);
    }

    // private establishWsTimeout(userId: string){
    //     console.log(`Establishing websocket connection for user ${userId}...`);
    // }

    // @Cron(CronExpression.EVERY_10_SECONDS, {name: 'delete_expired_users'})
    // deleteExpiredUsers(){
    //     console.log('Deleting expired users...');
    // }
    
    // @OnEvent('user.created')
    // welcomeNewUser(payload: UserCreatedEvent) {
    //     console.log(`Welcome ${payload.firstName}!`);
    // }

    // @OnEvent('user.created')
    // async sendWelcomeEmail(payload: UserCreatedEvent) {
    //     console.log(`Sending welcome email to ${payload.firstName}...`);
    //     await new Promise<void>((resolve) => setTimeout(() => resolve(), 3000));
    //     console.log('Email sent!');
    // }

    async setTwoFactoAuthSecret(secret, user_id){
        return this.userRepository.update(user_id,{
            twoFactorAuthSecret: secret,
        })
    }

    async turnOnTwoFactorAuth(user_id: string){
        return this.userRepository.update(user_id,{
            isTwoFactorAuthenticationEnabled: true,
        })
    }

    async update(filter, update) {
        if (update.refreshToken) {
            update.refreshToken = await bcrypt.hash(
                this.reverse(update.refreshToken),
                10,
            );
        }
        return await this.userRepository.update(filter, update);
    }

    async findByLogin({ email, password }: LoginUserDto){
        const users = await this.userRepository.findBy({
            email: email,
        });
        if (!users || !users.length) {
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
        }
        const user = users[0];
        const is_equal = bcrypt.compareSync(password, user.password);
        if (!is_equal) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }
        return user;
    }

    async findByEmail(email) {
        return await this.userRepository.findBy({
            email: email,
        });
    }

    async getUserByRefresh(refresh_token, email) {
        const users = await this.findByEmail(email);
        if (!users || !users.length) {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
        const user = users[0];
        const is_equal = await bcrypt.compare(
            this.reverse(refresh_token),
            user.refreshToken,
        );
        if (!is_equal) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }
        return user;
    }

    private reverse(s){
        return s.split('').reverse().join('');
    }
}