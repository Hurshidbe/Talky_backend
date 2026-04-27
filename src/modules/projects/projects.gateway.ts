import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, WebSocketServer, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { BadRequestException, HttpException, InternalServerErrorException, Logger, Post, Req, UnauthorizedException } from '@nestjs/common';

@WebSocketGateway({cors : {origin : '*'}}) // must change before deploy
export class ProjectsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly projectService : ProjectsService
  ){}

  @WebSocketServer()
  server!:Server
  
  async handleConnection(client: Socket) {
  try {
    const payload = await this.projectService.tokenChecker(client)
    if (!payload) {
      client.emit('error', { message: 'token not found or expired' })
      setTimeout(() => client.disconnect(), 100)
      return
    }
    client.data.userId = payload.userId
    client.emit('connected')
    return
  } catch (error) {
    client.emit('error', { message: 'jwt error : token notfound/expired' })
    setTimeout(() => client.disconnect(), 100)
   }
  }

  async handleDisconnect(client : Socket){}

  @SubscribeMessage('addProject')
 async handleAddProject(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: CreateProjectDto,
  ) {
    try {
      if (await this.projectService.tokenChecker(client)) {
        const project = await this.projectService.create(client.data.user.userId, dto)
        client.emit('projectAdded', { success: true, data: project }); //faqat clientni o'ziga habar yuboradi
        // this.server.emit('projectListUpdated', { newProject: project }); //serverga ulangan hammaga habar yuboradi
        return project;
      }
    } catch (error) {
      client.emit('error', {success: false, event: 'addProject',error: error.message});
    }
  }
}
