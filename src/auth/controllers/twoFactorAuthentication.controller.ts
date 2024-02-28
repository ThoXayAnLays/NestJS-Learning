import {
    Body,
    Controller,
    HttpCode,
    Post,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { TwoFactorAuthenticationService } from '../services/twoFactorAuth.service';
import { UserService } from '../../user/services/user.service';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '../decorator/public.decorator';

@Controller('2fa')
export class TwoFactorAuthenticationController {
    constructor(
        private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
        private userService: UserService,
        private authService: AuthService,
    ) {}

    @Public()
    @Post('generate')
    @UseGuards(AuthGuard('jwt'))
    async generate(@Res() response: any, @Req() request: any) {
        const { otpAuthUrl } =
            await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
            request.user,
            );
        console.log(otpAuthUrl);
        return this.twoFactorAuthenticationService.pipeQrCodeStream(
            response,
            otpAuthUrl,
        );
    }

    @Public()
    @Post('turn-on')
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    async turnOnTwoFactorAuthentication(@Req() request: any) {
        await this.userService.turnOnTwoFactorAuth(request.user._id);
    }

    @Public()
    @Post('authenticate')
    @UseGuards(AuthGuard('jwt'))
    async authentication(@Req() request: any, @Body('code') code) {
        const isCodeValid =
            await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
            code,
            request.user,
            );
        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code');
        }
        return this.authService.getAccess2FA(request.user);
    }
}