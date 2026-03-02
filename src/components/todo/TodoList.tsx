import { AnimatePresence, motion } from 'framer-motion'
import { useTodoStore } from '@/store/todoStore'
import { TodoItem } from './TodoItem'
import { Skeleton } from '@/components/ui/skeleton'
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
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <TodoItemSkeleton key={i} />
        ))}
      </div>
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
      <AnimatePresence initial={false}>
        {sortedTodos.map((todo) => (
          <motion.div
            key={todo.id}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TodoItem todo={todo} onEdit={onEditTodo} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function TodoItemSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
      <Skeleton className="h-4 w-4 rounded" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}
