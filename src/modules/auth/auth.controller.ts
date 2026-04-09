import { BadRequestException, Body, Controller, Get, HttpException, Logger, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { refreshTwoTokents, RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { Profile } from 'passport';
import { ChangePasswordDto, SetPasswordDto } from './dto/setAndChangePassword.dto';
import { AuthGuard } from 'src/guards/Auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body()dto : RegisterDto){
   try {
     return await this.authService.register(dto)
   } catch (error) {
    throw new HttpException(error.message , error.status??500)
   }
  }

  @Post('login')
  async login(
    @Body() dto : LoginDto,
  ){
    try {
      return await this.authService.loginWithEmail(dto)
    } catch (error) {
      throw new HttpException(error.message , error.status??500)
    }
  }

  @Get('google')
  @UseGuards(PassportAuthGuard('google'))
  async googleLogin(){}

  @Get('google/callback')
  @UseGuards(PassportAuthGuard('google'))
  async callback(@Req() req : Request){
    try {
    const data = req.user as Profile
    return await this.authService.registerOrLoginWithGoogle(data)
    } catch (error) {
      throw new HttpException(error.message , error.status??500)
    }
  }

  @Get('verify/:id')  
  async verifyEmail(
    @Param('id') id : string
  ){
    try {
      return await this.authService.verifyEmail(id)
    } catch (error) {
      throw new HttpException(error.message , error.status??500)
    }
  }

  @UseGuards(AuthGuard)
  @Post('set-password')
  async setPasswordForGoogleUser(
    @Req() req : any,
    @Body() dto : SetPasswordDto
  ){
    try {
      const userId  = req.user.userId
      console.log(userId)
      return await this.authService.setPassword(userId,dto)
    } catch (error) {
      throw new HttpException(error.message , error.status??500)
    }
  }

  @UseGuards(AuthGuard)
  @Post('change-password')  
  async changePasswod(
    @Req() req : any,
    @Body() dto : ChangePasswordDto
  ){
    try {
      const userId  = req.user.userId
      console.log(userId)
      return await this.authService.changePassword(userId,dto)
    } catch (error) {
      throw new HttpException(error.message , error.status??500)
    }
  }

  @Post('password-reset-request')
  async resetPasswordrequest(@Body() data:{email : string}){
    try {
      return await this.authService.sendResetPassLinkToViaNodemailer(data.email)
    } catch (error) {
      throw new HttpException(error.message , error.status??500)
    }
  }

  @Post('reset-password/:id')
  async resetPassword(
    @Param('id') id : string,
    @Body() dto : SetPasswordDto
  ){
    try {
      return await this.authService.resetPassword(id, dto)
    } catch (error) {
      throw new HttpException(error.message , error.status??500)
    }
  }


  @Post('refresh')                                  // accessToken eskibqosa shunga call qilishad
  async refreshTwoTokents(@Body() dto : refreshTwoTokents){
    try {
      return await this.authService.refreshAll(dto.refresh_token)
    } catch (error) {
      throw new HttpException(error.message , error.status??500)
    }
  }
}
