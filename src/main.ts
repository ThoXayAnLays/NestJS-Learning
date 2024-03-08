declare const module: any;

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  app.use(session({
    secret: 'asdfqfqfqwsaf12312fasffqwfwqqfwqf',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000,
    },
  }))
  app.use(passport.initialize());
  app.use(passport.session());

  const config = new DocumentBuilder()
  .setTitle('NestJS API')
  .setDescription('The NestJS List API description')
  .setVersion('1.0')
  .addTag('Auth')
  .addTag('Users')
  .addTag('BookingSlots')
  .addTag('UserToBookingSlots')
  .addTag('Authors')
  .addTag('Books')
  .addTag('Genres')
  .addTag('Movies')
  .addBasicAuth()
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
