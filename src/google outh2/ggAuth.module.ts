import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/users.entity';
import { AuthController } from './ggAuth.controller';
import { AuthService } from './ggAuth.service';
import { GoogleStrategy } from './utils/googleStrategy';
import { SessionSerializer } from './utils/serializer';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [AuthController],
    providers: [
        GoogleStrategy,
        SessionSerializer,
        {
            provide: 'AUTH_SERVICE',
            useClass: AuthService,
        },
    ],
})
export class GGAuthModule { }