import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JoinProjectDto } from './dto/join-project.dto';
import { GetBoardDto } from './dto/get-board.dto';
import { Socket, Server } from 'socket.io';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { WsAllExceptionsFilter } from 'src/ws-exception.filter';

@WebSocketGateway({ cors: { origin: '*' } })
@UseFilters(WsAllExceptionsFilter)
export class CardsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly cardsService: CardsService) { }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('joinProject')
  async handleJoinProject(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: JoinProjectDto
  ) {
    try {
      await this.cardsService.tokenChecker(client);
      const userId = client.data.user.userId;
      const projectId = dto.projectId;

      // Xavfsizlik tekshiruvi: User loyiha a'zosimi?
      await this.cardsService.validateProjectAccess(userId, projectId);

      client.join(`project_${projectId}`);
      return { success: true, message: `Joined project room: project_${projectId}` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('createCard')
  async handleCreateCard(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: CreateCardDto
  ) {
    try {
      await this.cardsService.tokenChecker(client);
      const userId = client.data.user.userId;
      const card = await this.cardsService.createCard(userId, dto);

      this.server.to(`project_${dto.projectId}`).emit('cardCreated', card);
      return { success: true, data: card };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('updateCard')
  async handleUpdateCard(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: UpdateCardDto
  ) {
    try {
      await this.cardsService.tokenChecker(client);
      const userId = client.data.user.userId;
      const { id, ...updateData } = dto;
      const card = await this.cardsService.updateCard(userId, id, updateData);

      this.server.to(`project_${card.projectId}`).emit('cardUpdated', card);
      return { success: true, data: card };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('removeCard')
  async handleRemoveCard(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { id: string }
  ) {
    try {
      await this.cardsService.tokenChecker(client);
      const userId = client.data.user.userId;
      const result = await this.cardsService.removeCard(userId, data.id);

      this.server.to(`project_${result.projectId}`).emit('cardRemoved', { cardId: data.id });
      return { success: true, ...result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('createTask')
  async handleCreateTask(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: CreateTaskDto
  ) {
    try {
      await this.cardsService.tokenChecker(client);
      const userId = client.data.user.userId;
      const task = await this.cardsService.createTask(userId, dto);

      this.server.to(`project_${dto.projectId}`).emit('taskCreated', task);
      return { success: true, data: task };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('updateTask')
  async handleUpdateTask(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: UpdateTaskDto
  ) {
    try {
      await this.cardsService.tokenChecker(client);
      const userId = client.data.user.userId;
      const { id, ...updateData } = dto;
      const task = await this.cardsService.updateTask(userId, id as string, updateData);

      this.server.to(`project_${task.projectId}`).emit('taskUpdated', task);
      return { success: true, data: task };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('removeTask')
  async handleRemoveTask(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { id: string }
  ) {
    try {
      await this.cardsService.tokenChecker(client);
      const userId = client.data.user.userId;
      const result = await this.cardsService.removeTask(userId, data.id);

      this.server.to(`project_${result.projectId}`).emit('taskRemoved', { taskId: data.id });
      return { success: true, ...result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('moveTask')
  async handleMoveTask(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: MoveTaskDto
  ) {
    try {
      await this.cardsService.tokenChecker(client);
      const userId = client.data.user.userId;
      const task = await this.cardsService.moveTask(userId, dto);

      this.server.to(`project_${task.projectId}`).emit('taskMoved', task);
      return { success: true, data: task };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('getBoard')
  async handleGetBoard(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: GetBoardDto
  ) {
    try {
      await this.cardsService.tokenChecker(client);
      const userId = client.data.user.userId;
      const board = await this.cardsService.getBoard(userId, dto.projectId);
      return { success: true, data: board };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
