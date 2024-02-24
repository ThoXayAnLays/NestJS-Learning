import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import * as request from 'supertest';

describe('UserController E2E Test', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.
        createTestingModule({
            imports: [
                AppModule
            ]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('should be defined', () => {
        return request(app.getHttpServer())
        .post('/users/create')
        .send({
            userName: 'test',
            email: 'test@gmail.com',
            password: '12345',
        })
        .expect(201);
    });
});