import client from './client'
import type {
  LoginRequest, RegisterRequest, RefreshTokenRequest, LoginResponse,
  VerifyEmailRequest, ForgotPasswordRequest, ResetPasswordRequest, MessageResponse,
} from '@/types'

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

export async function verifyEmail(data: VerifyEmailRequest): Promise<MessageResponse> {
  const response = await client.post<MessageResponse>('/auth/verify-email', data)
  return response.data
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<MessageResponse> {
  const response = await client.post<MessageResponse>('/auth/forgot-password', data)
  return response.data
}

export async function resetPassword(data: ResetPasswordRequest): Promise<MessageResponse> {
  const response = await client.post<MessageResponse>('/auth/reset-password', data)
  return response.data
}

export async function resendVerification(): Promise<MessageResponse> {
  const response = await client.post<MessageResponse>('/auth/resend-verification')
  return response.data
}
