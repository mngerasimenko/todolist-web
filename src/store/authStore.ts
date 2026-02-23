import { create } from 'zustand'
import type { UserResponse, LoginRequest, RegisterRequest } from '@/types'
import { login, register, refreshToken } from '@/api/auth'
import { getCurrentUser } from '@/api/users'
import { setAccessToken } from '@/api/client'

interface AuthState {
  user: UserResponse | null
  isAuthenticated: boolean
  isLoading: boolean

  // Действия
  loginUser: (data: LoginRequest) => Promise<void>
  registerUser: (data: RegisterRequest) => Promise<void>
  logout: () => void
  restoreSession: () => Promise<void>
  updateUser: (user: UserResponse) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  loginUser: async (data) => {
    const response = await login(data)
    setAccessToken(response.access_token)
    localStorage.setItem('refresh_token', response.refresh_token)
    set({ user: response.user, isAuthenticated: true })
  },

  registerUser: async (data) => {
    const response = await register(data)
    setAccessToken(response.access_token)
    localStorage.setItem('refresh_token', response.refresh_token)
    set({ user: response.user, isAuthenticated: true })
  },

  logout: () => {
    setAccessToken(null)
    localStorage.removeItem('refresh_token')
    set({ user: null, isAuthenticated: false, isLoading: false })
  },

  // Восстановление сессии при перезагрузке страницы
  restoreSession: async () => {
    const refreshTokenValue = localStorage.getItem('refresh_token')
    if (!refreshTokenValue) {
      set({ isLoading: false })
      return
    }

    try {
      // Обновляем access-токен через refresh
      const response = await refreshToken({ refresh_token: refreshTokenValue })
      setAccessToken(response.access_token)
      localStorage.setItem('refresh_token', response.refresh_token)

      // Получаем данные текущего пользователя
      const user = await getCurrentUser()
      set({ user, isAuthenticated: true, isLoading: false })
    } catch {
      // Refresh-токен невалиден — разлогиниваем
      setAccessToken(null)
      localStorage.removeItem('refresh_token')
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  updateUser: (user) => {
    set({ user })
  },
}))
