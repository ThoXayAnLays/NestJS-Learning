import { Entity, Column, PrimaryGeneratedColumn} from "typeorm";
import { Role } from "src/constant/enum";
import { BaseEntity } from "src/common/postgres/base.entity";

@Entity('users')
export class UserEntity extends BaseEntity{
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    public roles: Role[];
}