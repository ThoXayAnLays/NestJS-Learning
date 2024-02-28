import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/user/entities/users.entity';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';

@Injectable()
export class TwoFactorAuthenticationService {
    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
    ) {}

    async pipeQrCodeStream(stream: Response, otpAuthUrl: string) {
        return toFileStream(stream, otpAuthUrl);
    }

    async generateTwoFactorAuthenticationSecret(user: UserEntity) {
        const secret = authenticator.generateSecret();
        const otpAuthUrl = authenticator.keyuri(
            user.email, 
            this.configService.get('TWO_FACTOR_AUTHENTICATION_NAME'), 
            secret
        );
        await this.userService.setTwoFactoAuthSecret(secret, user.id)
        return {
            secret,
            otpAuthUrl,
        };
    }

    async isTwoFactorAuthenticationCodeValid(verifiedCode, user) {
        return authenticator.verify({
            token: verifiedCode,
            secret: user.twoFactorAuthenticationSecret,
        });
    }
}