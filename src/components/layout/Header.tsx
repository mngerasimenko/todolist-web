import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useTodoStore } from '@/store/todoStore'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { ListManagement } from '@/components/lists/ListManagement'
import { LogOut, Settings, User } from 'lucide-react'

export function Header() {
  const { user, logout } = useAuthStore()
  const { lists, currentList, selectList, reset } = useTodoStore()
  const [showListManagement, setShowListManagement] = useState(false)

  const handleLogout = () => {
    logout()
    reset()
  }

  const handleListChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const listId = Number(e.target.value)
    const list = lists.find((l) => l.id === listId)
    if (list) selectList(list)
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-card shadow-sm">
        <div className="mx-auto max-w-4xl flex items-center justify-between h-14 px-4">
          {/* Левая часть: пользователь и выбор списка */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{user?.name}</span>
            </div>

            {lists.length > 0 && (
              <Select
                value={currentList?.id?.toString() || ''}
                onChange={handleListChange}
                className="w-40 h-8 text-sm"
              >
                {lists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
              </Select>
            )}
          </div>

          {/* Правая часть: управление списками и выход */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowListManagement(true)}
              title="Управление списками"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleLogout}
              title="Выйти"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <ListManagement
        open={showListManagement}
        onOpenChange={setShowListManagement}
      />
    </>
  )
}
