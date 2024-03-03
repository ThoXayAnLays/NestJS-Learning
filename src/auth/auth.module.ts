import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { TwoFactorAuthenticationController } from './controllers/twoFactorAuthentication.controller';
import { AuthService } from './services/auth.service';
import { JwtTwoFactorStrategy } from './strategies/jwtTwoFactor.strategy';
import { TwoFactorAuthenticationService } from './services/twoFactorAuth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from 'src/user/user.module';
import { UserEntity } from 'src/user/entities/users.entity';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([UserEntity]),
        PassportModule.register({
            defaultStrategy: 'jwt',
            property: 'user',
            session: false,
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('AT_SECRET'),
                signOptions: {
                expiresIn: configService.get('EXPIRESIN'),
                },
            }),
            inject: [ConfigService],
        }),
        UsersModule
    ],
    controllers: [
        AuthController,
        TwoFactorAuthenticationController,
    ],
    providers: [
        AuthService,
        JwtStrategy,
        TwoFactorAuthenticationService,
        JwtTwoFactorStrategy,
    ],
    exports: [AuthService, JwtModule],
})

export class AuthModule {}