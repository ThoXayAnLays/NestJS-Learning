import { IsOptional } from "class-validator";
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn} from "typeorm";

@Entity('users')
export class UserEntity{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

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
}