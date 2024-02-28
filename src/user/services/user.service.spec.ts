import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { UserEntity } from "src/user/entities/users.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { MailerService } from "@nestjs-modules/mailer";


describe('UserService', () => {
    let service: UserService;
    let mailerService: MailerService;
    let userRepository: Repository<UserEntity>;

    const USER_REPOSITORY_TOKEN = getRepositoryToken(UserEntity);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: USER_REPOSITORY_TOKEN,
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        find: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    }
                },
                {
                    provide: MailerService,
                    useValue: {
                        sendMail: jest.fn()
                    }
                }
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        mailerService = module.get<MailerService>(MailerService);
        userRepository = module.get<Repository<UserEntity>>(USER_REPOSITORY_TOKEN);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('userRepository should be defined', () => {
        expect(userRepository).toBeDefined();
    });
});