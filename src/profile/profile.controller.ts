import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ProfileEntity } from "src/entities/profiles.entity";
import { ProfileDto } from "./dto";
import { ProfileService } from "./profile.service";

@Controller('profiles')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Get()
    async getAll(): Promise<ProfileEntity[]> {
        return await this.profileService.getAll();
    }

    @Get(':id')
    async getProfile(@Param('id') id: string): Promise<ProfileEntity> {
        return await this.profileService.getById(id);
    }

    @UseGuards(AuthGuard())
    @Post()
    async createProfile(@Body() profile: ProfileDto): Promise<ProfileEntity> {
        return await this.profileService.createProfile(profile);
    }

    @UseGuards(AuthGuard())
    @Put(':id')
    async updateProfile(@Param('id') id: string, @Body() profile: ProfileDto): Promise<ProfileEntity> {
        return await this.profileService.updateProfile(id, profile);
    }

    @UseGuards(AuthGuard())
    @Delete(':id')
    async deleteProfile(@Param('id') id: string): Promise<void> {
        return await this.profileService.deleteProfile(id);
    }
}