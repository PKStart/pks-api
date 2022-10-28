import { ApiProperty } from '@nestjs/swagger'
import {
  CustomValidationError,
  LoginCodeRegex,
  LoginCodeRequest,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  TokenRefreshRequest,
  TokenResponse,
  UUID,
  UserSettings as IUserSettings,
  User,
  Note,
  Shortcut,
  PersonalData,
  Cycling,
} from 'pks-common'
import { IsEmail, IsString, IsUUID, Matches, MaxLength, MinLength } from 'class-validator'

export class SignupRequestDto implements SignupRequest {
  @ApiProperty()
  @IsEmail({}, { message: CustomValidationError.INVALID_EMAIL })
  email: string

  @ApiProperty()
  @IsString({ message: CustomValidationError.STRING_REQUIRED })
  @MinLength(2, { message: CustomValidationError.MIN_LENGTH })
  @MaxLength(20, { message: CustomValidationError.MAX_LENGTH })
  name: string
}

export class SignupResponseDto implements SignupResponse {
  @ApiProperty()
  id: UUID
}

export class LoginCodeRequestDto implements LoginCodeRequest {
  @ApiProperty()
  @IsEmail({}, { message: CustomValidationError.INVALID_EMAIL })
  email: string
}

export class LoginRequestDto extends LoginCodeRequestDto implements LoginRequest {
  @ApiProperty({ format: '000000' })
  @IsString({ message: CustomValidationError.STRING_REQUIRED })
  @Matches(LoginCodeRegex, { message: CustomValidationError.INVALID_LOGIN_CODE })
  loginCode: string
}

export class TokenRefreshRequestDto implements TokenRefreshRequest {
  @ApiProperty()
  @IsUUID('4', { message: CustomValidationError.INVALID_UUID })
  userId: UUID
}

export class TokenResponseDto implements TokenResponse {
  @ApiProperty()
  token: string

  @ApiProperty()
  expiresAt: Date
}

export class UserSettings implements IUserSettings {
  @ApiProperty()
  locationApiKey: string | null

  @ApiProperty()
  weatherApiKey: string | null

  @ApiProperty()
  shortcutIconBaseUrl: string | null

  @ApiProperty()
  birthdaysUrl: string | null

  @ApiProperty()
  koreanUrl: string | null

  @ApiProperty()
  stravaClientId: string | null

  @ApiProperty()
  stravaClientSecret: string | null

  @ApiProperty()
  stravaRedirectUri: string | null
}

export class LoginResponseDto extends TokenResponseDto implements LoginResponse {
  @ApiProperty()
  email: string

  @ApiProperty()
  id: UUID

  @ApiProperty()
  name: string

  @ApiProperty()
  settings: UserSettings
}
export interface JwtPayload {
  email: string
  userId: UUID
}

export interface JwtDecodedToken {
  email: string
  iat: number
  exp: number
}

export interface DataBackup {
  user: User
  notes: Note[]
  shortcuts: Shortcut[]
  personalData: PersonalData[]
  cycling: Cycling
}
