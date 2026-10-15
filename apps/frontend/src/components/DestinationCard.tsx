import { Check, Heart, HeartOff, Undo2 } from 'lucide-react'
import type { DestinationResponse } from '@easytrip/shared'
import { Button } from '@/components/ui/button'
import { InfoGrid } from '@/components/InfoGrid'
import { WeatherRow } from '@/components/WeatherRow'
import { ExchangeHighlight } from '@/components/ExchangeHighlight'
import { useAuth } from '@/context/AuthContext'
import { useVisited } from '@/hooks/useVisited'
import { useWishlist } from '@/hooks/useWishlist'

interface DestinationCardProps {
  data: DestinationResponse
}

export function DestinationCard({ data }: DestinationCardProps) {
  const { destino, informacoesDoPais, clima, cambio, geradoEm } = data
  const { isAuthenticated } = useAuth()
  const wishlist = useWishlist()
  const visited = useVisited()

  const cca2 = informacoesDoPais.cca2?.toUpperCase() ?? ''
  const flagUrl = cca2 ? `https://flagcdn.com/w640/${cca2.toLowerCase()}.png` : ''
  const flagThumb = cca2 ? `https://flagcdn.com/w320/${cca2.toLowerCase()}.png` : ''

  const inWishlist = cca2 ? wishlist.items.some((i) => i.cca2 === cca2) : false
  const inVisited  = cca2 ? visited.items.some((i) => i.cca2 === cca2) : false

  async function toggleWishlist() {
    if (!cca2) return
    if (inWishlist) {
      await wishlist.remove(cca2)
    } else {
      await wishlist.add({ cca2, countryName: destino, continent: informacoesDoPais.continente })
    }
  }

  async function toggleVisited() {
    if (!cca2) return
    if (inVisited) {
      await visited.remove(cca2)
    } else {
      await visited.add({ cca2, countryName: destino, continent: informacoesDoPais.continente })
    }
  }

  return (
    <div
      className="animate-fade-up rounded-xl overflow-hidden"
      style={{ background: '#16181f', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* ── Hero header with blurred flag background ── */}
      <div className="relative h-36 overflow-hidden">
        {flagUrl && (
          <>
            {/* Blurred background */}
            <img
              src={flagUrl}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'blur(18px) brightness(0.2)', transform: 'scale(1.25)' }}
            />
            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to right, rgba(22,24,31,0.6) 0%, transparent 60%, rgba(22,24,31,0.6) 100%)' }}
            />
          </>
        )}

        {/* Content over hero */}
        <div className="absolute inset-0 flex items-center px-5 gap-4">
          {flagThumb && (
            <img
              src={flagThumb}
              alt={`Bandeira de ${destino}`}
              className="et-flag h-14 w-auto shrink-0"
              style={{ border: '2px solid rgba(255,255,255,0.15)', borderRadius: '0.375rem' }}
            />
          )}
          <div className="flex-1 min-w-0">
            <h2
              className="text-2xl sm:text-3xl font-normal leading-tight truncate"
              style={{ color: '#f0f2f8' }}
            >
              {destino}
            </h2>
            <p
              className="text-xs uppercase tracking-widest mt-1"
              style={{ color: 'rgba(240,242,248,0.5)' }}
            >
              {informacoesDoPais.continente}
            </p>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-5 flex flex-col gap-4">
        <InfoGrid info={informacoesDoPais} />

        <ExchangeHighlight cambio={cambio} />
        <WeatherRow clima={clima} capital={informacoesDoPais.capital} />

        {isAuthenticated && (
          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              size="sm"
              variant="outline"
              onClick={toggleWishlist}
              disabled={!cca2}
              className="gap-1.5 text-xs h-8 cursor-pointer rounded-full"
              style={inWishlist
                ? { background: 'rgba(248,113,113,0.1)', borderColor: 'rgba(248,113,113,0.3)', color: '#f87171' }
                : { borderColor: 'rgba(255,255,255,0.1)', color: '#7c8194' }
              }
            >
              {inWishlist
                ? <><HeartOff size={13} /> Remover dos favoritos</>
                : <><Heart size={13} /> Favoritar</>
              }
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={toggleVisited}
              disabled={!cca2}
              className="gap-1.5 text-xs h-8 cursor-pointer rounded-full"
              style={inVisited
                ? { background: 'rgba(52,211,153,0.1)', borderColor: 'rgba(52,211,153,0.3)', color: '#34d399' }
                : { borderColor: 'rgba(255,255,255,0.1)', color: '#7c8194' }
              }
            >
              {inVisited
                ? <><Undo2 size={13} /> Desmarcar</>
                : <><Check size={13} /> Marcar como visitado</>
              }
            </Button>
          </div>
        )}

        <p className="text-[11px] text-right" style={{ color: '#4e5468' }}>
          Atualizado em {geradoEm}
        </p>
      </div>
    </div>
  )
}
