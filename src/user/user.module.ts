import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/users.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';


import { BullModule } from '@nestjs/bull';
import { EmailConsumer } from './consumers/email.consumer';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { TwoFactorAuthenticationService } from './services/twoFactorAuth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtTwoFactorStrategy } from './jwtTwoFactor.strategy';
import { TwoFactorAuthenticationController } from './controllers/twoFactorAuthentication.controller';

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
        // BullModule.registerQueue({
        //     name: 'send-mail',
        // }),
    ],
    controllers: [
        UserController,
        AuthController,
        TwoFactorAuthenticationController,
    ],
    providers: [
        UserService, 
        AuthService,
        JwtStrategy,
        TwoFactorAuthenticationService,
        JwtTwoFactorStrategy,
        //EmailConsumer
    ],
    exports: [UserService, AuthService],
})

export class UsersModule {}