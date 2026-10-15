# EasyTrip — Documentação Técnica

Guia técnico completo do projeto EasyTrip: um monorepo full-stack para pesquisa e gestão de destinos de viagem.

## Documentos disponíveis

| Documento | Descrição |
|-----------|-----------|
| [Arquitetura](./architecture.md) | Estrutura do monorepo, stack tecnológica, módulos |
| [API](./api.md) | Referência completa de endpoints REST |
| [Busca Semântica](./semantic-search.md) | Como funciona o pipeline de busca semântica |
| [Design System (UI)](./ui-design-system.md) | Tokens de cor, classes CSS, padrões de componente |
| [Hooks & Libs (Frontend)](./frontend-hooks.md) | Hooks customizados, apiClient, utilitários |
| [Estilo de Código](./code-style.md) | Convenções de código frontend e backend |
| [Testes](./testing.md) | Estratégias, cobertura e como rodar os testes |

## Comandos rápidos

```bash
# Raiz do monorepo
npm run dev        # Inicia frontend + backend em paralelo
npm run build      # Build de todos os apps
npm run test       # Roda todos os testes
npm run lint       # Lint em todos os pacotes

# Docker (banco)
docker compose up -d   # Sobe PostgreSQL local na porta 5432
```

## Links externos

- Swagger UI (local): `http://localhost:3000/api/docs`
- Dados de países: [world-countries](https://www.npmjs.com/package/world-countries) (offline, sem API key)
- Bandeiras: `https://flagcdn.com/{cca2}.svg`
