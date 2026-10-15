import { useState, type FormEvent } from 'react'
import { registerSchema } from '@easytrip/shared'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'

interface RegisterFormProps {
  onSuccess?: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }
    const parsed = registerSchema.safeParse({ email, password })
    if (!parsed.success) {
      setError('Email inválido ou senha precisa ter 6+ caracteres')
      return
    }
    setSubmitting(true)
    try {
      await register(parsed.data)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no cadastro')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label
          htmlFor="register-email"
          className="text-xs uppercase tracking-wider"
          style={{ color: '#7c8194' }}
        >
          Email
        </label>
        <Input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="register-password"
          className="text-xs uppercase tracking-wider"
          style={{ color: '#7c8194' }}
        >
          Senha
        </label>
        <Input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          minLength={6}
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="register-confirm-password"
          className="text-xs uppercase tracking-wider"
          style={{ color: '#7c8194' }}
        >
          Confirmar senha
        </label>
        <Input
          id="register-confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
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
        {submitting ? 'Criando...' : 'Criar conta'}
      </Button>
    </form>
  )
}
