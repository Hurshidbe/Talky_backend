import { Body, Controller, Get, HttpException, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { refreshTwoTokents, RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport'
import type { Request } from 'express';
import { Profile } from 'passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body()dto : RegisterDto){
   try {
     return this.authService.register(dto)
   } catch (error) {
    throw new HttpException(error.message , error.status??500)
   }
  }

  @Post('login')
  async login(
    @Body() dto : LoginDto,
  ){
    try {
      return this.authService.login(dto)
    } catch (error) {
      throw new HttpException(error.message , error.status??500)
    }
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(){}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async callback(@Req() req : Request){
    try {
    const data = req.user as Profile
    return this.authService.registerOrLoginWithGoogle(data)
    } catch (error) {
      Logger.error(error)
      throw new HttpException(error.message , error.status??500)
    }
  }

    
  @Post('refresh')                                  // accessToken eskibqosa shunga call qilishadda
  async refreshTwoTokents(@Body() dto : refreshTwoTokents){
    try {
      return this.authService.refreshAll(dto.refresh_token)
    } catch (error) {
      throw new HttpException(error.message , error.status??500)
    }
  }
}
