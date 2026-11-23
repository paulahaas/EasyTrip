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
| `auth/auth.module.spec.ts` | `JWT_SECRET` obrigatório; segredo fraco recusado em produção |
| `auth/guards/login-throttle.guard.spec.ts` | Limite de 10 tentativas por IP + login a cada 15 min |
| `auth/guards/roles.guard.spec.ts` | Guard valida o JWT e permite/bloqueia por role |
| `countries/countries.service.spec.ts` | Resolução de nome (PT/EN, sem acento, siglas, trecho único) |
| `countries/country-extras.spec.ts` | Idiomas, continentes, DDI, mão de direção; totais por continente batem com o world-countries |
| `destination/destination.service.spec.ts` | Agrega país + clima + câmbio, propaga erro 404 |
| `destination/destination.controller.spec.ts` | Rota `/search` e `/:name` |
| `destination/services/country.service.spec.ts` | Busca por nome, cca2, cca3 — síncrona |
| `destination/services/weather.service.spec.ts` | Formata resposta do OpenWeatherMap, consulta `cidade,PAÍS`, cache |
| `destination/services/exchange.service.spec.ts` | Formata cotação do ExchangeRate |
| `history/history.service.spec.ts` | CRUD de histórico, deduplicação, limite de 8, bulk import |
| `recommendations/recommendations.service.spec.ts` | Fronteira (peso 2) + sub-região (peso 1), exclui já visitados/wishlist |
| `semantic-search/full-text-search.service.spec.ts` | Índice MiniSearch — busca exata, fuzzy, fallback |
| `semantic-search/keyword-map.spec.ts` | Filtros do keyword-map, normalização e stopwords |
| `semantic-search/semantic-search.service.spec.ts` | Score final = BM25 + tagScore |
| `stats/stats.service.spec.ts` | Agregação por continente, sempre 7 continentes |
| `users/users.service.spec.ts` | Criação, busca, perfil público |
| `visited/visited.service.spec.ts` | Add, remove, list, data da viagem — 409, país desconhecido (400) |
| `visited/dto/add-visited.dto.spec.ts` | Validação do DTO: data até o ano que vem, tamanho do nome |
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
| `components/AuthRequiredDialog.test.tsx` | Diálogo de login para conteúdo protegido |
| `components/ContinentStatsCard.test.tsx` | Exibe percentual e total visitados por continente |
| `components/CountryFlag.test.tsx` | Bandeira como imagem com fallback |
| `components/CountrySections.test.tsx` | Comidas típicas e regras do país |
| `components/LoginForm.test.tsx` | Login por email ou usuário, validação |
| `components/RegisterForm.test.tsx` | Cadastro, nome de usuário inválido, erro da API |
| `components/ProfileFeatures.test.tsx` | Conquistas, linha do tempo, comparar com amigo |
| `components/RecommendationsStrip.test.tsx` | Renderiza lista de recomendações, empty state |
| `components/SearchHistory.test.tsx` | Chips do histórico e limpar |
| `components/UsernameEditor.test.tsx` | Edição do nome de usuário |
| `components/charts/ContinentBarChart.test.tsx` | Gráfico por continente |
| `components/charts/WorldMapCard.test.tsx` | Todo país do world-atlas tem código (mapa casa por ccn3) |
| `components/charts/WorldPercentChart.test.tsx` | Percentual do mundo visitado |
| `context/AuthContext.test.tsx` | Login, migração do histórico, sessão mantida em 502 e encerrada em 401 |
| `hooks/useLocalHistory.test.ts` | Histórico local de visitante |
| `hooks/useWishlist.test.tsx` | Query + mutations da wishlist |
| `lib/countryMatch.test.ts` | Fallback por nome do mapa |

`src/test/setup.ts` troca o `localStorage` por um em memória quando o do ambiente não funciona (Node 25+ expõe um global próprio que encobre o do jsdom).

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
