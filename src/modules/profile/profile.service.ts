import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Auth } from '../auth/schema/auth.schema';
import { ProfileDto } from './dto/update-profile.dto';
import { after } from 'node:test';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Auth.name) private readonly authRepo : Model<Auth>
  ){}

  async findProfile(userId : Types.ObjectId){
    const user = await this.authRepo.findById(userId).select('-password')
    if(!user) throw new UnauthorizedException('karochchi hatolik, user topilmadi')
      return user
  }

  async updateProfile(dto : ProfileDto, userId : Types.ObjectId){
    const user = await this.authRepo.findById(userId).select('-password')
    if(!user) throw new UnauthorizedException('karochchi hatolik, user topilmadi')
      return await this.authRepo.findByIdAndUpdate(userId, {...dto}, {returnDocument: 'after'})
  }

  async updateAvatar(userId : string, img_url : string){
      return await this.authRepo.findByIdAndUpdate(userId, {avatar : img_url}, {returnDocument : 'after'}).select('-password')
  }
}
