import { Module } from '@nestjs/common';
import { LoggerModule as PinoModule } from 'nestjs-pino';

@Module({
  imports: [
    PinoModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
        serializers: {
          req(req) { return { id: req.id, method: req.method, url: req.url }; },
          res(res) { return { statusCode: res.statusCode }; },
        },
      },
    }),
  ],
})
export class LoggerModule {}
