import client from './client'
import type { UserResponse } from '@/types'

export async function getCurrentUser(): Promise<UserResponse> {
  const response = await client.get<UserResponse>('/users/me')
  return response.data
}

export async function updateColors(
  userId: number,
  colors: { created_task_color: string; completed_task_color: string }
): Promise<UserResponse> {
  const response = await client.put<UserResponse>(`/users/${userId}/colors`, colors)
  return response.data
}
