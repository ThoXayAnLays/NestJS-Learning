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
    ScheduleModule.forRoot()
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
