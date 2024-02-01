import { Injectable } from "@nestjs/common";
import { UserDto } from "./dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entities/users.entity";
import { plainToInstance } from "class-transformer";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    ) {}

    async save(userDto: UserDto): Promise<UserDto> {
        const savedUser = await this.userRepository.save(userDto);
        return plainToInstance(UserDto, savedUser, {
            excludeExtraneousValues: true,
        });
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