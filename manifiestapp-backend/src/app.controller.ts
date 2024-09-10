import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Post('bypass-cors')
  bypassCors(@Body() url: {url: string}) {
    return this.appService.bypassCors(url.url);
  }
}
