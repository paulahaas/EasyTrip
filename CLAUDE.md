# EasyTrip — CLAUDE.md

Guia definitivo de arquitetura, padrões de código e decisões de design para o projeto.
**Mantenha este arquivo atualizado sempre que um padrão mudar.**

---

## Estrutura do monorepo

```
EasyTrip/
├── apps/
│   ├── frontend/          React 19 + Vite + TanStack Router
│   └── backend/           NestJS + Prisma + PostgreSQL
├── packages/
│   └── shared/            Tipos e schemas Zod compartilhados
├── turbo.json             Turborepo pipeline
└── docker-compose.yml     PostgreSQL local
```

### Comandos raiz
```bash
npm run dev          # inicia frontend + backend em paralelo
npm run build        # build de todos os apps
npm run test         # roda todos os testes
```

---

## Backend

### Stack
| Camada | Tecnologia |
|--------|-----------|
| Framework | NestJS |
| ORM | Prisma |
| Banco | PostgreSQL (Docker local) |
| Auth | JWT (Bearer token) |
| Dados de países | `world-countries` npm (offline, sem API key) |
| Clima | OpenWeatherMap API |
| Câmbio | ExchangeRate API |
| Bandeiras | `https://flagcdn.com/{cca2}.svg` |
| Busca FTS | MiniSearch + PorterStemmerPt (Natural.js) |

### Módulos principais
```
src/
├── auth/                  JWT + guards + roles
├── countries/             CountriesService (world-countries, offline)
├── destination/           Agrega país + clima + câmbio
├── recommendations/       Recomendações por sub-região
├── semantic-search/       FTS com MiniSearch + keyword-map
│   ├── country-profile.ts Constrói texto indexável por país
│   ├── full-text-search.service.ts  Índice MiniSearch (lazy build)
│   ├── keyword-map.ts     Tags semânticas + filtros estruturados
│   └── semantic-search.service.ts   Orquestra FTS + tags
├── history/               Histórico de pesquisas (server-side)
├── wishlist/              Países favoritos
└── visited/               Países visitados
```

### CountriesService — regras
- Dados carregados de `world-countries` no startup (síncrono, sem HTTP)
- `loadAll()` é no-op (mantido para compatibilidade com callers existentes)
- `flag` gerado como `https://flagcdn.com/${cca2.toLowerCase()}.svg`
- `CountryMeta` inclui: `cca2, cca3, name, continent, subregion, capital, latlng, landlocked, languages[], currencies[], currencyDetails[], flag, altSpellings[]`
- **NÃO usar** a API RestCountries (v3.1 depreciada, v5 paga)

### Busca semântica — como funciona
1. `FullTextSearchService.buildIndex()`: cria perfil textual por país via `buildProfile()`
2. `buildProfile()` inclui: nome, `altSpellings` (ex: "Brasil" para Brazil), continente, sub-região, idiomas, moedas, tokens de clima/hemisfério, keywords do `keyword-map` que o país satisfaz
3. Query normalizada (NFD + strip diacríticos) → MiniSearch com `prefix: true, fuzzy adaptativo`
4. Score final = `bm25 + Σ(scores das keyword-map entries que batem)`
5. Retorna top 15 ordenado por score desc

### Padrões NestJS
- `Injectable()` + constructor injection sempre
- Módulos explícitos com `imports/providers/exports`
- Guards globais com `@Roles()` nos controllers protegidos
- Sem `any` explícito — usar tipos do Prisma ou interfaces próprias
- Erros: `NotFoundException`, `UnauthorizedException` do NestJS

---

## Frontend

### Stack
| Camada | Tecnologia |
|--------|-----------|
| Framework | React 19 |
| Bundler | Vite 8 |
| Routing | @tanstack/react-router |
| Data fetching | @tanstack/react-query |
| Styling | Tailwind CSS v4 + classes CSS customizadas |
| UI primitives | Radix UI (Dialog, Tabs, Avatar, Tooltip, etc.) |
| Ícones | lucide-react |
| Toasts | sonner |
| Charts | Recharts |
| Mapas | react-simple-maps + d3-geo |
| Validação | Zod (via @easytrip/shared) |
| Fontes | Geist via Google Fonts |

### Design System

#### Tokens de cor (definidos em `globals.css` via `@theme`)
```
background:  #0e0f14   → body
surface:     #16181f   → cards, painéis
surface2:    #1e2029   → elementos internos (inputs, itens de lista)
surface3:    #22252f   → hover state de surface2
border:      rgba(255,255,255,0.07)
border-subtle: rgba(255,255,255,0.04)
accent:      #4f8ef7   → azul primário
accent2:     #7dd3fc   → azul claro (gradient partner)
foreground:  #f0f2f8   → texto principal
muted:       #7c8194   → texto secundário/labels
muted2:      #4e5468   → texto muito apagado / ícones inativos
success:     #34d399   → verde (visited)
danger:      #f87171   → vermelho (remover, erro)
warning:     #fbbf24   → amarelo
```

#### Gradiente accent
```css
background: linear-gradient(135deg, #4f8ef7, #7dd3fc);
```
Usado em: botões primários (CTA), logo icon, progress bars, texto gradient.

#### Classes utilitárias (definidas em globals.css)
| Classe | Uso |
|--------|-----|
| `.et-card` | Card base (bg + border + border-radius) |
| `.et-card-hover` | Adiciona hover com lift + border accent |
| `.et-surface` | Superfície interna (bg surface2) |
| `.et-chip` | Chip/pill clicável (histórico, etc.) |
| `.et-chip-accent` | Chip com cor accent (recomendados) |
| `.et-label` | Label de seção (xs + uppercase + muted) |
| `.et-progress-track` | Track de barra de progresso |
| `.et-progress-fill` | Fill com gradiente accent |
| `.et-shimmer` | Skeleton shimmer animado |
| `.et-flag` | Imagem de bandeira (border-radius + shadow) |
| `.bg-gradient-accent` | Background gradient 135deg |
| `.bg-gradient-accent-subtle` | Background gradient sutil |
| `.text-gradient-accent` | Texto com clip de gradient |
| `.animate-fade-up` | Entrada com fade + translateY |
| `.animate-fade-in` | Entrada com fade simples |
| `.animate-scale-in` | Entrada com scale |

#### Tipografia
- **Fonte única**: Geist (`font-sans`) para tudo — headings, body, labels
- **Display headings**: `font-light` (300) ou `font-normal` (400) em tamanhos grandes (`text-4xl+`)
- **Body**: peso padrão (400) via `font-sans`
- **Labels de seção**: classe `.et-label` (xs, uppercase, tracking, muted)

#### Bandeiras
- URL: `https://flagcdn.com/{cca2_lower}.svg` (SVG, ideal para qualquer tamanho)
- URL com tamanho: `https://flagcdn.com/w320/{cca2_lower}.png` (thumbnail), `w640` (hero)
- Classe: `.et-flag` para styling consistente
- Fallback emoji: `emojiFlag(cca2)` para quando URL não disponível

### Estrutura de arquivos frontend
```
src/
├── components/
│   ├── ui/          Primitivos Radix/shadcn (não modificar diretamente)
│   ├── charts/      Recharts + react-simple-maps
│   └── *.tsx        Componentes de feature
├── context/
│   └── AuthContext.tsx   Estado global de auth + token
├── hooks/
│   └── use*.ts      Hooks de data (react-query + apiClient)
├── lib/
│   ├── apiClient.ts   Fetch wrapper com auth header
│   ├── flags.ts       Emoji flag lookup (fallback)
│   ├── i18n.ts        Nomes de continentes em PT
│   ├── queryClient.ts TanStack Query config
│   └── utils.ts       cn() (clsx + tailwind-merge)
├── routes/          Páginas (TanStack Router)
└── styles/
    └── globals.css  @theme tokens + classes utilitárias
```

### Padrões de componente

#### Styling — regras
1. **Preferir classes CSS utilitárias** (`et-card`, `et-chip`, etc.) sobre inline styles repetidos
2. **Inline styles** apenas para: valores dinâmicos, gradients complexos, cores condicionais
3. **Não usar** `style={{ background: '#16181f' }}` diretamente — usar `et-card` ou `bg-surface` (Tailwind token)
4. **Cores sempre pelos tokens** — nunca hardcode de hex no JSX sem ser em `globals.css` primeiro
5. `cn()` de `@/lib/utils` para classes condicionais

#### Componentes funcionais
```tsx
// ✅ Correto
export function MyComponent({ prop }: Props) {
  return <div className="et-card p-4">...</div>
}

// ❌ Evitar default exports (exceto routes — convenção do router)
export default function MyComponent() { ... }
```

#### Hooks de data
```tsx
// Sempre via react-query através dos custom hooks
const { data, loading, error } = useDestination()

// Mutations via hook — nunca chamar apiClient direto no componente
const { add, remove } = useWishlist()
```

#### Skeleton loading
- Usar `DestinationSkeleton` ou classe `.et-shimmer` para loading states
- Não usar `isLoading && <Spinner />` — usar skeleton com mesma estrutura do conteúdo

### Responsividade
- Mobile-first: escrever mobile → adicionar `sm:`, `md:`, `lg:` para breakpoints maiores
- Breakpoints Tailwind padrão: `sm` 640px, `md` 768px, `lg` 1024px
- Max widths:
  - Conteúdo home/auth: `max-w-2xl` (672px)
  - Profile/admin: `max-w-5xl` (1024px)
- Padding padrão: `px-4 sm:px-6`
- Texto que some em mobile: `hidden sm:inline` / `hidden sm:flex`

### Auth flow
- Token JWT em `localStorage` via `apiClient.ts`
- `AuthContext` hidrata no mount
- 401 → logout automático + redirect `/login`
- Histórico local (guest) migra para server no login
- Guards de rota: `if (!isAuthenticated) return <Navigate to="/login" />`

---

## Shared (`packages/shared`)

- Tipos TypeScript compartilhados entre frontend e backend
- Schemas Zod: `loginSchema`, `registerSchema`
- Interfaces: `DestinationResponse`, `CountryInfo`, `WeatherInfo`, `ExchangeInfo`, `SemanticSearchResult`, `RecommendationItem`, `StatsPerContinent`
- **Nunca duplicar tipos** — sempre importar de `@easytrip/shared`

---

## API reference (endpoints principais)

| Método | Rota | Autenticação | Descrição |
|--------|------|-------------|-----------|
| POST | `/auth/login` | — | Login → JWT |
| POST | `/auth/register` | — | Cadastro |
| GET | `/destination/search?q=` | — | Busca semântica |
| GET | `/destination/:name` | — | Detalhes do país |
| GET | `/recommendations` | JWT | Recomendações |
| GET/POST/DELETE | `/wishlist` | JWT | Favoritos |
| GET/POST/DELETE | `/visited` | JWT | Visitados |
| GET/POST/DELETE | `/history` | JWT | Histórico |
| GET | `/profile/stats` | JWT | Estatísticas |
| GET | `/profile/:id/public` | JWT | Perfil público |

---

## Convenções de commit

Seguir Conventional Commits (via `/caveman-commit`):
- `feat(scope): ...` nova funcionalidade
- `fix(scope): ...` correção de bug
- `refactor(scope): ...` refatoração sem mudança de comportamento
- `style(scope): ...` apenas mudanças visuais/CSS

**Sem** `Co-Authored-By` em commits.

---

## O que NÃO fazer

- ❌ Usar RestCountries API (depreciada — usar `world-countries`)
- ❌ Hardcode de cores hex no JSX (usar tokens do `globals.css`)
- ❌ `style={{ fontFamily: ... }}` — Geist já é default via `--font-sans`
- ❌ Inline styles para bordas repetidas — usar `et-card`
- ❌ `export default` em componentes (exceto routes)
- ❌ Chamar `apiClient` diretamente em componentes — usar custom hooks
- ❌ Duplicar tipos do `@easytrip/shared`
- ❌ `population` ou `area` no `CountryMeta` (não disponível no `world-countries`)
