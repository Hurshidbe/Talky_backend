import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, Req } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from 'src/guards/Auth.guard';
import { ProfileDto } from './dto/update-profile.dto';
import { dot } from 'node:test/reporters';

@UseGuards(AuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

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
}
