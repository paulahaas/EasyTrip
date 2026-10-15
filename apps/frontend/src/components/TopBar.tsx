import { Link, useNavigate } from '@tanstack/react-router'
import { LogOut, Plane, User } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'

export function TopBar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate({ to: '/' })
  }

  const initials = user?.email.slice(0, 2).toUpperCase() ?? '??'

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(14,15,20,0.9)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderColor: 'rgba(255,255,255,0.07)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shadow-md"
            style={{ background: 'linear-gradient(135deg, #4f8ef7, #7dd3fc)' }}
          >
            <Plane size={14} color="#0e0f14" strokeWidth={2.5} />
          </div>
          <span
            className="text-base font-semibold tracking-tight hidden sm:inline"
            style={{ color: '#f0f2f8' }}
          >
            EasyTrip
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="flex items-center gap-2 px-2 py-1 rounded-lg transition-colors hover:bg-white/5">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-[10px] font-semibold" style={{ background: '#1e2029', color: '#7dd3fc' }}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm hidden sm:inline" style={{ color: '#f0f2f8' }}>
                  {user?.email.split('@')[0]}
                </span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-1.5 text-xs"
                style={{ color: '#7c8194' }}
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs" style={{ color: '#7c8194' }}>
                  <User size={13} />
                  Entrar
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="sm"
                  className="text-xs font-semibold h-8 px-4 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #4f8ef7, #7dd3fc)', color: '#0e0f14' }}
                >
                  Criar conta
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
