import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsGateway } from './projects.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './entities/project.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv'
dotenv.config()

@Module({
  imports : [
    MongooseModule.forFeature([
      {name : Project.name, schema : ProjectSchema}
    ]),
    JwtModule
  ],
  providers: [ProjectsGateway, ProjectsService, JwtService],
})
export class ProjectsModule {}
