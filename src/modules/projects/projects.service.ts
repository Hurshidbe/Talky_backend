import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './entities/project.entity';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { error } from 'console';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private readonly ProjectsRepo : Model<Project>,
    private readonly jwt : JwtService
  ){}

  async create(owner : string,  createProjectDto: CreateProjectDto) {
    const created = await this.ProjectsRepo.create(
      {name:createProjectDto.name, description : createProjectDto.description, owner}
    )
    return created
  }

  async tokenChecker(client: Socket) {
  try {
    const token = client.request.headers.authorization
    if (!token) throw new Error('token not found')
    const payload = await this.jwt.verifyAsync(token, {secret: process.env.JWT_SECRET})
    client.data.user = payload
    return payload
  } catch (error) {
    throw new UnauthorizedException(error.message)
    return false
  }
 }
}
