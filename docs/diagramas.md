# Modelagem do sistema — diagramas

Diagramas em [Mermaid](https://mermaid.js.org), renderizados pelo próprio GitHub. Todos foram tirados do código atual (rotas, módulos e `schema.prisma`).

1. [Casos de uso](#1-casos-de-uso)
2. [Arquitetura e implantação](#2-arquitetura-e-implantação)
3. [Modelo de dados (ER)](#3-modelo-de-dados-er)
4. [Módulos do backend](#4-módulos-do-backend)
5. [Sequência — busca e abertura de um país](#5-sequência--busca-e-abertura-de-um-país)
6. [Sequência — cadastro, login e rota protegida](#6-sequência--cadastro-login-e-rota-protegida)
7. [Fluxo de telas](#7-fluxo-de-telas)

---

## 1. Casos de uso

```mermaid
flowchart LR
  V([Visitante])
  U([Usuário logado])
  OW[[OpenWeatherMap]]
  EX[[ExchangeRate-API]]

  subgraph EasyTrip
    UC1(Buscar destinos em linguagem natural)
    UC2(Ver ficha do país: clima, câmbio, fuso, comidas, regras)
    UC3(Cadastrar-se / entrar)
    UC4(Histórico de países abertos)
    UC5(Favoritar país)
    UC6(Marcar como visitado + data da viagem)
    UC7(Ver mapa, estatísticas e conquistas)
    UC8(Receber recomendações)
    UC9(Compartilhar perfil e comparar com amigo)
  end

  V --> UC1
  V --> UC2
  V --> UC3
  U --> UC1
  U --> UC2
  U --> UC4
  U --> UC5
  U --> UC6
  U --> UC7
  U --> UC8
  U --> UC9
  UC2 -.-> OW
  UC2 -.-> EX
```

O visitante busca e consulta países com histórico guardado no navegador; ao entrar, o histórico migra para o servidor.

## 2. Arquitetura e implantação

```mermaid
flowchart TB
  subgraph Navegador
    FE["Frontend React 19 + Vite<br/>TanStack Router/Query · Tailwind v4"]
  end

  subgraph Render["Render (serviço web único)"]
    API["Backend NestJS 11<br/>/api/* + Swagger /api/docs"]
    STATIC["Frontend compilado<br/>apps/backend/public"]
    FTS["Índice MiniSearch<br/>(em memória)"]
    WC["world-countries<br/>+ population.json (offline)"]
  end

  DB[("PostgreSQL<br/>Neon (produção)<br/>Docker / db:local (dev)")]
  OW["OpenWeatherMap"]
  EX["ExchangeRate-API"]
  FLAG["flagcdn.com"]

  FE -- "HTTPS /api (JWT Bearer)" --> API
  FE -- "GET /" --> STATIC
  FE -- bandeiras --> FLAG
  API --> FTS
  FTS --> WC
  API -- Prisma --> DB
  API -- "clima (cache 10 min)" --> OW
  API -- "câmbio (cache 6 h)" --> EX
```

Monorepo Turborepo: `apps/frontend`, `apps/backend` e `packages/shared` (tipos e schemas Zod usados pelos dois lados).

## 3. Modelo de dados (ER)

```mermaid
erDiagram
  User ||--o{ SearchHistory : pesquisa
  User ||--o{ Wishlist : favorita
  User ||--o{ VisitedCountry : visita

  User {
    string id PK "cuid"
    string email UK
    string username UK
    string passwordHash "bcrypt"
    Role role "USER | ADMIN"
    datetime createdAt
  }
  SearchHistory {
    string id PK
    string userId FK
    string query
    string countryName
    string cca2
    datetime createdAt
  }
  Wishlist {
    string id PK
    string userId FK
    string cca2 "único por usuário"
    string countryName
    string continent
    datetime createdAt
  }
  VisitedCountry {
    string id PK
    string userId FK
    string cca2 "único por usuário"
    string countryName
    string continent
    date visitedAt "opcional"
    datetime createdAt
  }
```

Os países não ficam no banco: vêm do pacote `world-countries` (offline). O banco guarda só o que é do usuário. Apagar um usuário apaga em cascata o histórico, os favoritos e os visitados.

## 4. Módulos do backend

```mermaid
classDiagram
  direction LR
  class AuthModule {
    AuthController /auth
    AuthService
    RolesGuard
    LoginThrottleGuard
  }
  class UsersModule {
    UsersController /users
    UsersService
  }
  class CountriesModule {
    CountriesService
    country-extras
  }
  class DestinationModule {
    DestinationController /destination
    DestinationService
    CountryService
    WeatherService
    ExchangeService
    SemanticSearchService
    FullTextSearchService
  }
  class HistoryModule {
    HistoryController /history
    HistoryService
  }
  class WishlistModule {
    WishlistController /wishlist
    WishlistService
  }
  class VisitedModule {
    VisitedController /visited
    VisitedService
  }
  class RecommendationsModule {
    RecommendationsController /recommendations
    RecommendationsService
  }
  class StatsModule {
    StatsController /stats
    StatsService
  }
  class PrismaModule {
    PrismaService
  }

  AuthModule --> UsersModule
  UsersModule --> WishlistModule
  UsersModule --> VisitedModule
  UsersModule --> StatsModule
  DestinationModule --> CountriesModule
  HistoryModule --> CountriesModule
  RecommendationsModule --> CountriesModule
  HistoryModule --> PrismaModule
  WishlistModule --> PrismaModule
  VisitedModule --> PrismaModule
  StatsModule --> PrismaModule
  RecommendationsModule --> PrismaModule
  UsersModule --> PrismaModule
```

## 5. Sequência — busca e abertura de um país

```mermaid
sequenceDiagram
  actor P as Pessoa
  participant FE as Frontend
  participant API as DestinationController
  participant SS as SemanticSearchService
  participant FTS as FullTextSearch (MiniSearch)
  participant CS as CountryService
  participant W as OpenWeatherMap
  participant X as ExchangeRate-API

  P->>FE: digita "país frio na Europa"
  FE->>API: GET /api/destination/search?q=...
  API->>SS: search(q)
  SS->>FTS: termos sem stopwords (BM25)
  FTS-->>SS: países + bm25
  SS->>SS: soma pesos das tags citadas (Frio, Europa)<br/>mantém quem atende a todas
  SS-->>FE: até 15 resultados
  P->>FE: escolhe "Iceland"
  FE->>API: GET /api/destination/Iceland
  API->>CS: getCountryInfo (offline)
  par clima e câmbio em paralelo
    API->>W: Reykjavik,IS
    API->>X: tabela BRL (cache 6 h)
  end
  API-->>FE: ficha + clima + câmbio (null se a API falhar)
  FE->>API: POST /api/history (se logado)
```

## 6. Sequência — cadastro, login e rota protegida

```mermaid
sequenceDiagram
  actor P as Pessoa
  participant FE as Frontend (AuthContext)
  participant AC as AuthController
  participant T as LoginThrottleGuard
  participant AS as AuthService
  participant DB as PostgreSQL
  participant RG as RolesGuard

  P->>FE: email ou usuário + senha
  FE->>AC: POST /api/auth/login
  AC->>T: até 10 tentativas / 15 min
  AC->>AS: login(login, senha)
  AS->>DB: busca por email (sem maiúsculas) ou username
  AS->>AS: bcrypt.compare
  AS-->>FE: { user, tokens.accessToken }
  FE->>FE: guarda token no localStorage<br/>migra histórico local (POST /history/bulk)
  FE->>RG: GET /api/wishlist (Authorization: Bearer)
  RG->>RG: verifica JWT e usuário
  RG-->>FE: 200 lista · 401 → logout e limpa cache
```

## 7. Fluxo de telas

```mermaid
flowchart LR
  L["/conheca<br/>Landing page"] --> H["/<br/>Busca"]
  H --> R["Resultados da busca semântica"]
  R --> D["Ficha do país<br/>clima · câmbio · comidas · regras"]
  D -->|favoritar / visitar| LG{logado?}
  LG -- não --> LOGIN["/login · /register"]
  LG -- sim --> PF["/profile<br/>mapa · estatísticas · conquistas · linha do tempo"]
  LOGIN --> H
  PF -->|compartilhar| PP["/profile/:id<br/>perfil do amigo + comparação"]
  H --> AB["/about"]
```
