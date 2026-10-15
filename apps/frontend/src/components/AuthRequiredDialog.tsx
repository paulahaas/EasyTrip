import { Link, useNavigate } from '@tanstack/react-router'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface AuthRequiredDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
}

export function AuthRequiredDialog({
  open,
  onOpenChange,
  title = 'Conteúdo exclusivo para membros',
  description = 'Para ver perfis compartilhados, recomendações e estatísticas, crie uma conta gratuita ou faça login.',
}: AuthRequiredDialogProps) {
  const navigate = useNavigate()

  function go(path: '/login' | '/register') {
    onOpenChange(false)
    navigate({ to: path })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
            style={{
              background: 'rgba(79,142,247,0.15)',
              border: '1px solid rgba(79,142,247,0.3)',
            }}
          >
            <Lock size={20} color="#4f8ef7" />
          </div>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => go('/login')}>
            Já tenho conta
          </Button>
          <Button
            onClick={() => go('/register')}
            style={{
              background: 'linear-gradient(135deg, #4f8ef7, #7dd3fc)',
              color: '#0e0f14',
            }}
          >
            Criar conta grátis
          </Button>
        </DialogFooter>
        <p className="text-xs text-center" style={{ color: '#7c8194' }}>
          Ou{' '}
          <Link to="/" style={{ color: '#4f8ef7' }}>
            voltar ao início
          </Link>
        </p>
      </DialogContent>
    </Dialog>
  )
}
