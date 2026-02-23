// === Auth ===

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  email: string
  name: string
  password: string
}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface UserResponse {
  id: number
  email: string
  name: string
  created_task_color?: string
  completed_task_color?: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
  user: UserResponse
}

// === Todo ===

export interface TodoResponse {
  id: number
  name: string
  created_at: string
  completed_at: string | null
  done: boolean
  is_private: boolean
  user_id: number
  user_name: string
  completor_user_id: number | null
  completor_user_name: string | null
  list_id: number
  creator_color: string | null
  completor_color: string | null
}

export interface TodoRequest {
  name: string
  user_id: number
  list_id: number
  done?: boolean
  is_private?: boolean
}

// === Lists ===

export interface ListResponse {
  id: number
  name: string
  role: string
  created_at: string
}

export interface ListMemberResponse {
  user_id: number
  user_name: string
  role: string
  joined_at: string
}

export interface CreateListRequest {
  name: string
  password: string
}

export interface JoinListRequest {
  name: string
  password: string
}

// === App ===

export interface ApiError {
  timestamp: string
  status: number
  error: string
  message: string
}
