import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
      <div className="max-w-sm text-center flex flex-col items-center gap-4">
        <div className="et-label">Erro 404</div>
        <h1 className="text-3xl font-normal text-foreground">Página não encontrada</h1>
        <p className="text-sm text-muted">O endereço que você abriu não existe no EasyTrip.</p>
        <Link to="/">
          <Button className="rounded-full px-6 font-semibold bg-gradient-accent text-background">
            Voltar ao início
          </Button>
        </Link>
      </div>
    </div>
  )
}
