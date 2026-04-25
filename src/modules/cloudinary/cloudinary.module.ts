import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Module({
  controllers: [],
  exports :[CloudinaryService],
  providers: [CloudinaryService],
})
export class CloudinaryModule {}
