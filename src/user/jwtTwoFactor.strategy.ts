import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './services/auth.service';

@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(
    Strategy,
    'jwt-two-factor',
) {
    constructor(private readonly authService: AuthService) {
        super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.AT_SECRET,
        ignoreExpiration: true,
        });
    }

    async validate({ email, isSecondFactorAuthenticated }) {
        const users = await this.authService.validateUser(email);

        if (!users || users.length === 0) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }

        const user = users[0];
        if (user.isTwoFactorAuthenticationEnabled && !isSecondFactorAuthenticated) {
        throw new HttpException('Permission denied', HttpStatus.FORBIDDEN);
        }

        return user;
    }
}
