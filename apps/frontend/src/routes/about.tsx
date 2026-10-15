import { Code2, Globe, Server, Users } from 'lucide-react'

const TECH = [
  {
    icon: <Code2 size={18} style={{ color: '#7dd3fc' }} />,
    title: 'Frontend',
    items: ['React 19 + TypeScript', 'Vite · TanStack Router + Query', 'Tailwind CSS v4 · Radix UI', 'Recharts · react-simple-maps'],
  },
  {
    icon: <Server size={18} style={{ color: '#86efac' }} />,
    title: 'Backend',
    items: ['NestJS · Prisma ORM', 'PostgreSQL', 'MiniSearch + Natural (FTS)', 'world-countries (dados offline)'],
  },
  {
    icon: <Globe size={18} style={{ color: '#fdba74' }} />,
    title: 'APIs externas',
    items: ['OpenWeatherMap (clima)', 'ExchangeRate API (câmbio)', 'flagcdn.com (bandeiras)', 'JWT para autenticação'],
  },
]

const TEAM = ['Marcella', 'Paula', 'Pedro Cardoso', 'Richard', 'Gustavo Correia']

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 flex flex-col gap-10">
      {/* Hero */}
      <div className="text-center flex flex-col items-center gap-4">
        <div className="et-label">Projeto acadêmico</div>
        <h1
          className="text-4xl sm:text-5xl font-normal"
          style={{ color: '#f0f2f8' }}
        >
          Sobre o EasyTrip
        </h1>
        <p className="text-sm sm:text-base max-w-md" style={{ color: '#7c8194', lineHeight: 1.7 }}>
          Plataforma de exploração de destinos que reúne dados de clima,
          câmbio e informações de países em um só lugar,
          com busca semântica em linguagem natural.
        </p>
      </div>

      {/* Tech stack */}
      <div>
        <h2
          className="text-xl font-normal mb-4"
          style={{ color: '#f0f2f8' }}
        >
          Stack tecnológico
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {TECH.map(({ icon, title, items }) => (
            <div key={title} className="et-card p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                {icon}
                <span className="text-sm font-semibold" style={{ color: '#f0f2f8' }}>{title}</span>
              </div>
              <ul className="flex flex-col gap-1.5">
                {items.map((item) => (
                  <li key={item} className="text-xs flex items-start gap-1.5" style={{ color: '#7c8194' }}>
                    <span className="mt-0.5 shrink-0" style={{ color: '#4e5468' }}>·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div>
        <h2
          className="text-xl font-normal mb-4 flex items-center gap-2"
          style={{ color: '#f0f2f8' }}
        >
          <Users size={18} style={{ color: '#7dd3fc' }} />
          Equipe
        </h2>
        <div className="flex flex-wrap gap-2">
          {TEAM.map((name) => (
            <span
              key={name}
              className="px-4 py-2 rounded-full text-sm font-medium"
              style={{
                background: '#1e2029',
                color: '#f0f2f8',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
