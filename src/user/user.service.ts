import { Injectable } from "@nestjs/common";
import { EditUserDto } from "./dto";

@Injectable()
export class UserService {
    constructor() {}

    async editUser(
        userId: number,
        editUserDto: EditUserDto,
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