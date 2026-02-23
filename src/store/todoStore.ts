import { create } from 'zustand'
import type { TodoResponse, ListResponse } from '@/types'
import { getListTodos } from '@/api/lists'
import * as todosApi from '@/api/todos'
import * as listsApi from '@/api/lists'

interface TodoState {
  // Списки
  lists: ListResponse[]
  currentList: ListResponse | null
  listsLoading: boolean

  // Задачи
  todos: TodoResponse[]
  todosLoading: boolean

  // Фильтр
  filter: 'all' | 'active' | 'done'

  // Действия со списками
  loadLists: () => Promise<void>
  selectList: (list: ListResponse) => Promise<void>
  addList: (list: ListResponse) => void
  removeList: (listId: number) => void

  // Действия с задачами
  loadTodos: () => Promise<void>
  addTodo: (todo: TodoResponse) => void
  updateTodo: (todo: TodoResponse) => void
  removeTodo: (todoId: number) => void
  toggleDone: (todoId: number, isDone: boolean) => Promise<void>

  // Фильтр
  setFilter: (filter: 'all' | 'active' | 'done') => void

  // Очистка при логауте
  reset: () => void
}

export const useTodoStore = create<TodoState>((set, get) => ({
  lists: [],
  currentList: null,
  listsLoading: false,

  todos: [],
  todosLoading: false,

  filter: 'all',

  loadLists: async () => {
    set({ listsLoading: true })
    try {
      const lists = await listsApi.getMyLists()
      const currentList = get().currentList
      // Если текущий список ещё существует — оставляем его
      const stillExists = currentList && lists.some((l) => l.id === currentList.id)
      set({
        lists,
        currentList: stillExists ? currentList : lists[0] || null,
        listsLoading: false,
      })
      // Загружаем задачи выбранного списка
      const selected = stillExists ? currentList : lists[0]
      if (selected) {
        const todos = await getListTodos(selected.id)
        set({ todos })
      }
    } catch {
      set({ listsLoading: false })
    }
  },

  selectList: async (list) => {
    set({ currentList: list, todosLoading: true })
    try {
      const todos = await getListTodos(list.id)
      set({ todos, todosLoading: false })
    } catch {
      set({ todosLoading: false })
    }
  },

  addList: (list) => {
    set((state) => ({ lists: [...state.lists, list] }))
  },

  removeList: (listId) => {
    set((state) => {
      const lists = state.lists.filter((l) => l.id !== listId)
      const currentList =
        state.currentList?.id === listId ? lists[0] || null : state.currentList
      return { lists, currentList }
    })
    // Если текущий список изменился — загружаем его задачи
    const newCurrent = get().currentList
    if (newCurrent) {
      get().selectList(newCurrent)
    } else {
      set({ todos: [] })
    }
  },

  loadTodos: async () => {
    const currentList = get().currentList
    if (!currentList) return
    set({ todosLoading: true })
    try {
      const todos = await getListTodos(currentList.id)
      set({ todos, todosLoading: false })
    } catch {
      set({ todosLoading: false })
    }
  },

  addTodo: (todo) => {
    set((state) => ({ todos: [todo, ...state.todos] }))
  },

  updateTodo: (todo) => {
    set((state) => ({
      todos: state.todos.map((t) => (t.id === todo.id ? todo : t)),
    }))
  },

  removeTodo: (todoId) => {
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== todoId),
    }))
  },

  toggleDone: async (todoId, isDone) => {
    // Оптимистичное обновление
    const prevTodos = get().todos
    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === todoId ? { ...t, done: isDone } : t
      ),
    }))
    try {
      const updated = isDone
        ? await todosApi.markAsDone(todoId)
        : await todosApi.markAsUndone(todoId)
      // Обновляем данными с сервера (completor_user и т.д.)
      set((state) => ({
        todos: state.todos.map((t) => (t.id === updated.id ? updated : t)),
      }))
    } catch {
      // Откат при ошибке
      set({ todos: prevTodos })
    }
  },

  setFilter: (filter) => {
    set({ filter })
  },

  reset: () => {
    set({
      lists: [],
      currentList: null,
      todos: [],
      filter: 'all',
      listsLoading: false,
      todosLoading: false,
    })
  },
}))
