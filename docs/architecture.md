# Arquitetura

## Estrutura do monorepo

```
EasyTrip/
├── apps/
│   ├── frontend/          # React 19 + Vite + TanStack Router
│   └── backend/           # NestJS + Prisma + PostgreSQL
├── packages/
│   └── shared/            # Tipos TypeScript + schemas Zod compartilhados
├── turbo.json             # Pipeline do Turborepo
├── docker-compose.yml     # PostgreSQL local (porta 5432)
└── docs/                  # Esta documentação
```

O build é orquestrado pelo **Turborepo**: cada app tem seus scripts `dev`, `build`, `test`, `lint` e o Turborepo os executa em paralelo, com cache de artefatos.

---

## Stack tecnológica

### Backend (`apps/backend`)

| Camada | Tecnologia |
|--------|-----------|
| Framework | NestJS 10 |
| ORM | Prisma 6 |
| Banco | PostgreSQL 15 (Docker local) |
| Autenticação | JWT via `@nestjs/jwt` (Bearer token) |
| Validação | `class-validator` + `class-transformer` |
| HTTP client | `@nestjs/axios` (RxJS/firstValueFrom) |
| Dados de países | `world-countries` (offline, sem API) |
| Clima | OpenWeatherMap API |
| Câmbio | ExchangeRate API v6 |
| Busca FTS | MiniSearch + PorterStemmerPt (Natural.js) |
| Docs | Swagger (`@nestjs/swagger`) |
| Testes | Jest 29 + ts-jest |

### Frontend (`apps/frontend`)

| Camada | Tecnologia |
|--------|-----------|
| Framework | React 19 |
| Bundler | Vite 8 |
| Routing | @tanstack/react-router v1 |
| Data fetching | @tanstack/react-query v5 |
| Styling | Tailwind CSS v4 |
| UI primitivos | Radix UI (Dialog, Tabs, Avatar, Tooltip…) |
| Ícones | lucide-react |
| Toasts | sonner |
| Gráficos | Recharts |
| Mapas | react-simple-maps + d3-geo |
| Validação de forms | Zod (via `@easytrip/shared`) |
| Fontes | Geist (Google Fonts) |
| Testes | Vitest + Testing Library |

### Shared (`packages/shared`)

Tipos TypeScript e schemas Zod consumidos tanto pelo frontend quanto pelo backend. Nunca duplicar tipos — sempre importar de `@easytrip/shared`.

---

## Módulos do backend

```
src/
├── auth/              JWT auth — login, register, /me, guards, decorators
├── countries/         CountriesService — fonte de dados de países (world-countries)
├── destination/       Agrega país + clima + câmbio em um único endpoint
│   └── services/      CountryService, WeatherService, ExchangeService
├── semantic-search/   Busca semântica — FTS (MiniSearch) + keyword-map
├── recommendations/   Recomendações por sub-região a partir do histórico
├── history/           Histórico de pesquisas por usuário (max 8)
├── wishlist/          Lista de favoritos
├── visited/           Países marcados como visitados
├── stats/             Estatísticas por continente
├── users/             CRUD de usuários
└── prisma/            PrismaService (singleton)
```

### CountriesService — fonte de dados

`CountriesService` carrega todos os países do pacote `world-countries` **uma única vez, de forma síncrona**, na inicialização do módulo. Não há chamadas HTTP para dados de países.

Métodos disponíveis (todos síncronos):
- `getAll()` — retorna todos os ~250 países
- `getByName(name)` — busca por nome (exato ou parcial via `altSpellings`)
- `getByCca2(cca2)` — busca por código ISO 3166-1 alpha-2 (ex: `BR`)
- `getByCca3(cca3)` — busca por código alpha-3 (ex: `BRA`)
- `getBySubregion(subregion)` — filtra por sub-região

Cada país é representado pela interface `CountryMeta`:

```ts
interface CountryMeta {
  cca2: string;         // "BR"
  cca3: string;         // "BRA"
  name: string;         // "Brazil"
  continent: string;    // "South America"
  subregion: string;    // "South America"
  capital: string;      // "Brasília"
  latlng: [number, number];
  landlocked: boolean;
  languages: string[];
  currencies: string[];
  currencyDetails: CurrencyDetail[];
  flag: string;         // "https://flagcdn.com/br.svg"
  altSpellings: string[]; // ["BR", "Brasil", "Federative Republic of Brazil", ...]
}
```

---

## Fluxo de autenticação

```
POST /api/auth/register  →  cria usuário, retorna { user, tokens }
POST /api/auth/login     →  valida senha (bcrypt), retorna { user, tokens }
GET  /api/auth/me        →  [JWT] retorna usuário autenticado

tokens.accessToken  →  JWT com payload { sub: userId, email }
Validade: configurável via JWT_EXPIRES_IN (.env)
```

O frontend armazena o token em `localStorage` sob a chave `easytrip:token`. O `AuthContext` hidrata o token no mount e faz `GET /api/auth/me` para validar. Em 401 com token presente, o token é removido e um evento `auth:logout` é disparado.

---

## Variáveis de ambiente (backend)

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/easytrip
JWT_SECRET=sua-chave-secreta
JWT_EXPIRES_IN=7d
OPENWEATHER_API_KEY=...
EXCHANGERATE_API_KEY=...
```
