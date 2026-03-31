import { BadRequestException, HttpException, Inject, Injectable, Type, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Auth } from './schema/auth.schema';
import { Model, Types } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import {v4 as  uuid} from 'uuid'
import { RefreshToken } from './schema/refreshToken.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Auth.name) private readonly AuthRepo : Model<Auth>,
        @InjectModel(RefreshToken.name) private readonly RefreshTokenRepo : Model<RefreshToken>,
        @Inject(CACHE_MANAGER) private readonly CacheManager:Cache,
        private readonly jwt : JwtService,
    ){}

    async register(dto : RegisterDto){
          if(dto.password!==dto.return_password) throw new BadRequestException('passwords does not match')
          if((await this.AuthRepo.findOne({email : dto.email})))throw new BadRequestException('email already registered')
            const hashed_pass = await bcrypt.hash(dto.password,12)
            const user = await this.AuthRepo.create(
                {
                    email : dto.email,
                    password : hashed_pass
                }
            )
        return {
            status : 'success',
            created : user
        }
    }

    async login(dto: LoginDto) {
        const key = `login_attemps:${dto.email}`;
        const attemps = (await this.CacheManager.get<number>(key)) ?? 0;

        if (attemps >= 5) {
            throw new UnauthorizedException('Too many attemps, try again after 2 minutes');
        }

        const user = await this.AuthRepo.findOne({ email: dto.email });
        const pass_match = user ? await bcrypt.compare(dto.password, user.password) : false;

        if (!user || !pass_match) {
            await this.CacheManager.set(key, attemps + 1, 120000);
            throw new UnauthorizedException('Incorrect email/password');
        }

        await this.CacheManager.del(key);
        return await this.generateTokens(user._id);
    }

    async generateTokens(userId : Types.ObjectId){
        const access_token = this.jwt.sign({userId})
        const refresh_token = uuid()
        await this.storeRefreshToken(access_token, userId)
        return {access_token, refresh_token}
    }

    async storeRefreshToken(token : string , userId : Types.ObjectId){
        return await this.RefreshTokenRepo.updateOne({userId}, {token, $set :{expiryDate : Date.now()+(7*24*60**2*1000)}},{upsert : true})
    }

    async refreshAll(refresh_token : string){
        const token = await this.RefreshTokenRepo.findOne(
            {token : refresh_token, expiryDate : {$gte : new Date()}}
        )
        if(!token) throw new UnauthorizedException()
            return await this.generateTokens(token.userId)
    }
}
