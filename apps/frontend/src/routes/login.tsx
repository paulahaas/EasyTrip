import { Link, Navigate, useNavigate } from '@tanstack/react-router'
import { Plane } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { LoginForm } from '@/components/LoginForm'

export function LoginPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) return <Navigate to="/buscar" />

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm flex flex-col gap-6 animate-fade-up">
        {/* Brand mark */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent2))' }}
          >
            <Plane size={20} color="var(--color-background)" strokeWidth={2.5} />
          </div>
          <div>
            <h1
              className="text-2xl font-normal"
              style={{ color: 'var(--color-foreground)' }}
            >
              Bem-vindo de volta
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-muted)' }}>
              Entre para continuar explorando
            </p>
          </div>
        </div>

        {/* Card */}
        <div
          className="et-card p-6 flex flex-col gap-5"
        >
          <LoginForm onSuccess={() => navigate({ to: '/buscar' })} />
          <p className="text-xs text-center" style={{ color: 'var(--color-muted)' }}>
            Sem conta?{' '}
            <Link to="/register" style={{ color: 'var(--color-accent)' }} className="font-medium hover:underline">
              Criar agora
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
