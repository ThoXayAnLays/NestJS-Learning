import { Body, Controller, Delete, Get, Param, UseGuards, Post, Put, Req, BadRequestException, UploadedFile, UseInterceptors, SetMetadata, Query } from "@nestjs/common";
import { UserService } from "../services/user.service";

import { ProfileDto } from "../dto";
import { ProfileEntity } from "src/user/entities/profiles.entity";
import { ProfileService } from "../services/profile.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { storageCongif } from "../../../src/helpers/config";
import { extname } from "path";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { FilterProfileDto } from "../dto/filter-profile.dto";
import { Public } from "../../auth/decorator/public.decorator";
import { Types } from "src/auth/decorator/types.decorator";
import { FilterUserDto } from "../dto/filter-user.dto";
import { UserEntity } from "../entities/users.entity";

@ApiBearerAuth()
@ApiTags('Users')
@Controller('api/users')
export class UserController {
    constructor(private readonly userService: UserService, private readonly profileService: ProfileService) {}

    @Public()
    @Types('Doctor')
    @ApiQuery({ name: 'item_per_page'})
    @ApiQuery({ name: 'page'})
    @ApiQuery({ name: 'search'})
    @Get('getAll')
    async getAllUsers(@Query() query: FilterUserDto): Promise<UserEntity[]>{
        try {
            return await this.userService.getAllUsers(query);
        } catch (error) {
            return error;
        }
    }

    @Public()
    @Get('getCurrentUser/:id')
    async getUserById(@Param('id') id: string): Promise<UserEntity>{
        try {
            console.log(id)
            return await this.userService.getUserById(id);
        } catch (error) {
            return error;
        }
    }

    @Public()
    @Get('profile')
    async getProfile(@Req() req: any) {
        return await this.profileService.getByUserId(req.user);
    }

    @Types('Doctor')
    @ApiQuery({ name: 'page'})
    @ApiQuery({ name: 'item_per_page'})
    @ApiQuery({ name: 'search'})
    //@Public()
    @Get('profile/getall')
    async getAll(@Query() query: FilterProfileDto): Promise<ProfileEntity[]> {
        console.log(query)
        return await this.profileService.getAll(query);
    }

    @Public()
    @Post('profile')
    async createProfile(@Req() req: any, @Body() profile: ProfileDto): Promise<ProfileEntity> {
        return await this.profileService.createProfile(req.user, profile);
    }

    @Public()
    @Put('profile/update')
    async updateProfile(@Req() req: any, @Body() profile: ProfileDto): Promise<ProfileEntity> {
        return await this.profileService.updateProfile(req.user, profile);
    }


    @Delete('profile/delete')
    @Public()
    async deleteProfile(@Req() req: any): Promise<void> {
        return await this.profileService.deleteProfile(req.user);
    }

    @Public()
    @Post('profile/upload-avatar')
    @UseInterceptors(FileInterceptor(
        'avatar',
        {
            storage: storageCongif('avatar'),
            fileFilter: (req, file, cb) => {
                const ext = extname(file.originalname);
                const allowedExtArr = ['.jpg', '.jpeg', '.png'];
                if(!allowedExtArr.includes(ext)){
                    req.fileValidationError = `Wrong extenstion type. Accepted types: ${allowedExtArr.toString()}`;
                    cb(null, false);
                }else{
                    const fileSize = parseInt(req.headers['content-length']);
                    if(fileSize > 1024 * 1024 * 5){
                        req.fileValidationError = 'File size is too big. Max file size is 5MB';
                        cb(null, false);
                    }else{
                        cb(null, true);
                    }
                }
            }
        }
    ))
    async uploadAvatar(@Req() req: any, @UploadedFile() file:Express.Multer.File){
        console.log(file)
        console.log('user data',req.user)

        if(req.fileValidationError){
            throw new BadRequestException(req.fileValidationError)
        }
        if(!file){
            throw new BadRequestException('File is required')
        }
        return await this.profileService.uploadAvatar(req.user, file.destination + '/' + file.filename);
    }
}