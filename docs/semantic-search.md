# Busca Semântica

O EasyTrip implementa busca semântica de países inteiramente **offline** — sem embeddings, sem LLMs, sem APIs externas. O pipeline combina Full-Text Search (FTS) com BM25 e um mapa de palavras-chave estruturado.

---

## Pipeline geral

```
query do usuário
      │
      ▼
 1. Normalização
    (lowercase, strip diacríticos)
      │
      ▼
 2. FullTextSearchService.search()
    MiniSearch BM25 → lista de { cca2, bm25 }
      │
      ├── resultados FTS vazios?
      │         └── fallback por nome/cca2/cca3
      │
      ▼
 3. Para cada resultado FTS:
    keywordMap.filter(country) → entradas que batem
    tagScore = Σ entry.score
    score final = bm25 + tagScore
      │
      ▼
 4. Ordenar por score desc
    Retornar top 15
```

---

## 1. Construção do índice (`FullTextSearchService`)

Na inicialização do módulo (`onModuleInit`), o serviço constrói um índice **MiniSearch** com todos os ~250 países.

**Configuração do índice:**
```ts
new MiniSearch({
  fields: ['profile'],
  storeFields: ['id'],             // id = cca2
  tokenize: (text) =>
    normalize(text)
      .split(/[\s,.\-/()]+/)       // separa por espaço e pontuação
      .filter(Boolean),
  processTerm: (term) =>
    PorterStemmerPt.stem(term),    // stemming em português
})
```

O stemming via `PorterStemmerPt` (Natural.js) reduz palavras à raiz ("visitando" → "visit"), melhorando o recall em buscas em português.

**Parâmetros de busca:**
```ts
index.search(normalized, {
  prefix: true,          // "bra" bate em "Brazil"
  fuzzy: (term) =>
    term.length > 5 ? 0.2 : 0,   // ~20% de erro para termos > 5 chars
  combineWith: 'OR',     // cada token é buscado independentemente
})
```

---

## 2. Perfil textual por país (`buildProfile`)

Cada país é indexado como um documento de texto construído por `buildProfile()`.

O perfil inclui (em ordem):

| Campo | Exemplo |
|-------|---------|
| Nome em inglês | `"brazil"` |
| `altSpellings` | `"br", "brasil", "federative republic of brazil"` |
| Continente | `"south america"` |
| Sub-região | `"south america"` |
| Idiomas | `"portuguese"` |
| Moedas | `"brl"` |
| Tokens de clima (por latitude) | `"tropical quente hot calor trópico sol humid chuva floresta"` |
| Tokens de hemisfério (por latitude) | `"hemisferio sul southern inverno julho summer december estações invertidas"` |
| Landlocked / costeiro | `"com litoral coastal praia beach mar sea"` |
| Keywords do `keywordMap` que batem | `"fala português portuguese speaking lusofono"` |

### Tokens de clima (heurística por latitude)

| Latitude absoluta | Tokens |
|-------------------|--------|
| ≥ 66.5° (polar) | polar arctic glacial neve snow gelo ice extremo |
| ≥ 50° (frio) | frio cold gelado freezing neve snow inverno winter |
| ≥ 35° (temperado) | fresco cool temperado temperate clima ameno mild |
| ≥ 23.5° (subtropical) | quente warm calor heat sol sun verão subtropical |
| < 23.5° (tropical) | tropical quente hot calor trópico sol humid chuva rain floresta |

### Tokens de hemisfério

Hemisfério Sul adiciona tokens como "inverno julho" e "verão dezembro" — relevante para buscas sazonais ("verão em julho").

---

## 3. Keyword Map (`keyword-map.ts`)

O `keywordMap` é um array de entradas estruturadas que servem **dois propósitos**:

1. **Enriquecer o perfil FTS** — os keywords de cada entrada são adicionados ao perfil textual de todo país que satisfaz o filtro.
2. **Boostar o score** — ao combinar com resultados FTS, entradas com `filter(country) === true` somam seus `score` ao BM25.

```ts
interface KeywordEntry {
  keywords: string[];   // sinônimos em PT e EN (entram no índice FTS)
  filter: FilterFn;     // predicado sobre CountryMeta
  tag: string;          // label exibida ao usuário (ex: "Frio")
  score: number;        // peso adicionado ao score final
}
```

### Categorias de entradas no keywordMap

| Categoria | Exemplos de keywords | Score |
|-----------|---------------------|-------|
| Clima frio | frio, cold, gelado, país frio | 10 |
| Clima temperado | fresco, cool, temperado, clima ameno | 8 |
| Clima quente | calor, hot, tropical, país quente | 8 |
| Clima polar | ártico, arctic, polar, neve, tundra | 12 |
| Litoral / praia | praia, beach, costa, litoral | 6 |
| País sem saída ao mar | sem litoral, landlocked, interior | 7 |
| Hemisfério sul | hemisfério sul, southern, estações invertidas | 5 |
| Hemisfério norte | hemisfério norte, northern | 5 |
| Verão em dezembro | verão dezembro, summer december | 8 |
| Continentes | Europa, Europa, Ásia, Asia, África, Africa… | 6 |
| Idiomas | fala português, portuguese speaking, lusofono | 10 |
| Moedas | euro, dólar americano, libra esterlina | 7 |
| Países específicos | brasil, brazil, france, japan… | 15 |

O score alto de entradas específicas (ex: `score: 15` para "brasil") garante que a busca direta pelo nome do país apareça no topo mesmo com resultados FTS genéricos competindo.

---

## 4. Fallback por nome

Se o FTS retornar zero resultados (query muito curta, erro de digitação extremo, ou sigla de 2-3 letras), o fallback faz uma busca **direta** nos campos:

- `country.name` normalizado (strip diacríticos, lowercase) contém a query
- `country.cca2` (lowercase) é igual à query — ex: `"br"` → Brazil
- `country.cca3` (lowercase) é igual à query — ex: `"bra"` → Brazil

O fallback retorna `score: 1` e `matchedTags: []` para todos os resultados.

---

## Exemplos de busca

| Query | Por que funciona |
|-------|-----------------|
| `"Brasil"` | `altSpellings` contém "Brasil" → bate no FTS direto |
| `"país frio europa"` | "frio" → keywordMap clima, "europa" → continente; países europeus frios aparecem no topo |
| `"praia tropical"` | "praia" → keywordMap litoral, "tropical" → tokens de clima |
| `"fala português"` | keyword no mapa → PT + BR + MZ + AO… |
| `"verão em julho"` | "julho" → token de hemisfério sul; países do sul primeiro |
| `"BR"` | cca2 match no fallback |
| `"Japonesa"` | stem "japon" → bate parcialmente em "japanese" no perfil FTS |

---

## Localização no código

| Arquivo | Responsabilidade |
|---------|-----------------|
| `src/semantic-search/semantic-search.service.ts` | Orquestra FTS + keywordMap, calcula score final |
| `src/semantic-search/full-text-search.service.ts` | Constrói e consulta o índice MiniSearch |
| `src/semantic-search/country-profile.ts` | Gera o texto indexável por país |
| `src/semantic-search/keyword-map.ts` | Dicionário de tags semânticas com filtros e scores |
| `src/destination/destination.controller.ts` | Endpoint `GET /destination/search?q=` |
