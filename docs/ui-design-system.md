# Design System — UI

O EasyTrip usa um design system dark-mode-first construído sobre **Tailwind CSS v4**, com tokens definidos via `@theme` em `globals.css`.

---

## Tokens de cor

Definidos em `apps/frontend/src/styles/globals.css` via `@theme`:

| Token | Hex | Uso |
|-------|-----|-----|
| `background` | `#0e0f14` | Fundo do `body` |
| `surface` | `#16181f` | Cards e painéis principais |
| `surface2` | `#1e2029` | Inputs, itens de lista, elementos internos |
| `surface3` | `#22252f` | Hover state de surface2 |
| `border` | `rgba(255,255,255,0.07)` | Borda padrão de cards |
| `border-subtle` | `rgba(255,255,255,0.04)` | Bordas muito sutis / divisores |
| `accent` | `#4f8ef7` | Azul primário — CTAs, links ativos |
| `accent2` | `#7dd3fc` | Azul claro — gradient partner |
| `foreground` | `#f0f2f8` | Texto principal |
| `muted` | `#7c8194` | Texto secundário / labels |
| `muted2` | `#4e5468` | Texto apagado / ícones inativos |
| `success` | `#34d399` | Verde — países visitados |
| `danger` | `#f87171` | Vermelho — remover, erros |
| `warning` | `#fbbf24` | Amarelo — alertas |

Para usar como classe Tailwind: `bg-surface`, `text-muted`, `border-accent`, etc.

---

## Gradiente accent

```css
background: linear-gradient(135deg, #4f8ef7, #7dd3fc);
```

Usado em botões primários (CTA), logo icon, progress bars e texto gradient.

Classes utilitárias:
```html
<div class="bg-gradient-accent">          <!-- fundo gradiente sólido -->
<div class="bg-gradient-accent-subtle">   <!-- fundo gradiente sutil (transparência) -->
<span class="text-gradient-accent">       <!-- texto com clip de gradiente -->
```

---

## Classes utilitárias CSS (`.et-*`)

Definidas em `globals.css`. Usar sempre que possível em vez de inline styles repetidos.

### Cards e superfícies

| Classe | Descrição |
|--------|-----------|
| `.et-card` | Card base: `bg-surface` + `border` + `border-radius 0.875rem` |
| `.et-card-hover` | Adiciona hover com lift (-2px), sombra e border accent |
| `.et-surface` | Superfície interna: `bg-surface2` + `border-radius 0.625rem` |

```html
<!-- Exemplo correto -->
<div class="et-card p-5">
  <div class="et-surface p-3">conteúdo interno</div>
</div>

<!-- Evitar: inline style repetitivo -->
<div style={{ background: '#16181f', border: '1px solid rgba(255,255,255,0.07)' }}>
```

### Chips / badges

| Classe | Descrição |
|--------|-----------|
| `.et-chip` | Chip clicável padrão — `bg-surface2`, borda sutil |
| `.et-chip-accent` | Chip de destaque — fundo accent com 10% opacidade, texto `accent2` |

```html
<button class="et-chip">Histórico</button>
<button class="et-chip et-chip-accent">Recomendado</button>
```

### Formulários

| Classe | Descrição |
|--------|-----------|
| `.et-input` | Input com foco accent, fundo `surface`, transições |
| `.et-label` | Label de seção: `text-xs`, `uppercase`, `tracking-widest`, `muted` |

```html
<p class="et-label mb-2">Por continente</p>
<input class="et-input w-full" />
```

### Progress bars

```html
<div class="et-progress-track" role="progressbar" aria-valuenow={18.9} ...>
  <div class="et-progress-fill" style={{ width: '18.9%' }} />
</div>
```

### Bandeiras

```html
<!-- SVG: qualquer tamanho, nítido -->
<img src="https://flagcdn.com/br.svg" class="et-flag" alt="Brasil" />

<!-- PNG com tamanho específico -->
<img src="https://flagcdn.com/w320/br.png" class="et-flag" />  <!-- thumbnail -->
<img src="https://flagcdn.com/w640/br.png" class="et-flag" />  <!-- hero -->
```

### Loading / skeleton

```html
<!-- Skeleton animado com shimmer -->
<div class="et-shimmer h-6 w-32 rounded" />
```

---

## Animações de entrada

```html
<div class="animate-fade-up">   <!-- fade + translateY(14px) → 0, 0.35s -->
<div class="animate-fade-in">   <!-- fade simples, 0.25s -->
<div class="animate-scale-in">  <!-- scale(0.97) → 1, 0.25s -->

<!-- Stagger automático para listas -->
<div class="stagger">
  <div>item 1 — delay 0ms</div>
  <div>item 2 — delay 50ms</div>
  <div>item 3 — delay 100ms</div>
</div>
```

---

## Tipografia

- **Fonte única:** Geist (`--font-sans`) para tudo — headings, body, labels.
- **Display headings:** `font-light` (300) ou `font-normal` (400) em tamanhos grandes (`text-2xl+`). Nunca bold em headings de destino.
- **Body:** peso padrão (400).
- **Labels de seção:** sempre via classe `.et-label`.

```html
<h1 class="text-3xl font-normal">Título principal</h1>
<h2 class="text-lg font-normal">Subtítulo de card</h2>
<p class="et-label">label de seção</p>
<p class="text-sm" style={{ color: '#7c8194' }}>texto secundário</p>
```

---

## Responsividade

Padrão mobile-first: escrever estilos mobile → escalar com `sm:`, `md:`, `lg:`.

| Contexto | Max-width |
|----------|-----------|
| Home / auth | `max-w-2xl` (672px) |
| Profile / admin | `max-w-5xl` (1024px) |

Padding lateral padrão: `px-4 sm:px-6`.

```html
<!-- Texto que some em mobile -->
<span class="hidden sm:inline">Texto longo</span>

<!-- Layout que empilha em mobile -->
<div class="flex flex-col sm:flex-row gap-4">
```

---

## Primitivos UI (Radix)

Os componentes em `src/components/ui/` são wrappers finos sobre **Radix UI**. Não modificar diretamente — customizar via `className`.

| Componente | Uso |
|------------|-----|
| `Button` | Botão base com variantes `default`, `outline`, `ghost`, `link` |
| `Dialog` | Modal acessível (keyboard, focus trap, aria) |
| `Tabs` | Navegação por abas |
| `Avatar` | Avatar com fallback de iniciais |
| `Tooltip` | Tooltip hover |
| `Input` | Input base estilizado |
| `Skeleton` | Placeholder de loading |

---

## Padrão de cores condicionais

Para cores que mudam baseadas em estado, usar inline style diretamente (Tailwind não suporta valores dinâmicos sem safelist):

```tsx
// Correto: cor dinâmica via inline style
<span style={{ color: percent > 0 ? '#7dd3fc' : '#4e5468' }}>
  {percent}%
</span>

// Correto: classes estáticas condicionais via cn()
<button className={cn('et-chip', isActive && 'et-chip-accent')}>

// Evitar: hex hardcoded que poderia ser token
<div style={{ background: '#16181f' }}>  // ← usar et-card ou bg-surface
```
