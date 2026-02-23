import { useEffect, useState } from 'react'
import { useTodoStore } from '@/store/todoStore'
import { AppLayout } from '@/components/layout/AppLayout'
import { TodoList } from '@/components/todo/TodoList'
import { TodoFilter } from '@/components/todo/TodoFilter'
import { TodoForm } from '@/components/todo/TodoForm'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import type { TodoResponse } from '@/types'

export function TodoPage() {
  const { loadLists, currentList } = useTodoStore()
  const [showTodoForm, setShowTodoForm] = useState(false)
  const [editingTodo, setEditingTodo] = useState<TodoResponse | null>(null)

  useEffect(() => {
    loadLists()
  }, [loadLists])

  const handleEditTodo = (todo: TodoResponse) => {
    setEditingTodo(todo)
    setShowTodoForm(true)
  }

  const handleCloseTodoForm = (open: boolean) => {
    setShowTodoForm(open)
    if (!open) setEditingTodo(null)
  }

  return (
    <AppLayout>
      {currentList ? (
        <>
          {/* Панель фильтров и кнопка добавления */}
          <div className="flex items-center justify-between mb-4">
            <TodoFilter />
            <Button onClick={() => setShowTodoForm(true)} size="sm">
              <Plus className="h-4 w-4" />
              Добавить
            </Button>
          </div>

          {/* Список задач */}
          <TodoList onEditTodo={handleEditTodo} />

          {/* Форма создания/редактирования задачи */}
          <TodoForm
            open={showTodoForm}
            onOpenChange={handleCloseTodoForm}
            editingTodo={editingTodo}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-2">У вас нет списков задач</p>
          <p className="text-muted-foreground text-sm">
            Создайте новый список или вступите в существующий через меню управления списками
          </p>
        </div>
      )}
    </AppLayout>
  )
}
