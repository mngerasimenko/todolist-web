import { useState, useEffect } from 'react'
import { useTodoStore } from '@/store/todoStore'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as listsApi from '@/api/lists'
import type { ListMemberResponse, ApiError } from '@/types'
import axios from 'axios'
import { Users, Plus, LogIn, LogOut as LogOutIcon } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface ListManagementProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ListManagement({ open, onOpenChange }: ListManagementProps) {
  const [tab, setTab] = useState('create')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-md">
        <DialogHeader>
          <DialogTitle>Управление списками</DialogTitle>
        </DialogHeader>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full">
            <TabsTrigger value="create" className="flex-1">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Создать
            </TabsTrigger>
            <TabsTrigger value="join" className="flex-1">
              <LogIn className="h-3.5 w-3.5 mr-1" />
              Вступить
            </TabsTrigger>
            <TabsTrigger value="members" className="flex-1">
              <Users className="h-3.5 w-3.5 mr-1" />
              Участники
            </TabsTrigger>
            <TabsTrigger value="leave" className="flex-1">
              <LogOutIcon className="h-3.5 w-3.5 mr-1" />
              Покинуть
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <CreateListTab onClose={() => onOpenChange(false)} />
          </TabsContent>
          <TabsContent value="join">
            <JoinListTab onClose={() => onOpenChange(false)} />
          </TabsContent>
          <TabsContent value="members">
            <MembersTab />
          </TabsContent>
          <TabsContent value="leave">
            <LeaveListTab onClose={() => onOpenChange(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

// Вкладка создания списка
function CreateListTab({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { addList, selectList } = useTodoStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || !password.trim()) {
      setError('Заполните все поля')
      return
    }

    setLoading(true)
    try {
      const list = await listsApi.createList({ name: name.trim(), password })
      addList(list)
      selectList(list)
      onClose()
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data) {
        setError((err.response.data as ApiError).message || 'Ошибка создания')
      } else {
        setError('Ошибка подключения')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      {error && (
        <div className="rounded-md bg-destructive-10 p-3 text-sm text-destructive">{error}</div>
      )}
      <div className="space-y-2">
        <Label htmlFor="create-name">Название списка</Label>
        <Input
          id="create-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Мой список"
          autoFocus
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="create-password">Пароль списка</Label>
        <Input
          id="create-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль для вступления"
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Создание...' : 'Создать список'}
      </Button>
    </form>
  )
}

// Вкладка вступления в список
function JoinListTab({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { addList, selectList, lists } = useTodoStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || !password.trim()) {
      setError('Заполните все поля')
      return
    }

    setLoading(true)
    try {
      const list = await listsApi.joinList({ name: name.trim(), password })
      // Если список уже в списке — не добавляем повторно
      if (!lists.some((l) => l.id === list.id)) {
        addList(list)
      }
      selectList(list)
      onClose()
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data) {
        setError((err.response.data as ApiError).message || 'Ошибка вступления')
      } else {
        setError('Ошибка подключения')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      {error && (
        <div className="rounded-md bg-destructive-10 p-3 text-sm text-destructive">{error}</div>
      )}
      <div className="space-y-2">
        <Label htmlFor="join-name">Название списка</Label>
        <Input
          id="join-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Название существующего списка"
          autoFocus
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="join-password">Пароль списка</Label>
        <Input
          id="join-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль списка"
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Вступление...' : 'Вступить в список'}
      </Button>
    </form>
  )
}

// Вкладка участников текущего списка
function useMembersLoader(listId: number | undefined) {
  const [members, setMembers] = useState<ListMemberResponse[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!listId) return
    let cancelled = false
    const loadMembers = async () => {
      try {
        const data = await listsApi.getListMembers(listId)
        if (!cancelled) {
          setMembers(data)
          setLoading(false)
        }
      } catch {
        if (!cancelled) setLoading(false)
      }
    }
    loadMembers()
    return () => { cancelled = true }
  }, [listId])

  return { members, loading }
}

function MembersTab() {
  const { currentList } = useTodoStore()
  const { members, loading } = useMembersLoader(currentList?.id)

  if (!currentList) {
    return <p className="text-sm text-muted-foreground pt-4">Список не выбран</p>
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground pt-4">Загрузка...</p>
  }

  return (
    <div className="pt-2">
      <p className="text-sm text-muted-foreground mb-3">
        Список: <strong>{currentList.name}</strong>
      </p>
      <div className="space-y-2">
        {members.map((member) => (
          <div
            key={member.user_id}
            className="flex items-center justify-between rounded-md border border-border p-2.5"
          >
            <div>
              <span className="text-sm font-medium">{member.user_name}</span>
              <span className="text-xs text-muted-foreground ml-2">
                {member.role === 'ADMIN' ? 'Администратор' : 'Участник'}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{formatDate(member.joined_at)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Вкладка выхода из списка
function LeaveListTab({ onClose }: { onClose: () => void }) {
  const { currentList, removeList, loadLists } = useTodoStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLeave = async () => {
    if (!currentList) return
    if (!confirm(`Покинуть список "${currentList.name}"? Ваши приватные задачи будут удалены.`)) return

    setLoading(true)
    setError('')
    try {
      await listsApi.leaveList(currentList.id)
      removeList(currentList.id)
      await loadLists()
      onClose()
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data) {
        setError((err.response.data as ApiError).message || 'Ошибка')
      } else {
        setError('Ошибка подключения')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!currentList) {
    return <p className="text-sm text-muted-foreground pt-4">Список не выбран</p>
  }

  return (
    <div className="pt-2 space-y-4">
      {error && (
        <div className="rounded-md bg-destructive-10 p-3 text-sm text-destructive">{error}</div>
      )}
      <p className="text-sm">
        Вы уверены, что хотите покинуть список <strong>"{currentList.name}"</strong>?
      </p>
      <p className="text-sm text-muted-foreground">
        Все ваши приватные задачи в этом списке будут удалены.
      </p>
      <Button variant="destructive" className="w-full" onClick={handleLeave} disabled={loading}>
        {loading ? 'Выход...' : 'Покинуть список'}
      </Button>
    </div>
  )
}
