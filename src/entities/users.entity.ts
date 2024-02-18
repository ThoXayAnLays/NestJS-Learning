import { IsOptional } from "class-validator";
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn} from "typeorm";
import { ProfileEntity } from "./profiles.entity";

@Entity('users')
export class UserEntity{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    userName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    @IsOptional()
    refreshToken: string;

    @Column()
    @IsOptional()
    twoFactorAuthSecret: string;

    @Column()
    @IsOptional()
    isTwoFactorAuthenticationEnabled: boolean;
    default: false;

    @OneToOne(() => ProfileEntity, (profile: ProfileEntity) => profile.user)
    @IsOptional()
    profile: ProfileEntity;
}