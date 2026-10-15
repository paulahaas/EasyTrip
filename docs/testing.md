# Testes

## Como rodar

```bash
# Tudo de uma vez (via Turborepo)
npm run test

# Por app
cd apps/backend && npm test            # Jest (unit + e2e)
cd apps/backend && npm run test:e2e    # só e2e
cd apps/frontend && npm test           # Vitest
cd apps/frontend && npm run test:watch # modo watch
```

---

## Backend — Jest

Framework: **Jest 29** com **ts-jest** para TypeScript.

### Testes unitários (`*.spec.ts`)

Cada service tem seu próprio spec com mocks do Prisma e dependências.

| Arquivo | O que testa |
|---------|-------------|
| `auth/auth.service.spec.ts` | Hash de senha, validação de credenciais, geração de JWT, conflito de email |
| `auth/auth.controller.spec.ts` | Rotas `/login`, `/register`, `/me` — payload e response |
| `auth/guards/jwt-auth.guard.spec.ts` | Guard extrai user do JWT, rejeita token inválido |
| `auth/guards/roles.guard.spec.ts` | Guard permite/bloqueia por role |
| `destination/destination.service.spec.ts` | Agrega país + clima + câmbio, propaga erro 404 |
| `destination/destination.controller.spec.ts` | Rota `/search` e `/:name` |
| `destination/services/country.service.spec.ts` | Busca por nome, cca2, cca3 — síncrona |
| `destination/services/weather.service.spec.ts` | Formata resposta do OpenWeatherMap |
| `destination/services/exchange.service.spec.ts` | Formata cotação do ExchangeRate |
| `history/history.service.spec.ts` | CRUD de histórico, deduplicação, limite de 8, bulk import |
| `recommendations/recommendations.service.spec.ts` | Filtra por sub-região, exclui já visitados/wishlist |
| `semantic-search/full-text-search.service.spec.ts` | Índice MiniSearch — busca exata, fuzzy, fallback |
| `semantic-search/semantic-search.service.spec.ts` | Score final = BM25 + tagScore |
| `stats/stats.service.spec.ts` | Agregação por continente, sempre 7 continentes |
| `users/users.service.spec.ts` | Criação, busca, perfil público |
| `visited/visited.service.spec.ts` | Add, remove, list — conflito 409 |
| `wishlist/wishlist.service.spec.ts` | Add, remove, list — conflito 409 |

### Testes E2E (`test/*.e2e-spec.ts`)

Sobem a aplicação NestJS inteira com banco de dados de teste (PostgreSQL em Docker). Testam o HTTP real de ponta a ponta.

| Arquivo | Cenários |
|---------|---------|
| `test/auth.e2e-spec.ts` | Register → login → me → token inválido |
| `test/history.e2e-spec.ts` | Adicionar, listar, deletar histórico; bulk import |
| `test/wishlist.e2e-spec.ts` | Add → list → remove; duplicata 409 |
| `test/public-profile.e2e-spec.ts` | Perfil público — visitados e wishlist de outro usuário |
| `test/swagger.e2e-spec.ts` | Swagger UI retorna 200 |

**Setup E2E:** `test/setup-e2e.ts` roda antes dos testes, garante que o banco está acessível e aplica as migrations via `prisma migrate deploy`.

### Padrões de mock

```ts
// Prisma mock — valores retornados por métodos
const prisma = {
  searchHistory: {
    findMany: jest.fn().mockResolvedValue([...]),
    create:   jest.fn().mockResolvedValue({ id: 'uuid', ... }),
    delete:   jest.fn().mockResolvedValue(undefined),
  },
}

// CountriesService — SEMPRE síncrono (sem mockResolvedValue)
const countries = {
  getByName: jest.fn().mockReturnValue({ cca2: 'JP', name: 'Japan', ... }),
  getByCca2: jest.fn().mockReturnValue({ ... }),
}

// Erro síncrono em CountriesService
countries.getByName.mockImplementation(() => {
  throw new NotFoundException('não encontrado')
})
```

Regra crítica: `CountriesService` é **síncrono**. Mocks seus métodos com `mockReturnValue` (não `mockResolvedValue`) e erros com `throw` (não `mockRejectedValue`).

---

## Frontend — Vitest

Framework: **Vitest** com **Testing Library** (`@testing-library/react`).

### Arquivos de teste (`*.test.tsx`)

| Arquivo | O que testa |
|---------|-------------|
| `components/SearchBar.test.tsx` | Input aceita texto, submit dispara busca |
| `components/DestinationCard.test.tsx` | Renderiza nome/bandeira, toggle wishlist/visited |
| `components/RecommendationsStrip.test.tsx` | Renderiza lista de recomendações, empty state |
| `components/ContinentStatsCard.test.tsx` | Exibe percentual e total visitados por continente |
| `components/WorldMap.test.tsx` | Renderiza mapa SVG, destaca países visitados |
| `components/AuthModal.test.tsx` | Formulário login/register, validação, erro de auth |
| `routes/home.test.tsx` | Fluxo completo: busca → resultado → adicionar wishlist |
| `routes/profile.test.tsx` | Estatísticas + listas visitados/wishlist |

### Setup e providers

`src/test/renderWithProviders.tsx` — helper que envolve componente com todos os providers necessários:
- `QueryClientProvider` (TanStack Query com `staleTime: 0` para testes)
- `AuthProvider` com user mockado (ou sem user para testes de guest)
- `RouterProvider` quando necessário

```tsx
import { renderWithProviders } from '@/test/renderWithProviders'

test('exibe nome do país', () => {
  renderWithProviders(<DestinationCard country={mockCountry} />)
  expect(screen.getByText('Japan')).toBeInTheDocument()
})
```

### Mocks de módulos

`src/test/setup.ts` — rodado antes de cada teste:
- Mock de `apiClient` para não fazer fetch real
- Mock de `sonner` (toasts) para não crashar em ambiente de teste
- Reset de todos os mocks entre testes

### Padrões

```tsx
// Aguardar conteúdo assíncrono
await waitFor(() => {
  expect(screen.getByText('Japan')).toBeInTheDocument()
})

// Simular ação do usuário
import userEvent from '@testing-library/user-event'
await userEvent.type(input, 'Japan')
await userEvent.click(searchButton)

// Verificar que algo NÃO existe
expect(screen.queryByText('Error')).not.toBeInTheDocument()

// Texto exato vs. substring
screen.getByText('10 visitados')          // exato
screen.getByText(/visitados/)             // regex
screen.getByText('10', { exact: false })  // substring
```

---

## Cobertura atual

### Backend (unitários)

| Módulo | Cobertura |
|--------|-----------|
| auth | Alta — todos os caminhos de sucesso e erro |
| destination | Alta — mock de APIs externas |
| countries | Alta — dados síncronos fáceis de testar |
| history | Alta — incluindo deduplicação e limite |
| recommendations | Média — sub-região e exclusões |
| semantic-search | Alta — FTS + fallback + keyword scoring |
| wishlist/visited | Alta — CRUD completo |
| stats | Média — agregação por continente |

### Frontend (componentes)

| Categoria | Cobertura |
|-----------|-----------|
| Componentes UI (cards, strips) | Alta |
| Fluxo de auth (login/register) | Alta |
| Rotas principais (home, profile) | Média |
| Hooks de dados | Baixa — testados indiretamente |

---

## Ignorar lint em arquivos de teste

Em testes e2e e specs que usam `supertest`, `any` é frequentemente inevitável ao inspecionar `response.body`. Padrão aprovado:

```ts
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
```

Adicionar no topo do arquivo (não inline) para manter o código limpo.
