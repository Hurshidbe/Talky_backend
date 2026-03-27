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

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Auth.name) private readonly AuthRepo : Model<Auth>,
        @InjectModel(RefreshToken.name) private readonly RefreshTokenRepo : Model<RefreshToken>,
        private readonly jwt : JwtService
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

    async login(dto : LoginDto){
        const user = await this.AuthRepo.findOne({email : dto.email})
        if(!user) throw new UnauthorizedException('incorrect email/password')
            const pass_match = await bcrypt.compare(dto.password,user.password)
        if(!pass_match) throw new UnauthorizedException('incorrect email/password')
            return await this.generateTokens(user._id)
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
