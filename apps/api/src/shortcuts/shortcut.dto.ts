import { ApiProperty } from '@nestjs/swagger'
import {
  CreateShortcutRequest,
  CustomValidationError,
  DeleteShortcutRequest,
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

export class CreateShortcutRequestDto implements CreateShortcutRequest {
  @ApiProperty()
  @IsUUID('4', { message: CustomValidationError.INVALID_UUID })
  userId: UUID

  @ApiProperty()
  @IsString({ message: CustomValidationError.STRING_REQUIRED })
  @MinLength(2, { message: CustomValidationError.MIN_LENGTH })
  @MaxLength(20, { message: CustomValidationError.MAX_LENGTH })
  name: string

  @ApiProperty()
  @IsUrl(null, { message: CustomValidationError.INVALID_URL })
  url: string

  @ApiProperty()
  @IsUrl(null, { message: CustomValidationError.INVALID_URL })
  iconUrl: string

  @ApiProperty()
  @IsEnum(ShortcutCategory, { message: CustomValidationError.INVALID_CATEGORY })
  category: ShortcutCategory

  @ApiProperty()
  @IsNumber(null, { message: CustomValidationError.NUMBER_REQUIRED })
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
