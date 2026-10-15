import { Link, useNavigate } from '@tanstack/react-router'
import { Plane } from 'lucide-react'
import { LoginForm } from '@/components/LoginForm'

export function LoginPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm flex flex-col gap-6 animate-fade-up">
        {/* Brand mark */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #4f8ef7, #7dd3fc)' }}
          >
            <Plane size={20} color="#0e0f14" strokeWidth={2.5} />
          </div>
          <div>
            <h1
              className="text-2xl font-normal"
              style={{ color: '#f0f2f8' }}
            >
              Bem-vindo de volta
            </h1>
            <p className="text-sm mt-0.5" style={{ color: '#7c8194' }}>
              Entre para continuar explorando
            </p>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-xl p-6 flex flex-col gap-5"
          style={{ background: '#16181f', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <LoginForm onSuccess={() => navigate({ to: '/' })} />
          <p className="text-xs text-center" style={{ color: '#7c8194' }}>
            Sem conta?{' '}
            <Link to="/register" style={{ color: '#4f8ef7' }} className="font-medium hover:underline">
              Criar agora
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
