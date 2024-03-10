import { IsOptional, IsPhoneNumber } from "class-validator";
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany} from "typeorm";
import { ProfileEntity } from "./profiles.entity";
import { BookingSlotEntity } from "src/booking-slot/entities/booking-slot.entity";
import { UserToBookingSlotEntity } from "src/user-to-booking-slot/entity/user-to-booking-slot.entity";

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

    @Column({type: 'enum', enum: ['Patient', 'Doctor'], default: 'Patient'})
    types: string;

    @OneToMany(() => BookingSlotEntity, bookingSlot => bookingSlot.user)
    bookingSlots: BookingSlotEntity[];

    @OneToMany(() => UserToBookingSlotEntity, userToBookingSlot => userToBookingSlot.user)
    userToBookingSot: UserToBookingSlotEntity[];

    @OneToOne(() => ProfileEntity, (profile: ProfileEntity) => profile.user)
    @IsOptional()
    profile: ProfileEntity;
}