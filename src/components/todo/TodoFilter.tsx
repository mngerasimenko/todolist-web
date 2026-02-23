import { useTodoStore } from '@/store/todoStore'
import { cn } from '@/lib/utils'

const filters = [
  { value: 'all' as const, label: 'Все' },
  { value: 'active' as const, label: 'Активные' },
  { value: 'done' as const, label: 'Выполненные' },
]

export function TodoFilter() {
  const { filter, setFilter, todos } = useTodoStore()

  const activeCount = todos.filter((t) => !t.done).length
  const doneCount = todos.filter((t) => t.done).length

  const getCounts = (value: string) => {
    if (value === 'all') return todos.length
    if (value === 'active') return activeCount
    return doneCount
  }

  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => setFilter(f.value)}
          className={cn(
            'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer',
            filter === f.value
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {f.label}
          <span className="text-xs opacity-60">({getCounts(f.value)})</span>
        </button>
      ))}
    </div>
  )
}
