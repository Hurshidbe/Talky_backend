import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { DbModule } from './modules/db/db.module';
import { Cache_Module } from './modules/cache/Cache.Module';
import { GoogleOauth2Module } from './modules/google-oauth2/google-oauth2.module';

@Module({
  imports: [AuthModule, UserModule, DbModule, Cache_Module, GoogleOauth2Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
