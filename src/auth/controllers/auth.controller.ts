import { Body, Controller, Post, Req, SetMetadata, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserDto, LoginUserDto } from 'src/user/dto/user.dto';
import { AuthService } from '../services/auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../decorator/public.decorator';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    //@SetMetadata('isPublic', true)
    @ApiResponse({status:201, description:'Register successfully!'})
    @ApiResponse({status:401, description:'Register fail!'})
    @Public()
    async register(@Body() createUserDto: UserDto) {
        return await this.authService.register(createUserDto);
    }

    @Post('login')
    //@SetMetadata('isPublic', true)
    @Public()
    @ApiResponse({status:201, description:'Login successfully!'})
    @ApiResponse({status:401, description:'Login fail!'})
    @UsePipes(ValidationPipe)
    async login(@Body() loginUserDto: LoginUserDto) {
        return await this.authService.login(loginUserDto);
    }

    @Post('refresh')
    //@SetMetadata('isPublic', true)
    @Public()
    @ApiResponse({status:201, description:'Get Refresh Token successfully!'})
    @ApiResponse({status:401, description:'Get Refresh Token fail!'})
    async refresh(@Body() body:any) {
        return await this.authService.refresh(body.refresh_token);
    }

    @Post('logout')
    @Public()
    @ApiResponse({status:200, description:'Logout successfully!'})
    @ApiResponse({status:401, description:'Logout fail!'})
    async logout(@Req() req: any) {
        await this.authService.logout(req.user);
        return {
            statusCode: 200,
        };
    }
}
