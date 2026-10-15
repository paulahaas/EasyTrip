# Estilo de Código

Convenções aplicadas em todo o projeto. O lint (`ESLint + Prettier`) e os testes enforçam a maioria dessas regras automaticamente.

---

## Geral (frontend e backend)

### Sem comentários desnecessários

Não documentar o que o código já diz. Comentar apenas o **porquê** não óbvio: invariante sutil, workaround de bug, constraint oculta.

```ts
// ✅ Útil: explica a invariante
// altSpellings includes native names (e.g. "Brasil" for Brazil)
parts.push(country.altSpellings);

// ❌ Ruído: só repete o nome da função
// Builds the text profile for the country
export function buildProfile(country: CountryMeta): string {
```

### Sem `any` explícito

No backend, o TypeScript strict mode está ativo. No frontend, o ESLint reporta `@typescript-eslint/no-unsafe-*`. Quando o tipo vem de uma biblioteca sem tipos adequados, usar interfaces próprias:

```ts
// ✅
interface ExchangeApiResponse {
  conversion_rates: Record<string, number>;
}
const { data } = await firstValueFrom(
  this.http.get<ExchangeApiResponse>(url),
);

// ❌
const { data }: any = await firstValueFrom(this.http.get(url));
```

Em arquivos de teste onde `any` é inevitável (ex: `supertest.body`), usar `/* eslint-disable @typescript-eslint/no-unsafe-* */` no topo do arquivo.

### Sem features não pedidas

Não refatorar código ao redor de uma mudança. Não adicionar validação para casos impossíveis. Três linhas parecidas são melhores que uma abstração prematura.

---

## Frontend

### Componentes

- **Named exports** para componentes (não `default export`, exceto rotas)
- **Functional components** com TypeScript genérico
- Props em interface separada quando há mais de 2 campos

```tsx
// ✅
interface ContinentRowProps {
  continent: string
  visited: number
  total: number
  percent: number
}

export function ContinentRow({ continent, visited, total, percent }: ContinentRowProps) {
  return (...)
}

// ❌
export default function ContinentRow(props: any) { ... }
```

### Styling

1. Preferir classes CSS utilitárias (`et-card`, `et-chip`) sobre inline styles repetidos
2. Inline styles **apenas** para valores dinâmicos ou gradients complexos
3. Nunca hardcodar hex no JSX — usar tokens do `globals.css`
4. `cn()` de `@/lib/utils` para classes condicionais

```tsx
// ✅
<div className="et-card p-5">
  <span style={{ color: percent > 0 ? '#7dd3fc' : '#4e5468' }}>

// ❌
<div style={{ background: '#16181f', border: '1px solid rgba(255,255,255,0.07)' }}>
```

### Hooks de dados

Nunca chamar `api()` diretamente em componentes. Sempre via hook customizado:

```tsx
// ✅
const { items, add, remove } = useWishlist()

// ❌
const items = await api<WishlistItem[]>('/api/wishlist')
```

### Loading states

Usar skeleton com a mesma estrutura do conteúdo, não spinners genéricos:

```tsx
// ✅
if (isLoading) return <DestinationSkeleton />

// ❌
if (isLoading) return <Spinner />
```

### Skeleton loading com `.et-shimmer`

```tsx
{!stats && isLoading && (
  <div className="flex flex-col gap-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="et-shimmer h-4 w-32 rounded" />
    ))}
  </div>
)}
```

---

## Backend

### Módulos NestJS

Cada feature tem seu próprio módulo com `imports`, `providers` e `exports` explícitos. Nenhum acesso direto ao `PrismaService` fora do módulo responsável pela entidade.

```ts
@Module({
  imports: [PrismaModule, CountriesModule],
  providers: [HistoryService],
  controllers: [HistoryController],
  exports: [HistoryService],
})
export class HistoryModule {}
```

### Services

- `@Injectable()` + constructor injection sempre
- Métodos privados de mapeamento (`toDTO`) chamados com arrow wrapper para evitar `unbound-method`:

```ts
// ✅
return rows.map((r) => this.toDTO(r));

// ❌ — unbound-method lint error
return rows.map(this.toDTO);
```

- `CountriesService` é síncrono — nunca `await` seus métodos

```ts
// ✅
const country = this.countries.getByName(query);

// ❌ — await-thenable lint error
const country = await this.countries.getByName(query);
```

### Guards e decorators

- `@UseGuards(JwtAuthGuard)` em controllers protegidos
- `@Roles('ADMIN')` para endpoints de administrador
- `@CurrentUser()` para injetar o usuário autenticado no handler

```ts
@Get('me')
@UseGuards(JwtAuthGuard)
async me(@CurrentUser() user: AuthUser) {
  return this.authService.me(user.id);
}
```

### DTOs

- Validar com `class-validator` decorators
- Transformar com `class-transformer` (`@Transform`, `@Type`)
- Documentar com `@ApiProperty` do Swagger

```ts
export class LoginDto {
  @IsEmail()
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ example: 'senha1234' })
  password: string;
}
```

### Erros

Usar exceções do NestJS — nunca lançar `Error` genérico em controllers/services:

```ts
throw new NotFoundException(`País "${name}" não encontrado.`);
throw new UnauthorizedException('Senha incorreta');
throw new ConflictException('Já está na wishlist');
throw new ForbiddenException();
```

### Floating promises

Sempre `await` ou `void` promises não retornadas:

```ts
// ✅
void bootstrap();

// ❌ — no-floating-promises lint error
bootstrap();
```

---

## Shared

- Nunca duplicar tipos entre frontend e backend — sempre importar de `@easytrip/shared`
- Schemas Zod ficam em `packages/shared/src/schemas.ts`
- Interfaces de resposta da API ficam em `packages/shared/src/`

---

## Commits

Seguir **Conventional Commits**:

```
feat(scope): descrição
fix(scope): descrição
refactor(scope): descrição
style(scope): descrição
test(scope): descrição
docs(scope): descrição
```

Sem `Co-Authored-By` nas mensagens de commit.

---

## Lint e formatação

O lint no backend roda com `--fix` (corrige prettier automaticamente). O frontend usa ESLint sem `--fix` automático.

Rodar antes de commitar:
```bash
npm run lint   # verifica todos os pacotes
npm run test   # garante que nada quebrou
```
