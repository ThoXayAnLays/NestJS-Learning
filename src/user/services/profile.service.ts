import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProfileEntity } from "src/entities/profiles.entity";
import { Repository, UpdateResult } from "typeorm";
import { ProfileDto } from "../dto";
import { UserEntity } from "src/entities/users.entity";

@Injectable()
export class ProfileService{
    constructor(
        @InjectRepository(ProfileEntity) 
        private readonly profileRepository: Repository<ProfileEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ){}

    async getAll(): Promise<ProfileEntity[]> {
        return await this.profileRepository.find();
    }

    async getByUserId(userId: string): Promise<ProfileEntity> {
        const profile = await this.profileRepository.findOne({ where: { user: { id: userId } } });
        if(!profile) throw new Error('Profile not found');
        return profile;
    }

    async createProfile(userId: string, profileData: ProfileDto): Promise<ProfileEntity> {
        const userData = await this.userRepository.findOne({ where: { id: userId } });
        if(!userData) throw new Error('User not found');
        const profile = new ProfileEntity();
        profile.firstName = profileData.firstName;
        profile.lastName = profileData.lastName;
        profile.userId = userId;
        return this.profileRepository.save(profile);
    }

    async updateProfile(userId: string, profileData: ProfileDto): Promise<ProfileEntity> {
        const profile = await this.profileRepository.findOne({ where: { user: { id: userId } } });
        if(!profile) throw new Error('Profile not found');
        
        const { firstName, lastName, user } = profileData;
        const updatedProfileData = {
            firstName,
            lastName,
            user: { id: user }
        };
        await this.profileRepository.update(profile.id, updatedProfileData);
        return await this.profileRepository.findOne({ where: { id: profile.id } });
    }

    async uploadAvatar(userId: string, avatar: string): Promise<UpdateResult> {
        const profile = await this.profileRepository.findOne({ where: { user: { id: userId } } });
        if(!profile) throw new Error('Profile not found');
        return await this.profileRepository.update(profile.id, { avatar });
    }

    async deleteProfile(id: string): Promise<void> {
        const profile = await this.profileRepository.findOne({ where: { id } });
        if(!profile) throw new Error('Profile not found');
        await this.profileRepository.delete(id);
    }
}