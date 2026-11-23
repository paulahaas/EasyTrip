import { Navigate } from '@tanstack/react-router'
import { CalendarDays, Globe2, Heart, History, Map, MapPin, TrendingUp } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AchievementsCard } from '@/components/AchievementsCard'
import { ContinentBarChart } from '@/components/charts/ContinentBarChart'
import { ContinentStatsCard } from '@/components/ContinentStatsCard'
import { ProfileHistoryList } from '@/components/ProfileHistoryList'
import { ShareProfileButton } from '@/components/ShareProfileButton'
import { UsernameEditor } from '@/components/UsernameEditor'
import { TravelTimeline } from '@/components/TravelTimeline'
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
        <p className="text-sm animate-pulse" style={{ color: 'var(--color-muted)' }}>Carregando...</p>
      </div>
    )
  }
  if (!isAuthenticated || !user) return <Navigate to="/login" />

  const initials     = user.username.slice(0, 2).toUpperCase()
  const totalVisited = stats.data?.totalVisited ?? visited.items.length
  const continentsVisited = stats.data?.perContinent.filter((c) => c.visited > 0).length ?? 0

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
      {/* ── Profile hero card ── */}
      <div
        className="et-card overflow-hidden"
      >
        {/* Gradient banner */}
        <div
          className="h-24 w-full"
          style={{ background: 'linear-gradient(135deg, rgba(79,142,247,0.25) 0%, rgba(125,211,252,0.12) 50%, rgba(22,24,31,0) 100%)' }}
        />

        {/* Profile content */}
        <div className="px-5 pb-5 -mt-10 flex flex-col sm:flex-row sm:items-end gap-4">
          <Avatar className="h-20 w-20 ring-4 ring-[var(--color-surface)] shrink-0">
            <AvatarFallback
              className="text-xl font-semibold"
              style={{ background: 'linear-gradient(135deg, var(--color-surface2), var(--color-surface3))', color: 'var(--color-accent2)' }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 sm:mb-2">
            <UsernameEditor username={user.username} />
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
              {user.email}
              {user.role === 'ADMIN' && <span style={{ color: 'var(--color-accent2)' }}> · administrador</span>}
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
          <QuickStat icon={<TrendingUp size={15} />} label="Visitados"   value={totalVisited}       color="var(--color-accent2)" />
          <QuickStat icon={<Heart size={15} />}      label="Favoritos"   value={wishlist.items.length} color="var(--color-danger)" />
          <QuickStat icon={<MapPin size={15} />}     label="Continentes" value={continentsVisited}   color="var(--color-accent)" />
        </div>
      </div>

      {/* ── Tabs ── */}
      <Tabs defaultValue="overview">
        <TabsList
          className="et-card w-full sm:w-auto flex gap-0.5 p-1 h-auto"
        >
          {[
            { value: 'overview', label: 'Visão geral', icon: <Globe2 size={13} /> },
            { value: 'map',      label: 'Mapa',        icon: <Map size={13} /> },
            { value: 'wishlist', label: 'Favoritos',   icon: <Heart size={13} /> },
            { value: 'visited',  label: 'Visitados',   icon: <TrendingUp size={13} /> },
            { value: 'timeline', label: 'Linha do tempo', icon: <CalendarDays size={13} /> },
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
          <AchievementsCard visited={visited.items} />
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

        <TabsContent value="timeline" className="mt-4">
          <TravelTimeline visited={visited.items} />
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
      style={{ background: 'var(--color-surface)' }}
    >
      <span className="text-2xl sm:text-3xl font-light" style={{ color: 'var(--color-foreground)' }}>
        {value}
      </span>
      <span className="flex items-center gap-1 text-[11px] font-medium" style={{ color }}>
        {icon} {label}
      </span>
    </div>
  )
}
