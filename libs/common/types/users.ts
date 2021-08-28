import { BaseEntity, UUID } from './misc'

export interface User extends BaseEntity {
  name: string
  email: string
  settings: UserSettings
}

export interface SignupRequest {
  email: string
  name: string
}

export interface SignupResponse {
  id: UUID
}

export interface LoginRequest {
  email: string
  loginCode: string
}

export interface LoginCodeRequest {
  email: string
}

export interface TokenRefreshRequest {
  userId: UUID
}

export interface TokenResponse {
  token: string
  expiresAt: Date
}

export interface LoginResponse extends TokenResponse {
  id: UUID
  name: string
  email: string
  settings: UserSettings
}

export interface UserSettings {
  weatherApiKey: string | null
  locationApiKey: string | null
  shortcutIconBaseUrl: string | null
  birthdaysUrl: string | null
  koreanUrl: string | null
}
