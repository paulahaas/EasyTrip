import { Globe } from 'lucide-react'

export function AppHeader() {
  return (
    <div className="text-center mb-10 pt-4">
      <div
        className="inline-flex items-center gap-1.5 mb-5 px-3 py-1 rounded-full text-xs font-medium"
        style={{
          background: 'rgba(79,142,247,0.1)',
          color: '#7dd3fc',
          border: '1px solid rgba(79,142,247,0.2)',
        }}
      >
        <Globe size={11} />
        250+ países indexados
      </div>

      <h1
        className="text-5xl sm:text-6xl leading-tight tracking-tight mb-3"
        style={{
          color: '#f0f2f8',
          fontWeight: 400,
        }}
      >
        Explore o mundo
      </h1>

      <p
        className="text-sm sm:text-base mx-auto"
        style={{ color: '#7c8194', maxWidth: '380px', lineHeight: 1.6 }}
      >
        Busque destinos por clima, idioma, região e muito mais
      </p>
    </div>
  )
}
