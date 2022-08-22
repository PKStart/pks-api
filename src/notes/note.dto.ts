import { ApiProperty } from '@nestjs/swagger'
import {
  CreateNoteRequest,
  CustomValidationError,
  DeleteNoteRequest,
  Link,
  Note,
  NoteIdResponse,
  UpdateNoteRequest,
  UrlRegex,
  UUID,
} from 'pks-common'
import {
  IsString,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  Matches,
} from 'class-validator'

export class NoteDto implements Note {
  @ApiProperty()
  id: UUID

  @ApiProperty()
  userId: UUID

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  text?: string

  @ApiProperty()
  links?: Link[]

  @ApiProperty()
  archived: boolean

  @ApiProperty()
  pinned: boolean
}

export class LinkDto implements Link {
  @ApiProperty()
  @IsString({ message: CustomValidationError.STRING_REQUIRED })
  name: string

  @ApiProperty()
  @IsString({ message: CustomValidationError.STRING_REQUIRED })
  @Matches(UrlRegex, { message: CustomValidationError.INVALID_URL })
  url: string
}

export class CreateNoteRequestDto implements CreateNoteRequest {
  @ApiProperty()
  @IsOptional()
  @IsString({ message: CustomValidationError.STRING_REQUIRED })
  text?: string

  @ApiProperty()
  @IsOptional()
  @IsArray({ message: CustomValidationError.ARRAY_REQUIRED })
  links?: LinkDto[]

  @ApiProperty()
  @IsBoolean({ message: CustomValidationError.BOOLEAN_REQUIRED })
  archived: boolean

  @ApiProperty()
  @IsBoolean({ message: CustomValidationError.BOOLEAN_REQUIRED })
  pinned: boolean
}

export class UpdateNoteRequestDto extends CreateNoteRequestDto implements UpdateNoteRequest {
  @ApiProperty()
  @IsNotEmpty({ message: CustomValidationError.STRING_REQUIRED })
  @IsUUID('4', { message: CustomValidationError.INVALID_UUID })
  id: UUID
}

export class DeleteNoteRequestDto implements DeleteNoteRequest {
  @ApiProperty()
  @IsNotEmpty({ message: CustomValidationError.STRING_REQUIRED })
  @IsUUID('4', { message: CustomValidationError.INVALID_UUID })
  id: UUID
}

export class NoteIdResponseDto implements NoteIdResponse {
  @ApiProperty()
  id: UUID
}
