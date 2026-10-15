import { useState, type FormEvent } from 'react'
import { loginSchema } from '@easytrip/shared'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const parsed = loginSchema.safeParse({ login: identifier, password })
    if (!parsed.success) {
      setError('Usuário ou senha inválidos')
      return
    }
    setSubmitting(true)
    try {
      await login(parsed.data)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no login')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label
          htmlFor="login-identifier"
          className="text-xs uppercase tracking-wider"
          style={{ color: '#7c8194' }}
        >
          Email ou nome de usuário
        </label>
        <Input
          id="login-identifier"
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="login-password"
          className="text-xs uppercase tracking-wider"
          style={{ color: '#7c8194' }}
        >
          Senha
        </label>
        <Input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          minLength={6}
          required
        />
      </div>
      {error && (
        <Alert
          className="border-0"
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.25)',
            color: '#f87171',
          }}
        >
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}
      <Button
        type="submit"
        disabled={submitting}
        style={{
          background: 'linear-gradient(135deg, #4f8ef7, #7dd3fc)',
          color: '#0e0f14',
        }}
      >
        {submitting ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  )
}
