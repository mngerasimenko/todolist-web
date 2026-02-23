import client from './client'
import type { TodoRequest, TodoResponse } from '@/types'

export async function createTodo(data: TodoRequest): Promise<TodoResponse> {
  const response = await client.post<TodoResponse>('/todos/create', data)
  return response.data
}

export async function updateTodo(id: number, data: TodoRequest): Promise<TodoResponse> {
  const response = await client.put<TodoResponse>(`/todos/${id}`, data)
  return response.data
}

export async function getTodo(id: number): Promise<TodoResponse> {
  const response = await client.get<TodoResponse>(`/todos/${id}`)
  return response.data
}

export async function markAsDone(id: number): Promise<TodoResponse> {
  const response = await client.patch<TodoResponse>(`/todos/${id}/done`)
  return response.data
}

export async function markAsUndone(id: number): Promise<TodoResponse> {
  const response = await client.patch<TodoResponse>(`/todos/${id}/undone`)
  return response.data
}

export async function deleteTodo(id: number): Promise<void> {
  await client.delete(`/todos/${id}`)
}
