import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BookingSlotEntity } from "src/booking-slot/entities/booking-slot.entity";
import { UserEntity } from "src/user/entities/users.entity";

@Entity('user-to-booking-slot')
export class UserToBookingSlotEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    request_time: Date;

    @Column({type: 'enum', enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending'})
    status: string;

    @ManyToOne(() => UserEntity, user => user.userToBookingSot)
    user: UserEntity;

    @ManyToOne(() => BookingSlotEntity, bookingSlot => bookingSlot.userToBookingSlot)
    bookingSlot: BookingSlotEntity;
}