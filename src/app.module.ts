import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { DbModule } from './modules/db/db.module';
import { Cache_Module } from './modules/cache/Cache.Module';
import { GoogleOauth2Module } from './modules/google-oauth2/google-oauth2.module';
import { MailModule } from './modules/nodeMailer/mailer.module';
import { ConfigModule } from '@nestjs/config';
import { env } from 'process';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true,
      envFilePath : '.env'
    }),
    AuthModule,
    UserModule, 
    DbModule, 
    Cache_Module, 
    GoogleOauth2Module,
    MailModule
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
