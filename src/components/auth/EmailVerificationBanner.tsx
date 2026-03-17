import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { resendVerification } from '@/api/auth'
import { AlertTriangle, Send } from 'lucide-react'
import { toast } from 'sonner'

export function EmailVerificationBanner() {
  const user = useAuthStore((s) => s.user)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  // Не показываем баннер если email подтверждён или нет данных
  if (!user || user.email_verified !== false) return null

  const handleResend = async () => {
    setLoading(true)
    try {
      await resendVerification()
      setSent(true)
      toast.success('Письмо отправлено на ' + user.email)
    } catch {
      toast.error('Не удалось отправить письмо')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 flex items-center gap-3 text-sm">
      <AlertTriangle className="h-4 w-4 text-accent shrink-0" />
      <span className="flex-1">
        Email не подтверждён. Проверьте почту <strong>{user.email}</strong>
      </span>
      {!sent ? (
        <button
          onClick={handleResend}
          disabled={loading}
          className="flex items-center gap-1 text-primary hover:underline font-medium disabled:opacity-50 shrink-0"
        >
          <Send className="h-3 w-3" />
          {loading ? 'Отправка...' : 'Отправить повторно'}
        </button>
      ) : (
        <span className="text-success font-medium shrink-0">Отправлено</span>
      )}
    </div>
  )
}
