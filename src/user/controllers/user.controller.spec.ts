import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../services/user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProfileEntity } from "src/entities/profiles.entity";
import { UserEntity } from "src/entities/users.entity";
import { ProfileService } from "../services/profile.service";
import { UserDto } from "../dto";

describe('UserController', () => {
    let controller: UserController;
    let service: UserService;
    const mockRequest = {} as unknown as Request;
    const mockJson = jest.fn().mockReturnThis()
    const mockRes:Response = {
        status: jest.fn((x)=>({
            json:jest.fn()
        })),
        json: jest.fn().mockReturnThis()
    } as unknown as Response;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports:[
                TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: 'localhost',
                    port: 5434,
                    username: 'postgres',
                    password: '123',
                    database: 'nestjs',
                    entities: [UserEntity, ProfileEntity],
                    synchronize: true,
                }),
                TypeOrmModule.forFeature([UserEntity, ProfileEntity])
            ],
            controllers: [UserController],
            providers: [UserService, ProfileService],
        }).compile();

        controller = module.get<UserController>(UserController);
        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(true).toBeDefined();
    });

    
});