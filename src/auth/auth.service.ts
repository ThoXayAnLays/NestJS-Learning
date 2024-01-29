import { Injectable, ForbiddenException } from '@nestjs/common';
import { AuthDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    hashData(data: string){
        return bcrypt.hash(data, 10);
    }

    async registerLocal(dto: AuthDto): Promise<Tokens> {
        const hash = await this.hashData(dto.password);
        const newUser =  await this.prisma.user.create({
            data: {
                email: dto.email,
                hash
            }
        });
        const tokens = await this.getTokens(newUser.id, newUser.email);
        await this.updateRtHash(newUser.id, tokens.refresh_token);
        return tokens;
    }

    async loginLocal(dto: AuthDto){
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });

        if(!user){
            throw new ForbiddenException('Access denied');
        }

        const passwordMathces = await bcrypt.compare(dto.password, user.hash);
        if(!passwordMathces){
            throw new ForbiddenException('Access denied');
        }

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refresh_token);
        return tokens;
    }

    async logout(userId: number): Promise<boolean>{
        await this.prisma.user.updateMany({
            where: {
                id: userId,
                hashRt: {
                    not: null,
                },
            },
            data: {
                hashRt: null,
            },
        });
        return true;
    }

    async refresh(userId: number, rt: string): Promise<Tokens>{
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if(!user || !user.hashRt) throw new ForbiddenException('Access denied');
        const rtMatches = await bcrypt.compare(rt, user.hashRt);
        if(!rtMatches) throw new ForbiddenException('Access denied');

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refresh_token);
        return tokens;
    }

    async getTokens(userId: number, email: string): Promise<Tokens>{
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                email: email,
            },{
                secret: process.env.AT_SECRET,
                expiresIn: 60 * 15,
            }),
            this.jwtService.signAsync({
                sub: userId,
                email: email,
            },{
                secret: process.env.RT_SECRET,
                expiresIn: 60 * 60 * 24 * 7,
            }),
        ]);
        return{
            access_token: at,
            refresh_token: rt,
        }
    }

    async updateRtHash(userId: number, rt: string): Promise<void>{
        const hash = await this.hashData(rt);
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                hashRt: hash,
            }
        });
    }
}