import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { UserDto, LoginUserDto } from '../../user/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/user/entities/users.entity';
import { ExtractJwt } from 'passport-jwt';
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import fromAuthHeaderWithScheme = ExtractJwt.fromAuthHeaderWithScheme;

@Injectable()
export class AuthService{
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}
    
    async register(userDto: UserDto) {
        const user = await this.userService.create(userDto);
        const token = await this._createToken(user);
        await this.userRepository.save({
            email: user.email,
            userName: user.userName,
            password: user.password,
            roles: user.roles,
            refreshToken: token.refreshToken
        });
        return {
            email: user.email,
            ...token
        };
    }

    async login(loginUserDto: LoginUserDto){
        const user = await this.userService.findByLogin(loginUserDto);
        const token = await this._createToken(user);

        return {
            email: user.email,
            ...token,
        }
    }

    async handleVerifyToken(token){
        try{
            const payload = this.jwtService.verify(token);
            return payload['email, roles, id'];
        }catch(e){
            throw new HttpException(
                {
                    key:'',
                    data: {},
                    statusCode: HttpStatus.UNAUTHORIZED,
                },
                HttpStatus.UNAUTHORIZED,
            )
        }
    }

    async validateUser(email){
        const user = await this.userService.findByEmail(email);
        if(!user){
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
        return user;
    }

    async getAccess2FA(user){
        return this._createToken(user, true);
    }

    private async _createToken(
        { email, roles, id },
        refresh = true
    ){
        const accessToken = this.jwtService.sign({
            email, roles, id
        });

        if(refresh){
            const refreshToken = this.jwtService.sign(
                { email, roles, id },
                {
                    secret: process.env.RT_SECRET,
                    expiresIn: process.env.EXPIRESIN_REFRESH,
                    // expiresIn: process.env.RT_EXPIRES_IN,
                }
            );
            await this.userService.update(
                { email: email },
                {
                    refreshToken: refreshToken
                }
            )
            return{
                // expiresIn: process.env.AT_EXPIRES_IN,
                expiresIn: process.env.EXPIRESIN,
                accessToken,
                refreshToken,
                // expiresInRefresh: process.env.RT_EXPIRES_IN,
                expiresInRefresh: process.env.EXPIRESIN_REFRESH,
            }
        } else {
            return{
                // expiresIn: 'process.env.AT_EXPIRES_IN',
                expiresIn: process.env.EXPIRESIN,
                accessToken,
            }
        }
    }

    async refresh(refresh_token){
        try{
            const payload = await this.jwtService.verify(refresh_token, {
                secret: process.env.RT_SECRET,
            });
            const user = await this.userService.getUserByRefresh(
                refresh_token,
                payload.email
            );
            const token = await this._createToken(user, true);
            return{
                email: user.email,
                roles: user.roles,
                id: user.id,
                ...token,
            }
        } catch(e){
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
    }

    async logout(userId: string){
        return this.userService.update(
            { id: userId},
            { refreshToken: null }
        )
    }
}