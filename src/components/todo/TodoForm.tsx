import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useTodoStore } from '@/store/todoStore'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import * as todosApi from '@/api/todos'
import type { TodoResponse, ApiError } from '@/types'
import axios from 'axios'

interface TodoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingTodo: TodoResponse | null
}

export function TodoForm({ open, onOpenChange, editingTodo }: TodoFormProps) {
  const [name, setName] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const user = useAuthStore((s) => s.user)
  const { currentList, addTodo, updateTodo } = useTodoStore()

  const isEditing = editingTodo !== null

  useEffect(() => {
    if (editingTodo) {
      setName(editingTodo.name)
      setIsPrivate(editingTodo.is_private)
    } else {
      setName('')
      setIsPrivate(false)
    }
    setError('')
  }, [editingTodo, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Введите название задачи')
      return
    }

    if (!user || !currentList) return

    setLoading(true)
    try {
      if (isEditing && editingTodo) {
        const updated = await todosApi.updateTodo(editingTodo.id, {
          name: name.trim(),
          user_id: editingTodo.user_id,
          list_id: editingTodo.list_id,
          is_private: isPrivate,
          done: editingTodo.done,
        })
        updateTodo(updated)
      } else {
        const created = await todosApi.createTodo({
          name: name.trim(),
          user_id: user.id,
          list_id: currentList.id,
          is_private: isPrivate,
        })
        addTodo(created)
      }
      onOpenChange(false)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const apiError = err.response.data as ApiError
        setError(apiError.message || 'Ошибка сохранения')
      } else {
        setError('Ошибка подключения к серверу')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Редактировать задачу' : 'Новая задача'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive-10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="todo-name">Название</Label>
              <Input
                id="todo-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Что нужно сделать?"
                autoFocus
                minLength={2}
                maxLength={120}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="todo-private"
                checked={isPrivate}
                onCheckedChange={(checked) => setIsPrivate(checked as boolean)}
              />
              <Label htmlFor="todo-private" className="cursor-pointer">
                Приватная задача
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Сохранение...' : isEditing ? 'Сохранить' : 'Создать'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
