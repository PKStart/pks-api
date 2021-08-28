import { Body, Controller, Get, UseGuards, ValidationPipe } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { apiDocs } from '../shared/api-docs'
import { PkAuthGuard } from '../users/pk-auth-guard'
import { BirthdayItemDto, KoreanDictItemDto, ProxyRequestDto } from './proxy.dto'
import { ProxyService } from './proxy.service'

@ApiTags('Proxy')
@Controller('proxy')
export class ProxyController {
  constructor(private proxyService: ProxyService) {}

  @Get('/birthdays')
  @UseGuards(PkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(apiDocs.proxy.birthdays.operation)
  @ApiOkResponse(apiDocs.proxy.birthdays.ok)
  @ApiBadRequestResponse(apiDocs.generic.validationError)
  public async getBirthdays(
    @Body(ValidationPipe) request: ProxyRequestDto
  ): Promise<BirthdayItemDto[]> {
    return this.proxyService.getBirthdays(request.url)
  }

  @Get('/korean')
  @UseGuards(PkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(apiDocs.proxy.korean.operation)
  @ApiOkResponse(apiDocs.proxy.korean.ok)
  @ApiBadRequestResponse(apiDocs.generic.validationError)
  public async getKoreanWordList(
    @Body(ValidationPipe) request: ProxyRequestDto
  ): Promise<KoreanDictItemDto[]> {
    return this.proxyService.getKoreanWordList(request.url)
  }
}
