import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsGateway } from './projects.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './entities/project.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MailModule } from '../nodeMailer/mailer.module';
import { Auth, AuthSchema } from '../auth/schema/auth.schema';
import * as dotenv from 'dotenv'
import { ProjectsController } from './projects.controller';
dotenv.config()

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: Auth.name, schema: AuthSchema }
    ]),
    MailModule
  ],
  controllers: [ProjectsController],
  providers: [ProjectsGateway, ProjectsService],
})
export class ProjectsModule { }
