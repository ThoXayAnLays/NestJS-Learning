import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/users.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';


import { BullModule } from '@nestjs/bull';
import { EmailConsumer } from './consumers/email.consumer';
import { ProfileService } from './services/profile.service';
import { ProfileEntity } from 'src/user/entities/profiles.entity';
import { UserRepository } from './repositories/user.repository';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([UserEntity, ProfileEntity]),
        
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
        BullModule.registerQueue({
            name: 'send-mail',
        }),
    ],
    controllers: [
        UserController,
    ],
    providers: [
        UserService, 
        ProfileService,
        UserRepository,
        EmailConsumer
    ],
    exports: [UserService, ProfileService, UserRepository],
})

export class UsersModule {}