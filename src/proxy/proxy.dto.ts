import { ApiProperty } from '@nestjs/swagger'
import { IsString, Matches } from 'class-validator'
import {
  BirthdayItem,
  CustomValidationError,
  KoreanDictItem,
  ProxyRequest,
  UrlRegex,
} from 'pks-common'

export class ProxyRequestDto implements ProxyRequest {
  @ApiProperty()
  @IsString({ message: CustomValidationError.STRING_REQUIRED })
  @Matches(UrlRegex, { message: CustomValidationError.INVALID_URL })
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
