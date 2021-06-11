import {
  CustomValidationError,
  LoginCodeRegex,
  LoginCodeRequest,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  TokenResponse,
  UUID,
} from '@pk-start/common'
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class SignupRequestDto implements SignupRequest {
  @IsEmail({}, { message: CustomValidationError.INVALID_EMAIL })
  email: string

  @IsString({ message: CustomValidationError.STRING_REQUIRED })
  @MinLength(2, { message: CustomValidationError.MIN_LENGTH })
  @MaxLength(20, { message: CustomValidationError.MAX_LENGTH })
  name: string
}

export class SignupResponseDto implements SignupResponse {
  id: UUID
}

export class LoginCodeRequestDto implements LoginCodeRequest {
  @IsEmail({}, { message: CustomValidationError.INVALID_EMAIL })
  email: string
}

export class LoginRequestDto extends LoginCodeRequestDto implements LoginRequest {
  @IsString()
  @Matches(LoginCodeRegex, { message: CustomValidationError.INVALID_LOGIN_CODE })
  loginCode: string
}

export class TokenResponseDto implements TokenResponse {
  token: string
  expiresAt: Date
}

export class LoginResponseDto extends TokenResponseDto implements LoginResponse {
  email: string
  id: UUID
  name: string
}
export interface JwtPayload {
  email: string
  userId: string
}

export interface JwtDecodedToken {
  email: string
  iat: number
  exp: number
}
