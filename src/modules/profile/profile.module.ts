import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from '../auth/schema/auth.schema';

@Module({
  imports : [
    MongooseModule.forFeature([
      { name: Auth.name, schema: AuthSchema}
    ])
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
