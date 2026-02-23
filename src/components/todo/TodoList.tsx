import { useTodoStore } from '@/store/todoStore'
import { TodoItem } from './TodoItem'
import type { TodoResponse } from '@/types'
import { ListChecks } from 'lucide-react'

interface TodoListProps {
  onEditTodo: (todo: TodoResponse) => void
}

export function TodoList({ onEditTodo }: TodoListProps) {
  const { todos, todosLoading, filter } = useTodoStore()

  // Фильтрация задач
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.done
    if (filter === 'done') return todo.done
    return true
  })

  // Сортировка: невыполненные сначала, затем по дате создания (новые первые)
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  if (todosLoading) {
    return (
      <div className="text-center py-12 text-muted-foreground">Загрузка задач...</div>
    )
  }

  if (sortedTodos.length === 0) {
    return (
      <div className="text-center py-12">
        <ListChecks className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground">
          {filter === 'all' ? 'Нет задач' : filter === 'active' ? 'Нет активных задач' : 'Нет выполненных задач'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {sortedTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onEdit={onEditTodo} />
      ))}
    </div>
  )
}
