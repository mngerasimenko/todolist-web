import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { verifyEmail } from '@/api/auth'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import type { ApiError } from '@/types'
import axios from 'axios'

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const { isAuthenticated, user, updateUser } = useAuthStore()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Ссылка недействительна — отсутствует токен')
      return
    }

    verifyEmail({ token })
      .then((res) => {
        setStatus('success')
        setMessage(res.message)
        // Обновляем статус верификации в store, чтобы баннер исчез
        if (user) {
          updateUser({ ...user, email_verified: true })
        }
      })
      .catch((err) => {
        setStatus('error')
        if (axios.isAxiosError(err) && err.response?.data) {
          const apiError = err.response.data as ApiError
          setMessage(apiError.message || 'Не удалось подтвердить email')
        } else {
          setMessage('Ошибка подключения к серверу')
        }
      })
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Подтверждение email</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 py-6">
          {status === 'loading' && (
            <>
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-muted-foreground">Проверяем ссылку...</p>
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 text-success" />
              <p className="text-center font-medium">{message}</p>
            </>
          )}
          {status === 'error' && (
            <>
              <XCircle className="h-12 w-12 text-destructive" />
              <p className="text-center font-medium text-destructive">{message}</p>
            </>
          )}
        </CardContent>
        <CardFooter className="justify-center">
          <Link to={isAuthenticated ? '/' : '/login'}>
            <Button variant="outline">Продолжить</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
