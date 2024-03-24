import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './user/user.module';
import { UserEntity } from './user/entities/users.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { GenreModule } from './genre/genre.module';
import { MovieModule } from './movie/movie.module';
import { AuthorModule } from './author/author.module';
import { BookModule } from './book/book.module';
import { ProfileEntity } from './user/entities/profiles.entity';
import { GenreEntity } from './genre/entities/genres.entity';
import { MovieEntity } from './movie/entities/movies.entity';
import { AuthorEntity } from './author/entities/authors.entity';
import { BookEntity } from './book/entities/books.entity';
import { EventGateway } from './websockets/event.gateway';
import { TypesGuard } from './auth/guards/types.guard';
import { AuthGuard } from './auth/guards/auth.guard';
import { MessagesModule } from './messages/messages.module';
import { AuthModule } from './auth/auth.module';
import { GGAuthModule } from './google outh2/ggAuth.module';
import { PassportModule } from '@nestjs/passport';
import { OrderModule } from './microservices/order/order.module';
import { UserToBookingSlotModule } from './user-to-booking-slot/user-to-booking-slot.module';
import { UserToBookingSlotEntity } from './user-to-booking-slot/entity/user-to-booking-slot.entity';
import { BookingSlotEntity } from './booking-slot/entities/booking-slot.entity';
import { BookingSlotModule } from './booking-slot/booking-slot.module';
import { AuthMiddleware } from './auth/auth.middleware';


@Module({
  imports: [
    AuthModule,
    UsersModule,
    GenreModule,
    MovieModule,
    AuthorModule,
    BookModule,
    BookingSlotModule,
    //GGAuthModule,
    OrderModule,
    PassportModule.register({ session: true }),

    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'postgres',
      password: '123',
      database: 'nestjs',
      entities: [UserEntity, BookingSlotEntity, UserToBookingSlotEntity, ProfileEntity, GenreEntity, MovieEntity, AuthorEntity, BookEntity],
      logger: 'advanced-console',
      logging: 'all',
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    // EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
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
          dir: join(__dirname, 'mail/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          }
        }
      }),
      inject: [ConfigService],
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    UserToBookingSlotModule,
    MessagesModule,
  ],
  providers: [
    EventGateway,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: TypesGuard,
    },
  ],
})
export class AppModule {
  //constructor(private dataSoure: DataSource){}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL }); // Apply middleware to all routes
  }
}