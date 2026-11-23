import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  BarChart3,
  CloudSun,
  Globe2,
  Heart,
  Map,
  Search,
  Share2,
  Sparkles,
  Trophy,
  Wallet,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

const PROBLEMS = [
  {
    title: 'Informação espalhada',
    text: 'Clima, câmbio, idioma, fuso e regras locais ficam em cinco sites diferentes.',
  },
  {
    title: 'Busca por nome apenas',
    text: 'Quem ainda não sabe o destino não tem como pedir "um país quente que fala espanhol".',
  },
  {
    title: 'Viagens sem memória',
    text: 'Os países visitados e os sonhos de viagem não ficam registrados em lugar nenhum.',
  },
]

const FEATURES: { icon: ReactNode; title: string; text: string }[] = [
  {
    icon: <Search size={18} />,
    title: 'Busca em linguagem natural',
    text: '"país frio na Europa", "ilhas no Pacífico", "fala árabe" — em português ou inglês.',
  },
  {
    icon: <CloudSun size={18} />,
    title: 'Clima agora',
    text: 'Temperatura, sensação térmica e umidade da capital, atualizados.',
  },
  {
    icon: <Wallet size={18} />,
    title: 'Câmbio em reais',
    text: 'Quanto vale a moeda local em R$ e quanto R$ 1 compra lá.',
  },
  {
    icon: <Globe2 size={18} />,
    title: 'Ficha completa do país',
    text: 'Capital, idiomas, fuso, DDI, mão de direção, comidas típicas e regras locais.',
  },
  {
    icon: <Heart size={18} />,
    title: 'Favoritos e visitados',
    text: 'Monte a lista de desejos e marque onde já foi, com a data da viagem.',
  },
  {
    icon: <Map size={18} />,
    title: 'Mapa do mundo',
    text: 'Seus países pintados por continente e a porcentagem do mundo que você conhece.',
  },
  {
    icon: <Sparkles size={18} />,
    title: 'Recomendações',
    text: 'Sugestões de vizinhos e países da mesma região, a partir do que você pesquisa.',
  },
  {
    icon: <Trophy size={18} />,
    title: 'Conquistas e linha do tempo',
    text: 'Selos como "Eurotrip" e "Bons vizinhos" e suas viagens organizadas por ano.',
  },
  {
    icon: <Share2 size={18} />,
    title: 'Perfil compartilhável',
    text: 'Envie seu perfil para um amigo e compare os países que vocês visitaram.',
  },
]

const STEPS = [
  { n: '1', title: 'Descreva', text: 'Digite o que procura: clima, idioma, região ou o nome do país.' },
  { n: '2', title: 'Compare', text: 'Veja clima, câmbio e a ficha completa de cada resultado.' },
  { n: '3', title: 'Guarde', text: 'Favorite, marque como visitado e acompanhe seu mapa.' },
]

/** Landing page de apresentação do produto (critério 1 da banca). */
export function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(79,142,247,0.16) 0%, transparent 70%)',
        }}
      />

      {/* Hero */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center flex flex-col items-center gap-6 animate-fade-up">
        <span className="et-chip-accent inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium">
          <Globe2 size={12} /> 250 países e territórios · dados offline
        </span>
        <h1 className="text-4xl sm:text-6xl font-light leading-tight tracking-tight text-foreground max-w-3xl">
          Descubra para onde ir <span className="text-gradient-accent">antes de saber o nome do país</span>
        </h1>
        <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed">
          O EasyTrip junta clima, câmbio e tudo que você precisa saber sobre um destino em uma busca só — e
          guarda o mapa das suas viagens.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/buscar">
            <Button className="rounded-full px-6 h-11 font-semibold bg-gradient-accent text-background gap-2">
              Explorar destinos <ArrowRight size={16} />
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" className="rounded-full px-6 h-11 text-foreground">
              Criar conta grátis
            </Button>
          </Link>
        </div>
      </section>

      {/* Problema */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <p className="et-label mb-2">O problema</p>
        <h2 className="text-2xl sm:text-3xl font-light text-foreground mb-6">
          Planejar uma viagem internacional ainda é um quebra-cabeça
        </h2>
        <div className="grid gap-3 sm:grid-cols-3 stagger">
          {PROBLEMS.map((p) => (
            <div key={p.title} className="et-card p-5 animate-fade-up">
              <h3 className="text-sm font-semibold text-foreground mb-1.5">{p.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <p className="et-label mb-2">Como funciona</p>
        <h2 className="text-2xl sm:text-3xl font-light text-foreground mb-6">Três passos</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="et-card p-5 flex gap-4">
              <span className="w-9 h-9 shrink-0 rounded-full bg-gradient-accent text-background font-semibold flex items-center justify-center">
                {s.n}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{s.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <p className="et-label mb-2">A solução</p>
        <h2 className="text-2xl sm:text-3xl font-light text-foreground mb-6">Tudo sobre o destino em um lugar</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="et-card et-card-hover p-5 flex flex-col gap-2">
              <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-surface2 text-accent2">
                {f.icon}
              </span>
              <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Público */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="et-card p-6 sm:p-8 grid gap-6 sm:grid-cols-[1fr_auto] items-center">
          <div>
            <p className="et-label mb-2">Para quem</p>
            <h2 className="text-xl sm:text-2xl font-light text-foreground mb-2">
              Viajantes brasileiros que estão escolhendo o próximo destino
            </h2>
            <p className="text-sm text-muted leading-relaxed max-w-xl">
              Câmbio sempre em reais, nomes e textos em português e um mapa para quem gosta de colecionar países.
            </p>
          </div>
          <BarChart3 size={56} className="text-accent hidden sm:block" />
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-24 text-center flex flex-col items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-light text-foreground">Qual vai ser a próxima viagem?</h2>
        <Link to="/buscar">
          <Button className="rounded-full px-6 h-11 font-semibold bg-gradient-accent text-background gap-2">
            Começar a buscar <ArrowRight size={16} />
          </Button>
        </Link>
        <p className="text-xs text-muted2">
          Projeto Integrador · Análise e Desenvolvimento de Sistemas · UNICESUSC
        </p>
      </section>
    </div>
  )
}
