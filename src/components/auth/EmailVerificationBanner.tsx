import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { resendVerification, changeEmail } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { AlertTriangle, Send, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import type { ApiError } from '@/types'
import axios from 'axios'

export function EmailVerificationBanner() {
  const { user, updateUser } = useAuthStore()
  const [resendLoading, setResendLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [showChangeDialog, setShowChangeDialog] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [changeLoading, setChangeLoading] = useState(false)
  const [changeError, setChangeError] = useState('')

  // Не показываем баннер если email подтверждён или нет данных
  if (!user || user.email_verified !== false) return null

  const handleResend = async () => {
    setResendLoading(true)
    try {
      await resendVerification()
      setSent(true)
      toast.success('Письмо отправлено на ' + user.email)
    } catch {
      toast.error('Не удалось отправить письмо')
    } finally {
      setResendLoading(false)
    }
  }

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setChangeError('')

    if (!newEmail.trim()) {
      setChangeError('Введите email')
      return
    }

    setChangeLoading(true)
    try {
      await changeEmail(newEmail.trim())
      updateUser({ ...user, email: newEmail.trim() })
      setShowChangeDialog(false)
      setNewEmail('')
      setSent(false)
      toast.success('Письмо подтверждения отправлено на ' + newEmail.trim())
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const apiError = err.response.data as ApiError
        setChangeError(apiError.message || 'Не удалось изменить email')
      } else {
        setChangeError('Ошибка подключения к серверу')
      }
    } finally {
      setChangeLoading(false)
    }
  }

  return (
    <>
      <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 flex items-center gap-3 text-sm mb-4">
        <AlertTriangle className="h-4 w-4 text-accent shrink-0" />
        <span className="flex-1">
          Email не подтверждён. Проверьте почту <strong>{user.email}</strong>
        </span>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => { setShowChangeDialog(true); setNewEmail(''); setChangeError('') }}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground hover:underline font-medium"
          >
            <Pencil className="h-3 w-3" />
            Изменить
          </button>
          {!sent ? (
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="flex items-center gap-1 text-primary hover:underline font-medium disabled:opacity-50"
            >
              <Send className="h-3 w-3" />
              {resendLoading ? 'Отправка...' : 'Отправить повторно'}
            </button>
          ) : (
            <span className="text-success font-medium">Отправлено</span>
          )}
        </div>
      </div>

      <Dialog open={showChangeDialog} onOpenChange={setShowChangeDialog}>
        <DialogContent onClose={() => setShowChangeDialog(false)}>
          <DialogHeader>
            <DialogTitle>Изменить email</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleChangeEmail}>
            <div className="space-y-4">
              {changeError && (
                <div className="rounded-md bg-destructive-10 p-3 text-sm text-destructive">
                  {changeError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="new-email">Новый email</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="user@example.com"
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowChangeDialog(false)}>
                Отмена
              </Button>
              <Button type="submit" disabled={changeLoading}>
                {changeLoading ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
