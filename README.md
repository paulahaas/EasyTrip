# EasyTrip

Plataforma de exploração de destinos que reúne clima, câmbio e informações de países em um só lugar, com busca semântica em linguagem natural.

## Funcionalidades

- **Busca semântica** — pesquise em português ou inglês: "país frio", "fala árabe", "ilhas no Pacífico"
- **Clima em tempo real** — temperatura, sensação térmica e umidade via OpenWeatherMap
- **Conversão de moeda** — cotação atualizada para BRL via ExchangeRate API
- **Informações do país** — capital, idioma, moeda e continente (250+ países, dados offline)
- **Perfil do usuário** — histórico de pesquisas, mapa interativo, estatísticas por continente
- **Favoritos e visitados** — gerencie e compartilhe seu perfil público
- **Autenticação** — cadastro e login com JWT

## Stack

**Monorepo** gerenciado com [Turborepo](https://turbo.build).

| Pacote | Tecnologias |
|--------|-------------|
| `apps/backend` | NestJS · Prisma · PostgreSQL · JWT · MiniSearch + PorterStemmerPt |
| `apps/frontend` | React 19 · Vite · TanStack Router/Query · Tailwind CSS v4 · Radix UI · Geist |
| `packages/shared` | TypeScript · Zod (tipos e schemas compartilhados) |

**APIs externas:** OpenWeatherMap · ExchangeRate API · flagcdn.com  
**Dados de países:** `world-countries` npm (offline, sem API key)

---

## Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/marcella-81/EasyTrip.git
cd EasyTrip
```

### 2. Configure o `.env` do backend

```bash
cp apps/backend/.env.example apps/backend/.env
```

Preencha `DATABASE_URL`, `OPENWEATHER_API_KEY` e `EXCHANGERATE_API_KEY`.

### 3. Instale dependências

```bash
npm install
```

### 4. Suba o backend em Docker

```bash
npm run backend:up       # build + start em background
npm run backend:logs     # acompanha logs
```

No boot o container executa `prisma generate`, `prisma migrate deploy` e `nest start --watch`.

### 5. Rode o frontend

```bash
npm run dev --workspace=@easytrip/frontend
```

- **Backend** (Docker): `http://localhost:3000`
- **Frontend** (Vite): `http://localhost:5173`

---

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run backend:up` | Build + start do backend em Docker |
| `npm run backend:down` | Para o backend |
| `npm run backend:logs` | Tail dos logs |
| `npm run backend:rebuild` | Rebuild completo da imagem |
| `npm run dev` | Backend + frontend em paralelo (sem Docker) |
| `npm run build` | Build de todos os pacotes |
| `npm run test` | Testes em todos os pacotes |
| `npm run lint` | Lint em todos os pacotes |

---

## Testes

O backend tem cobertura de testes unitários com Jest:

| Métrica | Cobertura |
|---------|-----------|
| Statements | ~98% |
| Branches | ~80% |
| Functions | ~99% |
| Lines | ~99% |

```bash
cd apps/backend
npx jest --coverage
```

---

## Estrutura do projeto

```
EasyTrip/
├── apps/
│   ├── backend/        NestJS API — auth, países, clima, câmbio, busca semântica
│   └── frontend/       React + Vite — interface do usuário
├── packages/
│   └── shared/         Tipos TypeScript e schemas Zod compartilhados
├── CLAUDE.md           Guia de arquitetura e padrões de código
├── turbo.json          Pipeline do Turborepo
└── docker-compose.yml  PostgreSQL local
```

---

## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | Connection string do PostgreSQL |
| `JWT_SECRET` | Segredo para assinar tokens JWT |
| `OPENWEATHER_API_KEY` | Chave da [OpenWeatherMap API](https://openweathermap.org/api) |
| `EXCHANGERATE_API_KEY` | Chave da [ExchangeRate API](https://www.exchangerate-api.com) |
| `PORT` | Porta do backend (padrão: `3000`) |

---

## Contribuição

1. Crie uma branch: `git checkout -b feature/minha-feature`
2. Commit: siga [Conventional Commits](https://www.conventionalcommits.org/)
3. Abra um Pull Request
