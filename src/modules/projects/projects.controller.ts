import { Controller, Get, Param, Res, BadRequestException } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @Get('join/:token')
  async joinProject(@Param('token') token: string, @Res() res: any) {
    try {
      const result = await this.projectsService.acceptInvitation(token);
      // Odatda muvaffaqiyatli qo'shilgach, frontend dagi loyiha sahifasiga yo'naltiramiz
      // Hozircha oddiy xabar qaytaramiz
      return res.send(`
        <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
            <h1 style="color: green;">Success!</h1>
            <p>You have successfully joined the project: <b>${result.projectName}</b></p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}">Go to TASKY</a>
        </div>
      `);
    } catch (error) {
      return res.status(400).send(`
        <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
            <h1 style="color: red;">Error</h1>
            <p>${error.message}</p>
        </div>
      `);
    }
  }
}
