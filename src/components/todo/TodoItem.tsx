import { useState } from 'react'
import { useTodoStore } from '@/store/todoStore'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { formatDate } from '@/lib/utils'
import { Trash2, Lock, Pencil } from 'lucide-react'
import * as todosApi from '@/api/todos'
import type { TodoResponse } from '@/types'

interface TodoItemProps {
  todo: TodoResponse
  onEdit: (todo: TodoResponse) => void
}

export function TodoItem({ todo, onEdit }: TodoItemProps) {
  const { toggleDone, removeTodo } = useTodoStore()
  const user = useAuthStore((s) => s.user)
  const [deleting, setDeleting] = useState(false)

  const isOwner = todo.user_id === user?.id

  const handleDelete = async () => {
    if (!confirm('Удалить задачу?')) return
    setDeleting(true)
    try {
      await todosApi.deleteTodo(todo.id)
      removeTodo(todo.id)
    } catch {
      // Ошибка удаления — ничего не делаем
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/50">
      {/* Чекбокс */}
      <Checkbox
        checked={todo.done}
        onCheckedChange={(checked) => toggleDone(todo.id, checked as boolean)}
      />

      {/* Основной контент */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium truncate ${todo.done ? 'line-through text-muted-foreground' : ''}`}
          >
            {todo.name}
          </span>
          {todo.is_private && (
            <Lock className="h-3 w-3 text-muted-foreground shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
          {/* Цвет создателя */}
          <span className="flex items-center gap-1">
            {todo.creator_color && (
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: todo.creator_color }}
              />
            )}
            {todo.user_name}
          </span>
          <span>{formatDate(todo.created_at)}</span>
          {todo.done && todo.completor_user_name && (
            <Badge variant="success" className="text-[10px] px-1.5 py-0">
              {todo.completor_color && (
                <span
                  className="inline-block h-2 w-2 rounded-full mr-1"
                  style={{ backgroundColor: todo.completor_color }}
                />
              )}
              {todo.completor_user_name}
            </Badge>
          )}
        </div>
      </div>

      {/* Действия */}
      {isOwner && (
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(todo)}
            title="Редактировать"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleDelete}
            disabled={deleting}
            title="Удалить"
            className="text-destructive hover:text-destructive hover:bg-destructive-10"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  )
}
