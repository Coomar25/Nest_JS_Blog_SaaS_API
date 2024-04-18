import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('file/:filename')
  getFile(@Res() res: Response, @Param('filename') filename: string) {
    const file = createReadStream(join(process.cwd(), `uploads/${filename}`));
    file.pipe(res);
  }
}
