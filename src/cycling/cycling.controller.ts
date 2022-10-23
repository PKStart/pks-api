import { Controller, Get } from '@nestjs/common'
import { CyclingService } from './cycling.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Cycling')
@Controller('cycling')
export class CyclingController {
  constructor(private cyclingService: CyclingService) {}

  @Get()
  public async dummy(): Promise<string> {
    return this.cyclingService.getDummy()
  }
}
