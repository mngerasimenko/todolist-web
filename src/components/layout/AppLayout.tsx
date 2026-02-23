import { type ReactNode } from 'react'
import { Header } from './Header'

interface AppLayoutProps {
  children: ReactNode
}

// Основной layout с хедером для аутентифицированных пользователей
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
    </div>
  )
}
