import { ApiProperty } from '@nestjs/swagger'
import { IsUrl } from 'class-validator'
import { BirthdayItem, CustomValidationError, KoreanDictItem, ProxyRequest } from '@pk-start/common'

export class ProxyRequestDto implements ProxyRequest {
  @ApiProperty()
  @IsUrl({}, { message: CustomValidationError.INVALID_URL })
  url: string
}

export class BirthdayItemDto implements BirthdayItem {
  @ApiProperty()
  name: string

  @ApiProperty()
  date: string
}

export class KoreanDictItemDto implements KoreanDictItem {
  @ApiProperty()
  kor: string

  @ApiProperty()
  hun: string
}
