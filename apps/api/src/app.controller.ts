import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    console.log('[app.controller] URL from .env:', process.env.PK_DB_URL)
  }

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }
}
