import { ApiProperty } from '@nestjs/swagger'
import {
  CreateShortcutRequest,
  CustomValidationError,
  DeleteShortcutRequest,
  Shortcut,
  ShortcutCategory,
  ShortcutIdResponse,
  UpdateShortcutRequest,
  UUID,
} from '@pk-start/common'
import {
  IsEnum,
  IsNumber,
  IsString,
  IsUrl,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator'

export class ShortcutDto implements Shortcut {
  @ApiProperty()
  id: UUID

  @ApiProperty()
  userId: UUID

  @ApiProperty()
  name: string

  @ApiProperty()
  url: string

  @ApiProperty()
  iconUrl: string

  @ApiProperty({ enum: ShortcutCategory, enumName: 'ShortcutCategory' })
  category: ShortcutCategory

  @ApiProperty()
  priority: number

  @ApiProperty()
  createdAt: Date
}

export class CreateShortcutRequestDto implements CreateShortcutRequest {
  @ApiProperty()
  @IsString({ message: CustomValidationError.STRING_REQUIRED })
  @MinLength(2, { message: CustomValidationError.MIN_LENGTH })
  @MaxLength(20, { message: CustomValidationError.MAX_LENGTH })
  name: string

  @ApiProperty()
  @IsUrl({}, { message: CustomValidationError.INVALID_URL })
  url: string

  @ApiProperty()
  @IsUrl({}, { message: CustomValidationError.INVALID_URL })
  iconUrl: string

  @ApiProperty({ enum: ShortcutCategory, enumName: 'ShortcutCategory' })
  @IsEnum(ShortcutCategory, { message: CustomValidationError.INVALID_CATEGORY })
  category: ShortcutCategory

  @ApiProperty()
  @IsNumber({}, { message: CustomValidationError.NUMBER_REQUIRED })
  @Min(1, { message: CustomValidationError.MIN_VALUE })
  @Max(10, { message: CustomValidationError.MAX_VALUE })
  priority: number
}

export class UpdateShortcutRequestDto
  extends CreateShortcutRequestDto
  implements UpdateShortcutRequest {
  @ApiProperty()
  @IsUUID('4', { message: CustomValidationError.INVALID_UUID })
  id: UUID

  @ApiProperty()
  @IsUUID('4', { message: CustomValidationError.INVALID_UUID })
  userId: UUID
}

export class DeleteShortcutRequestDto implements DeleteShortcutRequest {
  @ApiProperty()
  @IsUUID('4', { message: CustomValidationError.INVALID_UUID })
  id: UUID
}

export class ShortcutIdResponseDto implements ShortcutIdResponse {
  @ApiProperty()
  id: UUID
}