import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./users.entity";
import { IsNotEmpty, IsOptional } from "class-validator";

@Entity('profiles')
export class ProfileEntity{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    @IsNotEmpty()
    firstName: string;

    @Column()
    @IsNotEmpty()
    lastName: string;

    @OneToOne(() => UserEntity, (user: UserEntity) => user.profile)
    @IsOptional()
    user: UserEntity;
}