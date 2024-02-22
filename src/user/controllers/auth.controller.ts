import { Body, Controller, Post, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { UserDto, LoginUserDto } from 'src/user/dto/user.dto';
import { AuthService } from '../services/auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../decorator/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    //@SetMetadata('isPublic', true)
    @Public()
    async register(@Body() createUserDto: UserDto) {
        return await this.authService.register(createUserDto);
    }

    @Post('login')
    //@SetMetadata('isPublic', true)
    @Public()
    @ApiResponse({status:201, description:'Login successfully!'})
    @ApiResponse({status:401, description:'Login fail!'})
    async login(@Body() loginUserDto: LoginUserDto) {
        return await this.authService.login(loginUserDto);
    }

    @Post('refresh')
    //@SetMetadata('isPublic', true)
    @Public()
    async refresh(@Body() body) {
        return await this.authService.refresh(body.refresh_token);
    }

    @Post('logout')
    async logout(@Req() req: any) {
        await this.authService.logout(req.user);
        return {
        statusCode: 200,
        };
    }
}
