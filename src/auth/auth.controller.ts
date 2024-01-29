import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from 'src/auth/dto';
import { Tokens } from './types';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Public, GetCurrentUser, GetCurrentUserId } from 'src/common/decorators';
import { RtGuard } from 'src/common/guards';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Public()
    @Post('local/register')
    @HttpCode(HttpStatus.CREATED)
    registerLocal(@Body() dto: AuthDto): Promise<Tokens>  {
        return this.authService.registerLocal(dto);
    }

    @Public()
    @Post('local/login')
    @HttpCode(HttpStatus.OK)
    loginLocal(@Body() dto: AuthDto): Promise<Tokens>  {
        return this.authService.loginLocal(dto);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@GetCurrentUserId() userId: number): Promise<boolean>{
        return this.authService.logout(userId);
    }

    @Public()
    @UseGuards(RtGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refresh(@GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string): Promise<Tokens>{
        return this.authService.refresh(userId, refreshToken);
    }
}
