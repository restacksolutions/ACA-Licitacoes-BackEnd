import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  hello() {
    return { ok: true, name: 'ACA API', version: '1.0.0' };
  }
}
