import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DbModule } from '../db/db.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from './schema/auth.schema';
import { JwtModule } from '@nestjs/jwt';
import { RefreshToken, RefreshTokenSchema } from './schema/refreshToken.schema';
import { Cache_Module } from '../cache/Cache.Module';
import { ConfigModule } from '@nestjs/config';
import { GoogleOauth2Module } from '../google-oauth2/google-oauth2.module';

@Module({
  imports: [
    DbModule,
    GoogleOauth2Module,
    MongooseModule.forFeature([
      { name: Auth.name, schema: AuthSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? '',
      signOptions: {
        expiresIn: '5m',
      },
    }),
    Cache_Module,
  ],
  controllers: [AuthController],
  providers: [AuthService ],
})
export class AuthModule {}
