import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, Req, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from 'src/guards/Auth.guard';
import { ProfileDto } from './dto/update-profile.dto';
import { dot } from 'node:test/reporters';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Get()
  findOwnProfile(@Req() req: any) {
    try {
      const userId = req.user.userId
      return this.profileService.findProfile(userId)
    } catch (error) {
      throw new HttpException(error.message , error.status??500)
    }
  }

  @Patch()
  update(
    @Req() req : any,
    @Body() updateProfileDto: ProfileDto) {
   try {
    const userId = req.user.userId
    return this.profileService.updateProfile(updateProfileDto, userId)
   } catch (error) {
    throw new HttpException(error.message, error.status??500)
   }
  }

  @Patch('update-avatar')
  @UseInterceptors(FileInterceptor('photo'))
  async updateAvatar(
    @Req() req : any,
    @UploadedFile() file : Express.Multer.File
  ){
    try {
      const userId = req.user.userId
      const img_url = await this.cloudinaryService.uploadOneImage(file)
      if(!userId || !img_url) throw new BadRequestException('error occured with avatar updating')
      return await this.profileService.updateAvatar(userId, <string>img_url)
    } catch (error) {
      throw new HttpException(error.message ,error.status??500)
    }
  }
}
