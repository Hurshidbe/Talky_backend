import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch()
export class WsAllExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();
    
    let errorMessage = 'Internal server error';
    if (exception instanceof WsException) {
      errorMessage = exception.getError() as string;
    } else if (exception instanceof HttpException) {
      errorMessage = exception.getResponse() as string;
    } else if (exception instanceof Error) {
      errorMessage = exception.message;
    }

    client.emit('exception', {
      success: false,
      message: errorMessage,
      rawError: exception,
    });

    // Agar mijoz Ack (Javob) kutayotgan bo'lsa, xatoni to'g'ridan to'g'ri qaytaramiz!
    const args = host.getArgs();
    const callback = args[args.length - 1];
    if (typeof callback === 'function') {
      callback({ success: false, message: errorMessage, error: exception });
    }
  }
}
