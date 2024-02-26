import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "../services/auth.service";
import { UserDto } from "../../../src/user/dto/user.dto";
import { HttpStatus } from "@nestjs/common";

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;

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
            controllers: [AuthController],
            providers: [AuthService],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('register', () => {
        it('should register new user', async () => {
            const createUserDto: UserDto = {
                userName: 'test',
                email: 'test@gmail.com',
                password: '12345'
            };
            //jest.spyOn(authService, 'register').mockResolvedValue(createUserDto);

            const resule = await controller.register(createUserDto);

            expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(mockRes.json).toHaveBeenCalledWith({ data: createUserDto });
        });
    });
});