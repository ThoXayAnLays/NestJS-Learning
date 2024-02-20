import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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

    @Column({ nullable: true, default: null })
    avatar: string;

    @Column({ name: 'user_id' })
    userId: string;

    @OneToOne(() => UserEntity, (user: UserEntity) => user.profile)
    @IsOptional()
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;
}