import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DbModule } from '../db/db.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from './schema/auth.schema';
import { JwtModule } from '@nestjs/jwt';
import { RefreshToken, RefreshTokenSchema } from './schema/refreshToken.schema';

@Module({
  imports : [
    DbModule,
    MongooseModule.forFeature([
      {name : Auth.name, schema : AuthSchema},
      {name : RefreshToken.name, schema : RefreshTokenSchema}
    ]),
    JwtModule.register(
      {
        global : true,
        secret : process.env.JWT_SECRET??"",
        signOptions :{
          expiresIn : '5m'
        }
      }
    )
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
