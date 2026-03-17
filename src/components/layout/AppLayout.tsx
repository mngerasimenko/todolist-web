import { type ReactNode } from 'react'
import { Header } from './Header'
import { EmailVerificationBanner } from '@/components/auth/EmailVerificationBanner'

interface AppLayoutProps {
  children: ReactNode
}

// Основной layout с хедером для аутентифицированных пользователей
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <EmailVerificationBanner />
        {children}
      </main>
    </div>
  )
}
