import { Module } from '@nestjs/common';
import { ProductsModule } from './modules/products/product.modules';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './user/user.module';
import { UserEntity } from './entities/users.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { MailerModule} from '@nestjs-modules/mailer';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { GenreModule } from './genre/genre.module';
import { MovieModule } from './movie/movie.module';
import { AuthorModule } from './author/author.module';
import { BookModule } from './book/book.module';
import { ProfileEntity } from './entities/profiles.entity';
import { GenreEntity } from './entities/genres.entity';
import { MovieEntity } from './entities/movies.entity';
import { AuthorEntity } from './entities/authors.entity';
import { BookEntity } from './entities/books.entity';
import { EventGateway } from './websockets/event.gateway';
import { RolesGuard } from './user/roles.guard';
import { AuthGuard } from './user/auth.guard';
import { MessagesModule } from './messages/messages.module';


@Module({
  imports: [
    ProductsModule, 
    UsersModule,
    GenreModule,
    MovieModule,
    AuthorModule,
    BookModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'postgres',
      password: '123',
      database: 'nestjs',
      entities: [UserEntity, ProfileEntity, GenreEntity, MovieEntity, AuthorEntity, BookEntity/*ProductsEntity, CategoriesEntity*/],
      logger: 'advanced-console',
      logging: 'all',
      synchronize: true,
    }),
    // EventEmitterModule.forRoot(),
    // ScheduleModule.forRoot(),
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
          dir: join(__dirname, 'mail/templates'),  
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
          port: 5003,
          
        }
      }),
      inject: [ConfigService],
    }),
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
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  //constructor(private dataSoure: DataSource){}
}