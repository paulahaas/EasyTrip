import { Navigate } from '@tanstack/react-router'
import { Globe2, Heart, History, Map, MapPin, TrendingUp } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ContinentBarChart } from '@/components/charts/ContinentBarChart'
import { ContinentStatsCard } from '@/components/ContinentStatsCard'
import { ProfileHistoryList } from '@/components/ProfileHistoryList'
import { ShareProfileButton } from '@/components/ShareProfileButton'
import { VisitedSection } from '@/components/VisitedSection'
import { WishlistSection } from '@/components/WishlistSection'
import { WorldMapCard } from '@/components/charts/WorldMapCard'
import { WorldPercentChart } from '@/components/charts/WorldPercentChart'
import { useAuth } from '@/context/AuthContext'
import { useContinentStats } from '@/hooks/useContinentStats'
import { useVisited } from '@/hooks/useVisited'
import { useWishlist } from '@/hooks/useWishlist'

export function ProfilePage() {
  const { isAuthenticated, loading, user } = useAuth()
  const stats   = useContinentStats()
  const visited = useVisited()
  const wishlist = useWishlist()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
        <p className="text-sm animate-pulse" style={{ color: '#7c8194' }}>Carregando...</p>
      </div>
    )
  }
  if (!isAuthenticated || !user) return <Navigate to="/login" />

  const initials     = user.email.slice(0, 2).toUpperCase()
  const totalVisited = stats.data?.totalVisited ?? visited.items.length
  const continentsVisited = stats.data?.perContinent.filter((c) => c.visited > 0).length ?? 0

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
      {/* ── Profile hero card ── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: '#16181f', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* Gradient banner */}
        <div
          className="h-24 w-full"
          style={{ background: 'linear-gradient(135deg, rgba(79,142,247,0.25) 0%, rgba(125,211,252,0.12) 50%, rgba(22,24,31,0) 100%)' }}
        />

        {/* Profile content */}
        <div className="px-5 pb-5 -mt-10 flex flex-col sm:flex-row sm:items-end gap-4">
          <Avatar className="h-20 w-20 ring-4 shrink-0" style={{ ringColor: '#16181f' }}>
            <AvatarFallback
              className="text-xl font-semibold"
              style={{ background: 'linear-gradient(135deg, #1e2029, #22252f)', color: '#7dd3fc' }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 sm:mb-2">
            <h1
              className="text-xl sm:text-2xl font-normal leading-tight"
              style={{ color: '#f0f2f8' }}
            >
              {user.email.split('@')[0]}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: '#7c8194' }}>
              {user.email}
              {user.role === 'ADMIN' && <span style={{ color: '#7dd3fc' }}> · administrador</span>}
              {' · '}membro desde{' '}
              {new Date(user.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="sm:mb-2">
            <ShareProfileButton userId={user.id} />
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-px border-t" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.06)' }}>
          <QuickStat icon={<TrendingUp size={15} />} label="Visitados"   value={totalVisited}       color="#7dd3fc" />
          <QuickStat icon={<Heart size={15} />}      label="Favoritos"   value={wishlist.items.length} color="#f87171" />
          <QuickStat icon={<MapPin size={15} />}     label="Continentes" value={continentsVisited}   color="#4f8ef7" />
        </div>
      </div>

      {/* ── Tabs ── */}
      <Tabs defaultValue="overview">
        <TabsList
          className="w-full sm:w-auto flex gap-0.5 p-1 rounded-lg h-auto"
          style={{ background: '#16181f', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {[
            { value: 'overview', label: 'Visão geral', icon: <Globe2 size={13} /> },
            { value: 'map',      label: 'Mapa',        icon: <Map size={13} /> },
            { value: 'wishlist', label: 'Favoritos',   icon: <Heart size={13} /> },
            { value: 'visited',  label: 'Visitados',   icon: <TrendingUp size={13} /> },
            { value: 'history',  label: 'Histórico',   icon: <History size={13} /> },
          ].map(({ value, label, icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md data-[state=active]:text-foreground"
            >
              {icon}
              <span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="flex flex-col gap-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <WorldPercentChart totalVisited={totalVisited} />
            {stats.data && <ContinentBarChart perContinent={stats.data.perContinent} />}
          </div>
          <ContinentStatsCard />
        </TabsContent>

        <TabsContent value="map" className="mt-4">
          <WorldMapCard visited={visited.items} />
        </TabsContent>

        <TabsContent value="wishlist" className="mt-4">
          <WishlistSection />
        </TabsContent>

        <TabsContent value="visited" className="mt-4">
          <VisitedSection />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <ProfileHistoryList />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function QuickStat({
  icon, label, value, color,
}: {
  icon: React.ReactNode
  label: string
  value: number
  color: string
}) {
  return (
    <div
      className="flex flex-col items-center gap-1 py-4"
      style={{ background: '#16181f' }}
    >
      <span className="text-2xl sm:text-3xl font-light" style={{ color: '#f0f2f8' }}>
        {value}
      </span>
      <span className="flex items-center gap-1 text-[11px] font-medium" style={{ color }}>
        {icon} {label}
      </span>
    </div>
  )
}
