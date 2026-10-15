# Hooks & Libs — Frontend

Todos os hooks ficam em `apps/frontend/src/hooks/`. A regra é: **nunca chamar `apiClient` diretamente em componentes** — sempre via hook.

---

## apiClient (`src/lib/apiClient.ts`)

Wrapper sobre `fetch` que:
- Injeta `Authorization: Bearer <token>` automaticamente (lê de `localStorage`)
- Define `Content-Type: application/json` quando há body
- Em `401` com token presente: remove token + dispatcha evento `auth:logout` → `AuthContext` faz logout
- Lança `ApiError` (subclasse de `Error`) com `message` e `status` em caso de erro HTTP

```ts
// Uso básico
const data = await api<WishlistItem[]>('/api/wishlist')

// Com body
const result = await api<WishlistItem>('/api/wishlist', {
  method: 'POST',
  body: JSON.stringify({ cca2: 'JP', countryName: 'Japan', continent: 'Asia' }),
})
```

Funções auxiliares exportadas: `getToken()`, `setToken(token)`, `clearToken()`.

---

## AuthContext (`src/context/AuthContext.tsx`)

Estado global de autenticação. Envolve toda a app via `<AuthProvider>`.

```ts
const { user, token, isAuthenticated, loading, login, register, logout } = useAuth()
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `user` | `User \| null` | Usuário autenticado |
| `token` | `string \| null` | JWT atual |
| `isAuthenticated` | `boolean` | `!!user && !!token` |
| `loading` | `boolean` | Hidratação inicial em curso |
| `login(dto)` | `Promise<void>` | POST `/auth/login` + aplica auth |
| `register(dto)` | `Promise<void>` | POST `/auth/register` + aplica auth |
| `logout()` | `void` | Remove token + limpa QueryClient |

**Fluxo de hidratação no mount:**
1. Lê token de `localStorage`
2. Se existe: `GET /auth/me` → popula `user`
3. Se `/me` retorna 401: faz logout
4. Após hidratação: `loading = false`

**Migração de histórico local:** ao fazer login/register, o histórico armazenado em `localStorage` (`easytrip:search-history`) é migrado automaticamente para o servidor via `POST /history/bulk`.

---

## Hooks de dados

### `useDestination`

Busca os detalhes de um país (clima + câmbio + info).

```ts
const { data, isLoading, error, search } = useDestination()
search('Japan')  // dispara GET /destination/Japan
```

Internamente usa `useMutation` para controle de loading/error por pesquisa.

---

### `useSemanticSearch`

Busca semântica de países.

```ts
const { data, loading, error, search, clear } = useSemanticSearch()
search('país frio europa')
// data: SemanticSearchResult[] | null
```

Usa `useMutation` (não `useQuery`) porque a busca é imperativa (acionada por input do usuário, não por mount).

---

### `useSearchHistory`

Gerencia o histórico de pesquisas. **Dual-mode**: funciona diferente para usuários autenticados vs. guests.

```ts
const { history, entries, isLoading, add, clear, removeById } = useSearchHistory()
```

| Estado | Autenticado | Guest |
|--------|-------------|-------|
| Armazenamento | Servidor (`/api/history`) | `localStorage` via `useLocalHistory` |
| `history` | `entries.map(e => e.countryName)` | Array de strings |
| `entries` | `SearchHistoryEntry[]` | `[]` |
| `add(query)` | POST `/api/history` | Persiste em localStorage |
| `clear()` | DELETE `/api/history` | Limpa localStorage |
| `removeById(id)` | DELETE `/api/history/:id` | no-op |

---

### `useLocalHistory` (interno)

Gerencia histórico em `localStorage` para usuários não autenticados. Chave: `easytrip:search-history`. Mantém até 20 entradas.

```ts
const { history, add, clear } = useLocalHistory()
```

---

### `useWishlist`

```ts
const { items, isLoading, add, remove } = useWishlist()
await add({ cca2: 'JP', countryName: 'Japan', continent: 'Asia' })
await remove('JP')
```

Desativado (`enabled: false`) quando não autenticado. Invalida `['wishlist']` e `['recommendations']` após mutações.

---

### `useVisited`

Mesma API que `useWishlist`, para países visitados.

```ts
const { items, isLoading, add, remove } = useVisited()
```

---

### `useRecommendations`

```ts
const { data, isLoading } = useRecommendations()
// data: RecommendationItem[] — recomendações baseadas no histórico
```

Retorna `[]` se não autenticado ou histórico vazio. A query key é `['recommendations']` — invalidada quando histórico ou wishlist muda.

---

### `useContinentStats`

```ts
const { data, isLoading } = useContinentStats()
// data: { totalVisited: number; perContinent: StatsPerContinent[] } | null
```

Chama `GET /api/stats/continents`. Desativado quando não autenticado.

---

### `usePublicProfile`

```ts
const { data, isLoading } = usePublicProfile(userId)
// data: PublicProfileResponse | undefined
```

Chama `GET /api/users/:id/profile`. Usado na rota `/profile/:id`.

---

## Utilitários em `src/lib/`

### `utils.ts`

```ts
import { cn } from '@/lib/utils'
// cn() combina clsx + tailwind-merge
cn('et-card p-4', isActive && 'border-accent')
```

### `flags.ts`

```ts
import { getCountryFlag } from '@/lib/flags'
getCountryFlag('Japan')  // retorna emoji da bandeira 🇯🇵
getCountryFlag('BR')     // suporta nome ou cca2
```

Fallback emoji para quando a URL de imagem não está disponível.

### `i18n.ts`

Mapa de nomes de continentes em português:

```ts
// "Europe" → "Europa", "North America" → "América do Norte", etc.
import { continentPt } from '@/lib/i18n'
continentPt['South America']  // "América do Sul"
```

### `countryMatch.ts`

Utilitário para verificar se uma string bate com um país (nome, cca2, cca3). Usado no frontend para filtrar resultados localmente.

### `queryClient.ts`

Configuração do `QueryClient` do TanStack Query:
- `staleTime: 60_000` (1 min) para dados de países
- `retry: false` em erros 4xx

---

## TanStack Router — rotas

```
/              → home (busca + resultados + recomendações)
/login         → formulário de login
/register      → formulário de cadastro
/profile       → perfil do usuário autenticado
/profile/:id   → perfil público (exige auth)
/about         → página sobre
```

Cada arquivo em `src/routes/` exporta uma função componente como `default` (convenção do TanStack Router).

---

## Query Keys

| Query Key | Endpoint | Invalidada por |
|-----------|----------|----------------|
| `['history']` | `/api/history` | add/clear/remove history, login |
| `['recommendations']` | `/api/recommendations` | add/clear history, add/remove wishlist |
| `['wishlist']` | `/api/wishlist` | add/remove wishlist |
| `['visited']` | `/api/visited` | add/remove visited |
| `['stats']` | `/api/stats/continents` | add/remove visited |
| `['public-profile', id]` | `/api/users/:id/profile` | — |
