import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import type { ApiError } from '@/types'
import axios from 'axios'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Введите email')
      return
    }

    setLoading(true)
    try {
      await forgotPassword({ email: email.trim() })
      setSent(true)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const apiError = err.response.data as ApiError
        setError(apiError.message || 'Ошибка отправки')
      } else {
        setError('Ошибка подключения к серверу')
      }
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Проверьте почту</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 py-6">
            <CheckCircle className="h-12 w-12 text-success" />
            <p className="text-center text-muted-foreground">
              Если аккаунт с email <strong>{email}</strong> существует, мы отправили письмо со ссылкой для сброса пароля.
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Link to="/login">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4" />
                Назад
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Сброс пароля</CardTitle>
          <CardDescription>Введите email, указанный при регистрации</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive-10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                autoComplete="email"
                autoFocus
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <Button type="submit" className="w-full" disabled={loading}>
              <Mail className="h-4 w-4" />
              {loading ? 'Отправка...' : 'Отправить ссылку'}
            </Button>
            <Link to="/login" className="text-sm text-primary hover:underline">
              <span className="flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" />
                Назад
              </span>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
