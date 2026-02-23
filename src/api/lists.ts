import client from './client'
import type {
  CreateListRequest,
  JoinListRequest,
  ListResponse,
  ListMemberResponse,
  TodoResponse,
} from '@/types'

export async function getMyLists(): Promise<ListResponse[]> {
  const response = await client.get<ListResponse[]>('/lists')
  return response.data
}

export async function createList(data: CreateListRequest): Promise<ListResponse> {
  const response = await client.post<ListResponse>('/lists', data)
  return response.data
}

export async function joinList(data: JoinListRequest): Promise<ListResponse> {
  const response = await client.post<ListResponse>('/lists/join', data)
  return response.data
}

export async function getListMembers(listId: number): Promise<ListMemberResponse[]> {
  const response = await client.get<ListMemberResponse[]>(`/lists/${listId}/members`)
  return response.data
}

export async function getListTodos(listId: number): Promise<TodoResponse[]> {
  const response = await client.get<TodoResponse[]>(`/lists/${listId}/todos`)
  return response.data
}

export async function leaveList(listId: number): Promise<void> {
  await client.delete(`/lists/${listId}/leave`)
}
