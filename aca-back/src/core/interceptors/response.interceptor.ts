import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    perPage?: number;
    total?: number;
    totalPages?: number;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // Se já tem envelope, retorna como está
        if (data && typeof data === 'object' && ('data' in data || 'error' in data)) {
          return data;
        }

        // Se é uma lista com paginação, adiciona meta
        if (Array.isArray(data)) {
          return {
            data,
          };
        }

        // Para objetos simples, envolve em data
        return {
          data,
        };
      }),
    );
  }
}
