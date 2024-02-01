import { Repository } from "typeorm";
import { BaseEntity } from "./base.entity";
import { plainToInstance } from "class-transformer";
import { UserDto } from "src/user/dto/user.dto";

export class PostgresBaseService<Entity extends BaseEntity, Dto> {
    constructor(protected readonly repo: Repository<Entity>) {}

    async save(userDto: Dto): Promise<any> {
        const savedUser = await this.repo.save(userDto as any);
        return plainToInstance(UserDto, savedUser, {
            excludeExtraneousValues: true,
        });
    }

    async update(id: string, userDto: UserDto): Promise<{ result: string }> {
        const updatedResult = await this.repo.update(id, userDto as any);
        return {result: 'success'}
    }

    async getUserById(id: string): Promise<any> {
        const foundUser = this.repo.findOne({
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
        const deletedResult = await this.repo.softDelete(id);
        return {result: 'success'}
    }
}