# EasyTrip

Plataforma de exploração de destinos que reúne clima, câmbio e informações de países em um só lugar, com busca semântica em linguagem natural.

**Site no ar:** https://easytrip-e4xg.onrender.com (a primeira visita pode levar ~1 min, veja [Deploy](#deploy-render--neon-grátis)) · **Landing page:** [`/conheca`](https://easytrip-e4xg.onrender.com/conheca)

**Documentação:** [diagramas do sistema](docs/diagramas.md) · [Scrum e sprints](docs/scrum.md) · [API](docs/api.md) · [arquitetura](docs/architecture.md) · [testes](docs/testing.md)

## Funcionalidades

- **Busca semântica** — pesquise em português ou inglês: "país frio", "fala árabe", "ilhas no Pacífico", "oceano Índico"
- **Clima em tempo real** — temperatura, sensação térmica e umidade via OpenWeatherMap
- **Câmbio com o real** — cotação nos dois sentidos (R$ → moeda local e vice-versa), atualizada diariamente, sem precisar de chave
- **Informações do país** — capital, idiomas, moeda e continente em português, população, hora local, DDI e lado do trânsito (250+ países, dados offline)
- **Comidas típicas e regras para turistas** — pratos famosos de cada país e leis locais que costumam pegar viajantes de surpresa
- **Perfil do usuário** — histórico de pesquisas, mapa interativo, estatísticas por continente, linha do tempo das viagens e 15 conquistas
- **Favoritos e visitados** — com mês/ano da viagem; perfil público com comparação de países entre amigos
- **Autenticação** — cadastro e login por email ou nome de usuário, com JWT

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

**Pré-requisitos:** Git e Node.js **22.12 ou mais novo** (exigência do Vite 8). Docker e PostgreSQL instalado são opcionais.

### 1. Clone o repositório

```bash
git clone https://github.com/paulahaas/EasyTrip.git
cd EasyTrip
```

### 2. Configure o `.env` do backend

```bash
cp apps/backend/.env.example apps/backend/.env
```

Preencha `DATABASE_URL` e troque o `JWT_SECRET`. As chaves `OPENWEATHER_API_KEY` e `EXCHANGERATE_API_KEY` são opcionais: sem a do OpenWeather o site só não mostra o clima, e o câmbio funciona mesmo sem chave (usa o acesso aberto da ExchangeRate API).

### 3. Instale dependências

```bash
npm install
```

Funciona em Windows, macOS e Linux (o `package-lock.json` traz os binários nativos de todas as plataformas).

### 4. Suba o projeto

Escolha **um** dos dois caminhos abaixo.

#### Opção A — Com Docker

```bash
npm run backend:up       # build + start em background
npm run backend:logs     # acompanha logs
npm run dev --workspace=@easytrip/frontend
```

No boot o container executa `prisma generate`, `prisma migrate deploy` e `nest start --watch`.

#### Opção B — Sem Docker

Útil quando o Docker não roda na sua máquina (comum no Windows). Você só precisa de um PostgreSQL acessível.

**1. Tenha um PostgreSQL.** Qualquer uma destas serve:

- **Portátil, pelo próprio projeto (mais simples):** não precisa instalar nada. Num terminal separado, deixe rodando:

  ```bash
  npm run db:local
  ```

  Ele baixa junto com o `npm install` um PostgreSQL 17 para o seu sistema, cria o banco na primeira vez e guarda os dados em `.postgres-data/` (ignorado pelo Git). No `apps/backend/.env` use:

  ```env
  DATABASE_URL=postgresql://easytrip:easytrip@localhost:5432/easytrip
  ```

  Se a porta 5432 já estiver ocupada, rode com outra (`PGPORT=5433 npm run db:local`; no PowerShell: `$env:PGPORT=5433; npm run db:local`) e ajuste a porta no `DATABASE_URL`. Para guardar os dados em outra pasta, defina `PGDATA` do mesmo jeito. Para parar, `Ctrl+C`.

- **Instalado no computador:** baixe em [postgresql.org/download](https://www.postgresql.org/download/) e, no `psql` (ou no pgAdmin), crie o usuário e o banco:

  ```sql
  CREATE USER easytrip WITH PASSWORD 'easytrip';
  CREATE DATABASE easytrip OWNER easytrip;
  ```

  No `apps/backend/.env`:

  ```env
  DATABASE_URL=postgresql://easytrip:easytrip@localhost:5432/easytrip
  ```

- **Na nuvem (grátis):** crie um banco no [Neon](https://neon.tech), [Supabase](https://supabase.com) ou [Railway](https://railway.app) e cole a connection string que eles fornecem no `DATABASE_URL`.

**2. Crie as tabelas e (opcional) o usuário de demonstração:**

```bash
cd apps/backend
npx prisma migrate deploy
npx prisma db seed        # cria demo@easytrip.test / demo1234 (só fora de produção)
cd ../..
```

**3. Rode backend e frontend juntos:**

```bash
npm run dev
```

---

Em qualquer um dos caminhos:

- **Backend:** `http://localhost:3000` (Swagger em `http://localhost:3000/api/docs`)
- **Frontend:** `http://localhost:5173`

---

## Deploy (Render + Neon, grátis)

O backend serve a API (`/api`) e o frontend compilado (`/`) no mesmo serviço, configurado em [`render.yaml`](render.yaml).

1. Crie um banco PostgreSQL grátis no [Neon](https://neon.tech). Pegue as duas connection strings: a **com pooling** (host com `-pooler`) e a **direta** (sem `-pooler`). Com o [Neon CLI](https://www.npmjs.com/package/neon), `neon link --project-id <id> -y` grava as duas em `.env.local` como `DATABASE_URL` e `DATABASE_URL_UNPOOLED`.
2. No [Render](https://render.com): **New → Blueprint**, escolha este repositório e preencha `DATABASE_URL` (com pooling, usada pelo app) e `DATABASE_URL_UNPOOLED` (direta, usada só nas migrations). As chaves de clima e câmbio são opcionais.
3. A cada inicialização o serviço aplica as migrations. O usuário demo **não** é criado em produção (a senha dele é pública). Para criá-lo de propósito, defina `SEED_DEMO=true` e rode `npx prisma db seed`. Se o banco já tem o demo de deploys anteriores, apague esse usuário.
4. `JWT_SECRET` é obrigatório; em produção precisa ter 32+ caracteres (o blueprint gera um).

No plano grátis o serviço "dorme" depois de 15 min sem acesso; a primeira visita seguinte demora ~1 min para acordar.

---

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run backend:up` | Build + start do backend em Docker |
| `npm run backend:down` | Para o backend |
| `npm run backend:logs` | Tail dos logs |
| `npm run backend:rebuild` | Rebuild completo da imagem |
| `npm run dev` | Backend + frontend em paralelo (sem Docker) |
| `npm run db:local` | PostgreSQL portátil para desenvolvimento (sem Docker) |
| `npm run build` | Build de todos os pacotes |
| `npm run test` | Testes em todos os pacotes |
| `npm run lint` | Lint em todos os pacotes |

---

## Testes

| Onde | Ferramenta | Quantidade | Como rodar |
|------|-----------|-----------|------------|
| Backend (unitários) | Jest | 171 testes | `cd apps/backend && npx jest` |
| Frontend | Vitest + Testing Library | 50 testes | `cd apps/frontend && npx vitest run` |
| Backend (ponta a ponta, com banco real) | Jest + Supertest | 23 testes | veja abaixo |

Os testes de ponta a ponta usam um banco separado. Sem Docker, suba um segundo banco portátil na porta 5433 e rode:

```bash
PGPORT=5433 PGDATA=.postgres-test npm run db:local      # terminal 1, deixe aberto
cd apps/backend
DATABASE_URL_TEST=postgresql://easytrip:easytrip@localhost:5433/easytrip npm run test:e2e
```

No PowerShell, defina as variáveis antes do comando: `$env:PGPORT=5433; $env:PGDATA=".postgres-test"; npm run db:local`. Com Docker, `npm run db:test:up` sobe o banco de teste e basta `npm run test:e2e`.

Cobertura do backend: `cd apps/backend && npx jest --coverage`.

---

## Problemas comuns

| Sintoma | Solução |
|---------|---------|
| `EPERM: operation not permitted` no `npm run build` (Windows) | Pare o `npm run dev` (Ctrl+C) antes de rodar o build: o servidor em execução prende os arquivos do Prisma |
| `Prisma.PrismaClientKnownRequestError is not a constructor` nos testes | Rode `npx prisma generate` em `apps/backend` (acontece logo depois de um `npm ci`) |
| `Connection refused` / `ECONNREFUSED` no banco | Confira se o `npm run db:local` está aberto e se a porta do `DATABASE_URL` é a mesma |
| Página do país sem clima | Falta a `OPENWEATHER_API_KEY` ou ela ainda não foi ativada (leva até 2 h depois de criada) |

---

## Estrutura do projeto

```
EasyTrip/
├── apps/
│   ├── backend/        NestJS API — auth, países, clima, câmbio, busca semântica
│   └── frontend/       React + Vite — interface do usuário
├── packages/
│   └── shared/         Tipos TypeScript e schemas Zod compartilhados
├── scripts/
│   ├── db-local.mjs            PostgreSQL portátil (npm run db:local)
│   └── update-population.mjs   Atualiza a população dos países (Banco Mundial)
├── docs/               Documentação técnica (arquitetura, API, busca, testes)
├── RELATORIO.md        O que existia no projeto original e o que mudou
├── CLAUDE.md           Guia de arquitetura e padrões de código
├── render.yaml         Deploy no Render
├── turbo.json          Pipeline do Turborepo
└── docker-compose.yml  PostgreSQL local
```

Mais detalhes em [`docs/index.md`](docs/index.md).

---

## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | Connection string do PostgreSQL (no Neon, a com pooling) |
| `DATABASE_URL_UNPOOLED` | Conexão direta, usada só nas migrations do deploy (opcional localmente) |
| `JWT_SECRET` | Segredo para assinar tokens JWT |
| `JWT_EXPIRES_IN` | Validade do login (padrão: `7d`) |
| `OPENWEATHER_API_KEY` | Chave da [OpenWeatherMap API](https://openweathermap.org/api) (opcional — sem ela o clima não aparece) |
| `EXCHANGERATE_API_KEY` | Chave da [ExchangeRate API](https://www.exchangerate-api.com) (opcional — sem ela usa o acesso aberto, atualizado 1 vez por dia) |
| `PORT` | Porta do backend (padrão: `3000`) |
| `PGPORT` / `PGDATA` | Porta e pasta do banco portátil do `npm run db:local` (padrão: `5432` / `.postgres-data`) |

---

## Equipe

Paula Haas · Gustavo Correia · Pedro Cardoso · Marcella Cagliari · Richard Pompeo

Projeto desenvolvido para a disciplina PMI IV — Análise e Desenvolvimento de Sistemas.

---

## Contribuição

1. Crie uma branch: `git checkout -b feature/minha-feature`
2. Commit: siga [Conventional Commits](https://www.conventionalcommits.org/)
3. Abra um Pull Request
