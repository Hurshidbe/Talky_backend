import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@WebSocketGateway()
export class ProjectsGateway {
  constructor(private readonly projectsService: ProjectsService) {}

  @SubscribeMessage('createProject')
  create(@MessageBody() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @SubscribeMessage('findAllProjects')
  findAll() {
    return this.projectsService.findAll();
  }

  @SubscribeMessage('findOneProject')
  findOne(@MessageBody() id: number) {
    return this.projectsService.findOne(id);
  }

  @SubscribeMessage('updateProject')
  update(@MessageBody() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(updateProjectDto.id, updateProjectDto);
  }

  @SubscribeMessage('removeProject')
  remove(@MessageBody() id: number) {
    return this.projectsService.remove(id);
  }
}
