import { ApiProperty } from '@nestjs/swagger'
import {
  CreatePersonalDataRequest,
  CustomValidationError,
  DeletePersonalDataRequest,
  PersonalData,
  PersonalDataIdResponse,
  UpdatePersonalDataRequest,
  UUID,
} from 'pks-common'
import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export class PersonalDataDto implements PersonalData {
  @ApiProperty()
  id: UUID

  @ApiProperty()
  userId: UUID

  @ApiProperty()
  name: string

  @ApiProperty()
  identifier: string

  @ApiProperty()
  expiry?: Date

  @ApiProperty()
  createdAt: Date
}

export class CreatePersonalDataRequestDto implements CreatePersonalDataRequest {
  @ApiProperty()
  @IsString({ message: CustomValidationError.STRING_REQUIRED })
  name: string

  @ApiProperty()
  @IsString({ message: CustomValidationError.STRING_REQUIRED })
  identifier: string

  @ApiProperty()
  @IsOptional()
  @IsDateString(null, { message: CustomValidationError.INVALID_DATE })
  expiry?: Date
}

export class UpdatePersonalDataRequestDto
  extends CreatePersonalDataRequestDto
  implements UpdatePersonalDataRequest
{
  @ApiProperty()
  @IsNotEmpty({ message: CustomValidationError.STRING_REQUIRED })
  @IsUUID('4', { message: CustomValidationError.INVALID_UUID })
  id: UUID
}

export class DeletePersonalDataRequestDto implements DeletePersonalDataRequest {
  @ApiProperty()
  @IsNotEmpty({ message: CustomValidationError.STRING_REQUIRED })
  @IsUUID('4', { message: CustomValidationError.INVALID_UUID })
  id: UUID
}

export class PersonalDataIdResponseDto implements PersonalDataIdResponse {
  @ApiProperty()
  id: UUID
}
