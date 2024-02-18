import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProfileEntity } from "src/entities/profiles.entity";
import { Repository } from "typeorm";
import { ProfileDto } from "./dto";

@Injectable()
export class ProfileService{
    constructor(
        @InjectRepository(ProfileEntity) private readonly profileRepository: Repository<ProfileEntity>
    ){}

    async getAll(): Promise<ProfileEntity[]> {
        return await this.profileRepository.find();
    }

    async getById(id: string): Promise<ProfileEntity> {
        return await this.profileRepository.findOne({ where: { id } });
    }

    async createProfile(profileData: ProfileDto): Promise<ProfileEntity> {
        const profile = this.profileRepository.create(profileData);
        return await this.profileRepository.save(profile);
    }

    async updateProfile(id: string, profile: ProfileDto): Promise<ProfileEntity> {
        await this.profileRepository.update(id, profile);
        return await this.profileRepository.findOne({ where: { id }});
    }

    async deleteProfile(id: string): Promise<void> {
        await this.profileRepository.delete(id);
    }
}