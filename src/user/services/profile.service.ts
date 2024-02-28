import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProfileEntity } from "../entities/profiles.entity";
import { Like, Repository, UpdateResult } from "typeorm";
import { ProfileDto } from "../dto";
import { UserEntity } from "src/user/entities/users.entity";
import { FilterProfileDto } from "../dto/filter-profile.dto";

@Injectable()
export class ProfileService{
    constructor(
        @InjectRepository(ProfileEntity) 
        private readonly profileRepository: Repository<ProfileEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ){}

    async getAll(query: FilterProfileDto): Promise<any> {
        const item_per_page = Number(query.item_per_page) || 10;
        const page = Number(query.page) || 1;
        const skip = (page - 1) * item_per_page;
        const search = query.search || '';

        const [res, total] = await this.profileRepository.findAndCount({
            where: [
                { firstName: Like('%' + search + '%') },
                { lastName: Like('%' + search + '%') }
            ],
            take: item_per_page,
            skip: skip,
            select: ['id', 'firstName', 'lastName', 'avatar', 'userId']
        });
        const lastPage = Math.ceil(total / item_per_page);
        const nextPage = page + 1 > lastPage ? null : page + 1;
        const prevPage = page - 1 < 1 ? null : page - 1;

        await new Promise((resolve) => setTimeout(resolve, 1000));

        return{
            data: res,
            total,
            currentPage: page,
            nextPage,
            prevPage,
            lastPage
        }
    }

    async getByUserId(userId: string): Promise<ProfileEntity> {
        const profile = await this.profileRepository.findOne({ where: { user: { id: userId } } });
        if(!profile) throw new Error('Profile not found');
        return profile;
    }

    async createProfile(user_id: string, profileData: ProfileDto): Promise<ProfileEntity> {
        const userData = await this.userRepository.findOne({ where: { id: user_id } });
        if (!userData) throw new Error('User not found');
        const profile = new ProfileEntity();
        profile.firstName = profileData.firstName;
        profile.lastName = profileData.lastName;
        profile.user = userData;
        return this.profileRepository.save(profile);
    }

    async updateProfile(userId: string, profileData: ProfileDto): Promise<ProfileEntity> {
        const profile = await this.profileRepository.findOne({ where: { user: { id: userId } } });
        if(!profile) throw new Error('Profile not found');
        
        const { firstName, lastName } = profileData;
        const updatedProfileData = {
            firstName,
            lastName,
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