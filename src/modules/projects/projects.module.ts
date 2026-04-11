import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsGateway } from './projects.gateway';

@Module({
  providers: [ProjectsGateway, ProjectsService],
})
export class ProjectsModule {}
