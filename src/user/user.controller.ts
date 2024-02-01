import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UserDto } from "./dto";
import { UserService } from "./user.service";
import { Public } from "src/common/decorators";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // @Public()
    @Post()
    createUser(@Body() user: UserDto): Promise<UserDto> {
        return this.userService.save(user);
    }

    @Public()
    @Put('/:id')
    updateUserById(@Param('id') id: string, @Body() user: UserDto): Promise<{result: string}> {
        return this.userService.update(id, user);
    }

    @Public()
    @Get('/:id')
    getUserById(@Param('id') id: string){
        return this.userService.getUserById(id);
    }

    @Public()
    @Delete('/:id')
    deleteUserById(@Param('id') id: string) {
        return this.userService.deleteUserById(id);
    }
}