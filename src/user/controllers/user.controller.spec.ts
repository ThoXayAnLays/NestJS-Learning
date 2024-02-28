import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../services/user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProfileEntity } from "../entities/profiles.entity";
import { UserEntity } from "../entities/users.entity";
import { ProfileService } from "../services/profile.service";
import { ProfileDto, UserDto } from "../dto";
import { Repository } from "typeorm";

describe('UserController', () => {
    let controller: UserController;
    let profileService: ProfileService;
    let userService: UserService;
    let profileRepository: Repository<ProfileEntity>;
    let userRepository: Repository<UserEntity>;

    const mockProfileService = {}

    beforeEach(async() => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: ProfileService,
                    useValue: {
                        getByUserId: jest.fn(),
                        getAll: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                        uploadAvatar: jest.fn(),
                    }
                },
                {
                    provide: UserService,
                    useValue: {
                        create: jest.fn(),
                        update: jest.fn(),
                        findByLogin: jest.fn(),
                        findByEmail: jest.fn(),
                    }
                }
            ],
        }).compile();

        controller = module.get<UserController>(UserController);
        profileService = module.get<ProfileService>(ProfileService);
        userService = module.get<UserService>(UserService);
        profileRepository = module.get<Repository<ProfileEntity>>(ProfileEntity);
        userRepository = module.get<Repository<UserEntity>>(UserEntity);
    })

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call profileService.getByUserId', async() => {
        const userId = "7a78b7f7-ac05-4064-aa05-851d36bd4428";
        const req = { user: { id: userId } };
        await controller.getProfile(req);
        expect(profileService.getByUserId).toHaveBeenCalledWith(userId);
    });

    it('should call profileService.createProfile', async() => {
        const userId = "7a78b7f7-ac05-4064-aa05-851d36bd4428";
        const req = { user: { id: userId } };
        const profile: ProfileDto = { 
            firstName: "testName", 
            lastName: "testLastName",
            user: userId
        };
        await controller.createProfile(req, profile);
        expect(profileService.createProfile).toHaveBeenCalledWith(userId, profile);
    });

    it('should call profileService.updateProfile', async() => {
        const userId = "7a78b7f7-ac05-4064-aa05-851d36bd4428";
        const req = { user: { id: userId } };
        const profile: ProfileDto = { 
            firstName: "testName", 
            lastName: "testLastName",
            user: userId
        };
        await controller.updateProfile(req, profile);
        expect(profileService.updateProfile).toHaveBeenCalledWith(userId, profile);
    });

    it('should call profileService.deleteProfile', async() => {
        const userId = "7a78b7f7-ac05-4064-aa05-851d36bd4428";
        const req = { user: { id: userId } };
        await controller.deleteProfile(req);
        expect(profileService.deleteProfile).toHaveBeenCalledWith(userId);
    });
});