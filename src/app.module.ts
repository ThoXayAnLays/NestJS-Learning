import { Module } from '@nestjs/common';
import { ProductsModule } from './modules/products/product.modules';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './user/user.module';
import { UserEntity } from './entities/users.entity';
import { ProductsEntity } from './entities/products.entity';
import { CategoriesEntity } from './entities/categories.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [ProductsModule, AuthModule, PrismaModule, 
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'postgres',
      password: '123',
      database: 'nestjs',
      entities: [UserEntity, ProductsEntity, CategoriesEntity],
      logger: 'advanced-console',
      logging: 'all',
      synchronize: true,
    }),
    UsersModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async(config: ConfigService) => ({
        //transport: config.get('MAIL_TRANSPORT'),
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD')
          }
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}>`
        },
        template: {
          dir: join(__dirname, 'src/templates/email'),  
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          }
        }
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async(config: ConfigService) => ({
        redis: {
          host: 'localhost',
          port: 5434,
          username: 'postgres',
          password: '123',
        }
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard
    }
  ],
})
export class AppModule {
  constructor(private dataSoure: DataSource){}
}