import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { apiDocs } from './shared/api-docs'

@ApiTags('Default')
@Controller('')
export class AppController {
  /**
   * This endpoint is gonna serve as a dummy, just to make sure the app is running.
   * While using the free dyno on Heroku, the app is going to sleep after 30 minutes of inactivity and
   * it takes about 30 seconds to wake up again. This endpoint should be called when the frontend app starts
   * to have the backend up and running for the first login request.
   */
  @Get('/wakeup')
  @ApiOperation(apiDocs.wakeUp.operation)
  @ApiOkResponse(apiDocs.wakeUp.ok)
  public async wakeUp(): Promise<{ result: string }> {
    return { result: 'API is up and running!' }
  }
}
