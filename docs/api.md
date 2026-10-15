# API Reference

Base URL (local): `http://localhost:3000/api`

Documentação interativa: `http://localhost:3000/api/docs` (Swagger UI)

> Endpoints marcados com **[JWT]** exigem o header `Authorization: Bearer <token>`.

---

## Auth

### `POST /auth/register`

Cria um novo usuário.

**Body:**
```json
{ "email": "user@example.com", "password": "minimo8chars" }
```

**Response 201:**
```json
{
  "user":   { "id": "uuid", "email": "user@example.com", "role": "USER", "createdAt": "..." },
  "tokens": { "accessToken": "eyJ..." }
}
```

**Erros:** `400` (validação), `409` (email duplicado)

---

### `POST /auth/login`

**Body:**
```json
{ "email": "user@example.com", "password": "..." }
```

**Response 200:** mesmo formato do register.

**Erros:** `401` (credenciais inválidas)

---

### `GET /auth/me` [JWT]

Retorna o usuário autenticado.

**Response 200:**
```json
{ "id": "uuid", "email": "user@example.com", "role": "USER", "createdAt": "..." }
```

---

## Destination (busca + detalhes)

### `GET /destination/search?q={query}`

Busca semântica de países. Não requer autenticação.

**Parâmetros:**
- `q` (string, obrigatório) — texto livre (ex: `"país frio europa"`, `"Brasil"`, `"BR"`)

**Response 200:**
```json
[
  {
    "cca2": "IS",
    "cca3": "ISL",
    "name": "Iceland",
    "flag": "https://flagcdn.com/is.svg",
    "continent": "Europe",
    "subregion": "Northern Europe",
    "matchedTags": ["Frio", "Hem. Norte"],
    "score": 25.4
  }
]
```

Retorna até 15 resultados ordenados por score. Ver [Busca Semântica](./semantic-search.md) para detalhes do pipeline.

---

### `GET /destination/:name`

Retorna dados completos de um país: informações gerais + clima + câmbio.

**Parâmetros:**
- `name` (string) — nome do país em inglês (ex: `"Brazil"`, `"France"`)

**Response 200:**
```json
{
  "destino": "Japan",
  "informacoesDoPais": {
    "capital": "Tokyo",
    "idioma": "Japanese",
    "moeda": "Japanese yen (¥)",
    "codigoMoeda": "JPY",
    "populacao": "N/A",
    "continente": "Asia",
    "cca2": "JP",
    "cca3": "JPN"
  },
  "clima": {
    "descricao": "céu limpo",
    "temperatura": "22°C",
    "sensacao": "20°C",
    "umidade": "60%"
  },
  "cambio": {
    "moedaOrigem": "JPY",
    "cotacaoEmBRL": "1 JPY = R$ 0.03"
  },
  "geradoEm": "18/06/2026, 21:00:00"
}
```

**Erros:** `404` (país não encontrado), `500` (falha em API externa)

---

## History (histórico de pesquisas)

### `GET /history` [JWT]

Retorna o histórico do usuário (últimas 8 entradas, ordem decrescente por data).

**Response 200:**
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "query": "Japan",
    "countryName": "Japan",
    "cca2": "JP",
    "createdAt": "..."
  }
]
```

---

### `POST /history` [JWT]

Adiciona uma entrada ao histórico.

**Body:** `{ "query": "Japan" }`

**Comportamento:**
- Remove entrada anterior com o mesmo `cca2` (deduplicação)
- Mantém máximo de 8 entradas (remove as mais antigas)
- Invalida recomendações ao adicionar

**Response 201:** objeto `SearchHistoryEntry`

---

### `POST /history/bulk` [JWT]

Adiciona múltiplas entradas (usado para migração do histórico local ao fazer login).

**Body:** `{ "queries": ["Japan", "France", "Brazil"] }`

**Comportamento:**
- Deduplica queries case-insensitive
- Ignora países não encontrados (best-effort)

**Response 201:** array de `SearchHistoryEntry` criados

---

### `DELETE /history` [JWT]

Apaga todo o histórico do usuário.

**Response 200**

---

### `DELETE /history/:id` [JWT]

Remove uma entrada específica.

**Erros:** `404` (não encontrado), `403` (entrada pertence a outro usuário)

---

## Wishlist (favoritos)

### `GET /wishlist` [JWT]

**Response 200:** array de `WishlistItem`
```json
[{ "id": "uuid", "userId": "uuid", "cca2": "JP", "countryName": "Japan", "continent": "Asia", "createdAt": "..." }]
```

---

### `POST /wishlist` [JWT]

**Body:** `{ "cca2": "JP", "countryName": "Japan", "continent": "Asia" }`

**Response 201:** `WishlistItem`

**Erros:** `409` (já na wishlist)

---

### `DELETE /wishlist/:cca2` [JWT]

**Response 200**

---

## Visited (países visitados)

Mesma estrutura da Wishlist, substituindo `/wishlist` por `/visited`.

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/visited` | Lista países visitados |
| POST | `/visited` | Marca país como visitado |
| DELETE | `/visited/:cca2` | Remove da lista |

**Erros POST:** `409` (já marcado como visitado)

---

## Recommendations

### `GET /recommendations` [JWT]

Retorna até 8 recomendações baseadas no histórico do usuário (últimas 5 pesquisas → países da mesma sub-região não presentes em wishlist/visited/histórico).

**Response 200:**
```json
[
  {
    "cca2": "PT",
    "cca3": "PRT",
    "countryName": "Portugal",
    "continent": "Europe",
    "reason": "subregion",
    "score": 2
  }
]
```

Retorna `[]` se o histórico estiver vazio.

---

## Stats

### `GET /stats/continents` [JWT]

Estatísticas de países visitados por continente.

**Response 200:**
```json
{
  "totalVisited": 3,
  "perContinent": [
    { "continent": "Europe", "visited": 2, "total": 53, "percent": 3.8 },
    { "continent": "Asia",   "visited": 1, "total": 50, "percent": 2.0 },
    ...
  ],
  "updatedAt": "..."
}
```

Os 7 continentes são sempre retornados (mesmo com `visited: 0`).

---

## Users (perfil público)

### `GET /users/:id/profile` [JWT]

Retorna o perfil público de um usuário (para compartilhamento).

**Response 200:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "createdAt": "...",
  "totalVisited": 5,
  "totalWishlist": 3,
  "perContinent": [...],
  "visited": [{ "cca2": "JP", "countryName": "Japan", ... }],
  "wishlist": [...]
}
```

**Erros:** `404` (usuário não encontrado)

---

## Códigos de status globais

| Código | Significado |
|--------|-------------|
| 200 | OK |
| 201 | Criado |
| 204 | Sem conteúdo |
| 400 | Payload inválido (class-validator) |
| 401 | Não autenticado / token expirado |
| 403 | Sem permissão |
| 404 | Recurso não encontrado |
| 409 | Conflito (duplicata) |
| 500 | Erro em API externa |
