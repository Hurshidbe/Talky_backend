import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Body, HttpException, Post, Req } from '@nestjs/common';

@WebSocketGateway()
export class ProjectsGateway {
  constructor(private readonly projectsService: ProjectsService) {}
  @Post()
  async createproject(
    @Req() req : any,
    @Body() dto:any
  ){
    try {
      
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }
}
