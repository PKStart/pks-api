import { BaseEntity, UUID } from './misc'

export interface User extends BaseEntity {
  name: string
  email: string
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

export interface LoginResponse {
  id: UUID
  name: string
  email: string
  token: string
  expiresAt: Date
}
