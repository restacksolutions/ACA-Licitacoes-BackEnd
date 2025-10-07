import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const response = context.switchToHttp().getResponse();
        
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let code = 'INTERNAL_ERROR';
        let message = 'Erro interno do servidor';
        let details = undefined;

        if (error instanceof HttpException) {
          status = error.getStatus();
          const errorResponse = error.getResponse();
          
          if (typeof errorResponse === 'string') {
            message = errorResponse;
          } else if (typeof errorResponse === 'object' && errorResponse !== null) {
            const errorObj = errorResponse as any;
            message = errorObj.message || errorObj.error || message;
            details = errorObj.details;
          }

          // Mapear códigos de erro baseados no status
          switch (status) {
            case HttpStatus.BAD_REQUEST:
              code = 'VALIDATION_ERROR';
              break;
            case HttpStatus.UNAUTHORIZED:
              code = 'UNAUTHORIZED';
              break;
            case HttpStatus.FORBIDDEN:
              code = 'FORBIDDEN';
              break;
            case HttpStatus.NOT_FOUND:
              code = 'NOT_FOUND';
              break;
            case HttpStatus.CONFLICT:
              code = 'CONFLICT';
              break;
            case HttpStatus.UNPROCESSABLE_ENTITY:
              code = 'VALIDATION_ERROR';
              break;
            default:
              code = 'HTTP_ERROR';
          }
        } else {
          // Erro não tratado
          console.error('Erro não tratado:', error);
          message = error.message || 'Erro interno do servidor';
        }

        const apiError: ApiError = {
          error: {
            code,
            message,
            details,
          },
        };

        response.status(status).json(apiError);
        
        return throwError(() => error);
      }),
    );
  }
}
