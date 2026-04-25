import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsGateway } from './projects.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './entities/project.entity';

@Module({
  imports : [
    MongooseModule.forFeature([
      {name : Project.name, schema : ProjectSchema}
    ])
  ],
  providers: [ProjectsGateway, ProjectsService],
})
export class ProjectsModule {}
