import client from './client'
import type { LoginRequest, RegisterRequest, RefreshTokenRequest, LoginResponse } from '@/types'

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await client.post<LoginResponse>('/auth/login', data)
  return response.data
}

export async function register(data: RegisterRequest): Promise<LoginResponse> {
  const response = await client.post<LoginResponse>('/auth/register', data)
  return response.data
}

export async function refreshToken(data: RefreshTokenRequest): Promise<LoginResponse> {
  const response = await client.post<LoginResponse>('/auth/refresh', data)
  return response.data
}
