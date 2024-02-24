import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { UserEntity } from "src/entities/users.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';


describe('UserService', () => {
    let service: UserService;
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
                }
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        userRepository = module.get<Repository<UserEntity>>(USER_REPOSITORY_TOKEN);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('userRepository should be defined', () => {
        expect(userRepository).toBeDefined();
    });
});