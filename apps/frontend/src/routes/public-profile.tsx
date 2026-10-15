import { useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, Heart, MapPin, TrendingUp } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AuthRequiredDialog } from '@/components/AuthRequiredDialog'
import { Button } from '@/components/ui/button'
import { ContinentBarChart } from '@/components/charts/ContinentBarChart'
import { ContinentStatsCard } from '@/components/ContinentStatsCard'
import { WorldMapCard } from '@/components/charts/WorldMapCard'
import { WorldPercentChart } from '@/components/charts/WorldPercentChart'
import { useAuth } from '@/context/AuthContext'
import { usePublicProfile } from '@/hooks/usePublicProfile'
import { getCountryFlag } from '@/lib/flags'

export function PublicProfilePage() {
  const { id } = useParams({ from: '/profile/$id' })
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [dismissed, setDismissed] = useState(false)
  const authModalOpen = !authLoading && !isAuthenticated && !dismissed
  const { data, isLoading } = usePublicProfile(id)

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
        <p className="text-sm animate-pulse" style={{ color: '#7c8194' }}>Carregando...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
          <div className="max-w-sm text-center flex flex-col items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: '#1e2029' }}
            >
              🌍
            </div>
            <h1
              className="text-2xl font-normal"
              style={{ color: '#f0f2f8' }}
            >
              Conteúdo protegido
            </h1>
            <p className="text-sm" style={{ color: '#7c8194' }}>
              Crie uma conta gratuita para ver perfis de viajantes e descobrir destinos.
            </p>
            <Link to="/register">
              <Button
                className="rounded-full px-6 font-semibold"
                style={{ background: 'linear-gradient(135deg, #4f8ef7, #7dd3fc)', color: '#0e0f14' }}
              >
                Criar conta
              </Button>
            </Link>
          </div>
        </div>
        <AuthRequiredDialog
          open={authModalOpen}
          onOpenChange={() => setDismissed(true)}
          title="Faça login para ver este perfil"
          description="Este link leva a um perfil de viagens no EasyTrip. Crie uma conta para descobrir países, estatísticas e recomendações."
        />
      </>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="et-shimmer h-48 rounded-xl" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 text-center flex flex-col items-center gap-4">
        <p className="text-sm" style={{ color: '#7c8194' }}>Perfil não encontrado.</p>
        <Link to="/">
          <Button variant="outline" size="sm">Voltar ao início</Button>
        </Link>
      </div>
    )
  }

  const initials = data.email.slice(0, 2).toUpperCase()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs w-fit transition-colors"
        style={{ color: '#7c8194' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#f0f2f8' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#7c8194' }}
      >
        <ArrowLeft size={13} /> Voltar
      </Link>

      {/* Profile card */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: '#16181f', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div
          className="h-20 w-full"
          style={{ background: 'linear-gradient(135deg, rgba(79,142,247,0.2) 0%, rgba(125,211,252,0.08) 100%)' }}
        />
        <div className="px-5 pb-5 -mt-8 flex flex-col sm:flex-row sm:items-end gap-4">
          <Avatar className="h-16 w-16 ring-4" style={{ ringColor: '#16181f' }}>
            <AvatarFallback
              className="text-lg font-semibold"
              style={{ background: '#22252f', color: '#7dd3fc' }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="sm:mb-1 flex-1">
            <h1
              className="text-xl font-normal"
              style={{ color: '#f0f2f8' }}
            >
              {data.email}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: '#7c8194' }}>
              No EasyTrip desde {new Date(data.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-px border-t" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.06)' }}>
          <div className="flex flex-col items-center gap-1 py-4" style={{ background: '#16181f' }}>
            <span className="text-2xl font-light" style={{ color: '#f0f2f8' }}>{data.totalVisited}</span>
            <span className="flex items-center gap-1 text-[11px]" style={{ color: '#7dd3fc' }}><TrendingUp size={11} /> visitados</span>
          </div>
          <div className="flex flex-col items-center gap-1 py-4" style={{ background: '#16181f' }}>
            <span className="text-2xl font-light" style={{ color: '#f0f2f8' }}>{data.totalWishlist}</span>
            <span className="flex items-center gap-1 text-[11px]" style={{ color: '#f87171' }}><Heart size={11} /> favoritos</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <WorldPercentChart totalVisited={data.totalVisited} />
        <ContinentBarChart perContinent={data.perContinent} />
      </div>

      <WorldMapCard visited={data.visited} heading="Mapa de viagens" />
      <ContinentStatsCard data={data} heading="Pegada global" />

      {/* Visited */}
      <div className="et-card p-5 flex flex-col gap-4">
        <h2
          className="text-lg font-normal"
          style={{ color: '#f0f2f8' }}
        >
          Países visitados
        </h2>
        {data.visited.length === 0
          ? <p className="text-sm" style={{ color: '#7c8194' }}>Ainda sem países visitados.</p>
          : (
            <div className="flex flex-wrap gap-2">
              {data.visited.map((v) => (
                <span key={v.cca2} className="et-chip" style={{ cursor: 'default' }}>
                  <span>{getCountryFlag(v.countryName)}</span>
                  {v.countryName}
                </span>
              ))}
            </div>
          )
        }
      </div>

      {/* Wishlist */}
      <div className="et-card p-5 flex flex-col gap-4">
        <h2
          className="text-lg font-normal flex items-center gap-2"
          style={{ color: '#f0f2f8' }}
        >
          <MapPin size={16} style={{ color: '#7dd3fc' }} /> Favoritos
        </h2>
        {data.wishlist.length === 0
          ? <p className="text-sm" style={{ color: '#7c8194' }}>Sem favoritos ainda.</p>
          : (
            <div className="flex flex-wrap gap-2">
              {data.wishlist.map((w) => (
                <span key={w.cca2} className="et-chip" style={{ cursor: 'default' }}>
                  <span>{getCountryFlag(w.countryName)}</span>
                  {w.countryName}
                </span>
              ))}
            </div>
          )
        }
      </div>
    </div>
  )
}
