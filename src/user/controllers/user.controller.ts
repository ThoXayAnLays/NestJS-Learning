import { Body, Controller, Delete, Get, Param, UseGuards, Post, Put, Req } from "@nestjs/common";
import { UserDto } from "../dto";
import { AuthGuard } from '@nestjs/passport';
import { UserService } from "../services/user.service";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(AuthGuard('jwt-two-factor'))
    @Get('profile')
    async getProfile(@Req() req: any) {
        return req.user;
    }

    @Delete('/:id')
    deleteUserById(@Param('id') id: string) {
        return this.userService.deleteUserById(id);
    }
}