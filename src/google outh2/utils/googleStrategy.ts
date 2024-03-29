import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '../ggAuth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject('AUTH_SERVICE') private readonly authService: AuthService,
    ) {
        super({
            // clientID: process.env.GOOGLE_CLIENT_ID,
            // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            clientID: '244352599075-5a5rfmgamhen81cpblltha13bkn0o3qd.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: 'http://localhost:3000/api/ggauth/google/redirect',
            scope: ['profile', 'email'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile) {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
        const user = await this.authService.validateUser({
            email: profile.emails[0].value,
            displayName: profile.displayName,
        });
        console.log('Validate');
        console.log(user);
        return user || null;
    }
}