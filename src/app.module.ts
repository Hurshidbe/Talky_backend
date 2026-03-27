import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { DbModule } from './modules/db/db.module';

@Module({
  imports: [AuthModule, UserModule, DbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
