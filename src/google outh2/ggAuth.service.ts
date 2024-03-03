import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/users.entity';
import { UserDetails } from './utils/types';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    ) { }

    async validateUser(details: UserDetails) {
        console.log('AuthService');
        console.log(details);
        const user = await this.userRepository.findOneBy({ email: details.email });
        console.log(user);
        if (user) return user;
        console.log('User not found. Creating...');
        const newUser = this.userRepository.create(details);
        return this.userRepository.save(newUser);
    }

    async findUser(id: string) {
        const user = await this.userRepository.findOneBy({ id });
        return user;
    }
}