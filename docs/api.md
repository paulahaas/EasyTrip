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
{ "email": "user@example.com", "username": "maria.silva", "password": "secret123" }
```

- `email`: salvo em minúsculas (login não diferencia maiúsculas).
- `username`: 3 a 20 caracteres `[a-z0-9_.]`, salvo em minúsculas, único.
- `password`: 6 a 72 caracteres.

**Response 201:**
```json
{
  "user":   { "id": "cmoc0cudr0000aql4hyofnthb", "email": "user@example.com", "username": "maria.silva", "role": "USER", "createdAt": "..." },
  "tokens": { "accessToken": "eyJ..." }
}
```

**Erros:** `400` (validação), `409` (email ou nome de usuário em uso), `429` (muitas tentativas)

---

### `POST /auth/login`

**Body:**
```json
{ "login": "user@example.com", "password": "..." }
```

`login` aceita email ou nome de usuário.

**Response 200:** mesmo formato do register.

**Erros:** `401` (credenciais inválidas), `429` (mais de 10 tentativas em 15 min para o mesmo IP + login)

---

### `GET /auth/me` [JWT]

Retorna o usuário autenticado.

**Response 200:**
```json
{ "id": "cmoc...", "email": "user@example.com", "username": "maria.silva", "role": "USER", "createdAt": "..." }
```

---

### `PATCH /auth/me` [JWT]

Altera o nome de usuário. **Body:** `{ "username": "novo.nome" }`

**Erros:** `400` (formato inválido), `409` (nome em uso)

---

## Destination (busca + detalhes)

### `GET /destination/search?q={query}`

Busca semântica de países. Não requer autenticação.

**Parâmetros:**
- `q` (string, obrigatório, até 200 caracteres) — texto livre (ex: `"país frio europa"`, `"Brasil"`, `"BR"`). Ausente ou vazio → `400`.

**Response 200:**
```json
[
  {
    "cca2": "IS",
    "cca3": "ISL",
    "name": "Iceland",
    "namePt": "Islândia",
    "regionPt": "Europa",
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
- `name` (string) — nome em inglês ou português, sigla (`BR`, `BRA`) ou grafia alternativa, com ou sem acento (ex: `"Brazil"`, `"japao"`). Busca parcial só com 4+ letras e quando aponta para um único país.

**Response 200:**
```json
{
  "destino": "Japan",
  "informacoesDoPais": {
    "capital": "Tokyo",
    "capitalNome": "Tóquio",
    "idioma": "Japonês",
    "idiomas": ["Japonês"],
    "moeda": "Iene japonês (¥)",
    "codigoMoeda": "JPY",
    "populacao": "124.516.650 (2023)",
    "continente": "Asia",
    "continenteNome": "Ásia",
    "cca2": "JP",
    "cca3": "JPN",
    "nomeIngles": "Japan",
    "nome": "Japão",
    "fuso": { "fusoPrincipal": "Asia/Tokyo", "fusos": "UTC+09:00", "quantidade": 1 },
    "ddi": "+81",
    "maoDirecao": "esquerda",
    "comidas": [{ "nome": "Sushi", "descricao": "..." }],
    "regras": []
  },
  "clima": {
    "descricao": "céu limpo",
    "temperatura": "22°C",
    "sensacao": "20°C",
    "umidade": "60%"
  },
  "cambio": {
    "moedaOrigem": "JPY",
    "cotacaoEmBRL": "JP¥ 100,00 = R$ 3,18",
    "umRealEm": "R$ 1,00 = JP¥ 31,40",
    "atualizadoEm": "2026-11-22T00:00:01.000Z"
  },
  "geradoEm": "2026-11-23T21:00:00.000Z"
}
```

`destino` é o nome canônico em inglês. `geradoEm` vem em ISO 8601. `clima` e `cambio` vêm `null` quando a API externa falha ou a chave não está configurada (o país continua sendo exibido). O clima é consultado como `cidade,PAÍS` e fica 10 min em cache; o câmbio, 6 h.

**Erros:** `404` (país não encontrado)

---

## History (histórico de pesquisas)

### `GET /history` [JWT]

Retorna o histórico do usuário (últimas 8 entradas, ordem decrescente por data).

**Response 200:**
```json
[
  {
    "id": "cmoc...",
    "userId": "cmoc...",
    "query": "Japan",
    "countryName": "Japan",
    "cca2": "JP",
    "createdAt": "..."
  }
]
```

---

### `POST /history` [JWT]

Adiciona uma entrada ao histórico. O frontend chama ao abrir um país (texto livre da busca semântica não entra).

**Body:** `{ "query": "Japan" }` (até 100 caracteres)

**Comportamento:**
- Remove entrada anterior com o mesmo `cca2` (deduplicação)
- Mantém máximo de 8 entradas (remove as mais antigas)
- `404` se o texto não for um país

**Response 201:** objeto `SearchHistoryEntry`

---

### `POST /history/bulk` [JWT]

Adiciona múltiplas entradas (usado para migração do histórico local ao fazer login).

**Body:** `{ "queries": ["Japan", "France", "Brazil"] }`

**Comportamento:**
- Espera a lista do localStorage (mais nova primeiro) e preserva essa ordem
- Deduplica queries case-insensitive (até 64, cada uma com até 100 caracteres)
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
[{ "id": "cmoc...", "userId": "cmoc...", "cca2": "JP", "countryName": "Japan", "continent": "Asia", "createdAt": "..." }]
```

---

### `POST /wishlist` [JWT]

**Body:** `{ "cca2": "JP" }`

`countryName` e `continent` ainda são aceitos, mas ignorados: o servidor usa o nome canônico e o continente (Américas separadas em Norte/Sul) a partir do `cca2`.

**Response 201:** `WishlistItem`

**Erros:** `400` (código de país desconhecido), `409` (já na wishlist)

---

### `DELETE /wishlist/:cca2` [JWT]

**Response 200**

---

## Visited (países visitados)

Mesma estrutura da Wishlist, substituindo `/wishlist` por `/visited`.

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/visited` | Lista países visitados |
| POST | `/visited` | Marca país como visitado (`visitedAt` opcional, `AAAA-MM-DD`) |
| PATCH | `/visited/:cca2` | Define (`"AAAA-MM-DD"`) ou remove (`null`) a data da viagem |
| DELETE | `/visited/:cca2` | Remove da lista |

`visitedAt` vai de 1900 até o ano que vem.

**Erros POST:** `400` (código desconhecido ou data inválida), `409` (já marcado como visitado)
**Erros PATCH:** `404` (país não está entre os visitados)

---

## Recommendations

### `GET /recommendations` [JWT]

Retorna até 8 recomendações baseadas nas últimas 5 pesquisas: vizinhos de fronteira (peso 2, `reason: "border"`) e países da mesma sub-região (peso 1, `reason: "subregion"`), sem os que já estão em wishlist/visited/histórico. `continent` usa as mesmas chaves das estatísticas.

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

Os 7 continentes são sempre retornados (mesmo com `visited: 0`). `total` conta países e territórios do world-countries (África 59, Antártida 5, Ásia 50, Europa 53, América do Norte 42, Oceania 27, América do Sul 14); `percent` vai até 100.

---

## Users (perfil público)

### `GET /users/:id/profile` [JWT]

Retorna o perfil de um usuário (para compartilhamento). Exige login: quem abre o link sem conta vê um convite para se cadastrar. O email não é exposto.

**Response 200:**
```json
{
  "id": "cmoc...",
  "username": "maria.silva",
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
| 429 | Muitas tentativas de login/cadastro |
| 500 | Erro inesperado |
