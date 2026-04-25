import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from '../auth/schema/auth.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports : [
    MongooseModule.forFeature([
      { name: Auth.name, schema: AuthSchema}
    ]),
    CloudinaryModule
  ],
  controllers: [ProfileController],
  providers: [ProfileService ,CloudinaryService],
})
export class ProfileModule {}
