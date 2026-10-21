# EasyTrip — Relatório do projeto

Atualizado em 21/10/2026.

## Resumo

O EasyTrip foi copiado do repositório do grupo ([marcella-81/EasyTrip](https://github.com/marcella-81/EasyTrip)) em 15/10/2026 para [paulahaas/EasyTrip](https://github.com/paulahaas/EasyTrip). Desde então recebeu 15 commits: o projeto passou a instalar e rodar no Windows sem Docker, ganhou correções de bugs e novas funcionalidades, e está publicado em [easytrip-e4xg.onrender.com](https://easytrip-e4xg.onrender.com).

A Parte 1 descreve o projeto como ele era ao ser copiado. A Parte 2 lista o que foi corrigido, alterado e adicionado depois.

## Parte 1 — O projeto original

Ao ser copiado, o repositório tinha 35 commits de seis autores (Richard, Marcella, Gustavo, Pedro e Paula) e 211 arquivos. Era uma plataforma de exploração de destinos com busca em linguagem natural, perfil do usuário e dados de clima e câmbio.

### Funcionalidades que já existiam

| Funcionalidade | Como funcionava |
| --- | --- |
| Busca semântica | Busca em português ou inglês ("país frio", "fala árabe"), com MiniSearch e stemmer em português |
| Informações do país | Capital, idioma, moeda e continente de 250 países, offline (pacote world-countries) |
| Clima | Temperatura, sensação térmica e umidade da capital (OpenWeatherMap, exigia chave) |
| Câmbio | Cotação da moeda local em reais (ExchangeRate API, exigia chave) |
| Contas | Cadastro e login com email e senha (JWT) |
| Perfil | Histórico de buscas, mapa-múndi pintado, estatísticas por continente |
| Favoritos e visitados | Listas de países, com recomendações por fronteira e sub-região |
| Perfil público | Link compartilhável com as estatísticas e listas do usuário |
| Documentação da API | Swagger em /api/docs |

### Tecnologias

| Parte | Tecnologias |
| --- | --- |
| Monorepo | Turborepo com npm workspaces |
| Backend (`apps/backend`) | NestJS, Prisma, PostgreSQL, JWT, MiniSearch |
| Frontend (`apps/frontend`) | React 19, Vite, TanStack Router e Query, Tailwind CSS v4, Radix UI |
| Código compartilhado (`packages/shared`) | TypeScript e Zod (tipos e validações) |
| Testes | Jest no backend, Vitest no frontend |

### Como rodava

O README mandava subir o backend com Docker (`npm run backend:up`) e usar um banco PostgreSQL no Railway. O frontend rodava separado com Vite. Não havia instruções para rodar sem Docker nem configuração de publicação do site.

### Problemas encontrados no projeto original

O projeto não instalava nem rodava num Windows comum, e várias funcionalidades tinham bugs. Todos os itens abaixo foram encontrados testando o projeto como recebido.

| Problema | Efeito |
| --- | --- |
| `package-lock.json` gerado num Mac, só com os binários do Mac | `npm install` no Windows instalava sem os binários do Vite, Tailwind e lightningcss, e o frontend não abria |
| Projeto dependia de Docker | Sem Docker funcionando, não havia jeito documentado de ter o banco de dados |
| Import do pacote compartilhado terminando em `.ts` | Backend compilava, mas quebrava ao iniciar (`Cannot find module`) |
| Erros de tipo e dependência faltando (`@testing-library/dom`) | `npm run build` do frontend falhava, ou seja, o site não podia ser publicado |
| Testes do frontend e testes de ponta a ponta quebrados | Os 11 arquivos de teste do frontend e os 5 de ponta a ponta nem chegavam a rodar |
| Pasta do site compilado procurada no lugar errado | Em produção, a API funcionava, mas a página principal dava erro 404 |
| Busca por idioma pontuava todas as características do país | "fala árabe", "fala alemão" e outras traziam sempre Zimbabwe e Brasil no topo |
| Busca só conhecia nomes em inglês | "estados unidos" trazia o México ("Estados Unidos Mexicanos") e não os EUA |
| Página do país dependia das chaves de clima e câmbio | Sem as chaves, a página dava erro 500 e não abria |
| População fixa no código | Todo país mostrava população "N/A" |
| Países das Américas salvos como "Americas" | Visitar o Brasil não contava para a América do Sul nas estatísticas |
| Perfil público exibia o email | Qualquer pessoa logada via o email de quem compartilhou o perfil |
| Dependências desatualizadas | 37 alertas de segurança, 6 críticos |
| Filtro de "ilha" só pelo nome em inglês e busca sem regiões de oceano | "ilhas no Pacífico" trazia as Ilhas Faroé (Atlântico) e deixava Japão e Fiji de fora |

## Parte 2 — O que mudou

### O que foi corrigido

Todos os problemas da tabela anterior foram resolvidos. O projeto agora instala com `npm install` no Windows, Mac e Linux, roda sem Docker e passa no build de produção.

| Correção | Como foi feita |
| --- | --- |
| Instalação no Windows e Linux | Acrescentados ao `package-lock.json` os binários de todos os sistemas, mantendo as mesmas versões; `allowScripts` libera os scripts de instalação do Prisma, bcrypt e esbuild no npm novo |
| Backend não iniciava | Import do pacote compartilhado corrigido no `tsconfig` |
| Build do frontend | Adicionado `@testing-library/dom`; `ringColor` (propriedade CSS inexistente) trocado pela classe `ring-[#16181f]`; tipos dos testes atualizados |
| Testes que não rodavam | Testes de ponta a ponta usam só o stemmer em português da biblioteca `natural` e rodam em série, para um teste não apagar os dados do outro |
| Site com erro 404 em produção | Backend procura a pasta do site compilado no lugar certo |
| Busca por idioma | Só as características citadas na busca contam pontos ("fala alemão" agora traz Alemanha, Áustria, Suíça) |
| Busca por nome em português | Nomes em português entram na busca ("estados unidos", "alemanha", "japão") |
| Página do país com erro 500 | Clima e câmbio passaram a ser opcionais: se falharem, o país aparece sem eles |
| População "N/A" | População de 2025 do Banco Mundial para 216 países, salva no projeto; `node scripts/update-population.mjs` atualiza |
| Continente das Américas | O servidor define o continente pelo código do país, e uma migração corrigiu os dados já salvos |
| Email no perfil público | Perfil público mostra o nome de usuário no lugar do email |
| Segurança | `npm audit fix` e bcrypt 5 → 6: os alertas do servidor foram corrigidos; sobraram 28, todos de ferramentas de teste ou do mapa do frontend |
| `npm run dev` com código antigo | O comando agora compila o pacote compartilhado antes de subir os servidores |
| Busca por ilhas e oceanos | "Ilha" inclui países sem fronteira terrestre; a busca entende Pacífico, Mediterrâneo, Índico e Atlântico; com várias características, só entram os países que atendem a todas (exceto com "ou") |

### O que foi alterado em funcionalidades existentes

As funcionalidades originais continuam, mas a maior parte passou a falar português e a depender menos de chaves de API.

| Funcionalidade | Antes | Depois |
| --- | --- | --- |
| Cadastro | Email e senha | Email, **nome de usuário** e senha |
| Login | Só email | Email **ou** nome de usuário |
| Topo do site e perfil | Parte do email antes do @ | `@nome` de usuário, editável no perfil |
| Página do país | Nome, continente e idioma em inglês | Nome, continente e idiomas em português ("Japão", "Ásia", "Japonês") |
| Moeda | "Brazilian real (R$)" | "Real brasileiro (R$)" |
| Câmbio | Só com chave; "1 JPY = R$ 0.037" | Sem chave; nos dois sentidos: "R$ 1,00 = JP¥ 31,38" e "JP¥ 100,00 = R$ 3,19", atualizado 1 vez por dia |
| População | "N/A" | "212.812.405 (2025)"; "Não disponível" só em territórios sem dado |
| Cartões da busca | "Japan", "Eastern Asia" | "Japão", "Ásia" |
| Listas de visitados e favoritos | Nomes em inglês | Nomes em português; visitados com campo de mês e ano da viagem |
| Perfil público | Mostrava o email | Mostra o `@nome`, as conquistas da pessoa e a comparação com você |
| Capital | "Tokyo", "Beijing", "London" | "Tóquio", "Pequim", "Londres" (80 capitais traduzidas; as iguais em português ficam como estão) |

### O que foi adicionado

Foram adicionadas nove funcionalidades novas, quatro na página do país e cinco no perfil.

**Na página do país**

| Funcionalidade | O que mostra |
| --- | --- |
| Hora local e fusos | Hora atual na capital, atualizada sozinha, e a faixa de fusos do país |
| Código de discagem e trânsito | DDI (ex.: +81) e o lado em que se dirige (mão inglesa ou direita) |
| Comidas e bebidas típicas | 3 a 5 pratos com descrição curta, para cerca de 80 países (Brasil: feijoada, coxinha, pão de queijo, brigadeiro, guaraná) |
| Regras importantes para turistas | Para cerca de 30 países com leis mais rígidas, separadas em Proibido, Obrigatório e Atenção (ex.: chiclete proibido em Singapura), com link para o Portal Consular do Itamaraty |

**No perfil**

| Funcionalidade | O que faz |
| --- | --- |
| Nome de usuário | `@nome` único de 3 a 20 caracteres, trocado pelo lápis ao lado do nome no perfil |
| Data das viagens | Mês e ano de cada país visitado, na aba Visitados |
| Linha do tempo | Aba nova com as viagens agrupadas por ano, da mais recente para a mais antiga |
| Conquistas | 15 selos calculados a partir dos países visitados ("Fora do Brasil", "Cinco continentes", "Bons vizinhos", "Ano agitado"), com barra de progresso |
| Comparar com amigo | No perfil público de outra pessoa: países em comum, só dela e só seus |

### Infraestrutura e publicação

O site está publicado no Render com o banco no Neon, os dois no plano gratuito, e no computador roda sem Docker.

| Onde | Antes | Depois |
| --- | --- | --- |
| Banco no computador | Docker (`docker compose`) | `npm run db:local`: PostgreSQL 17 portátil, sem instalar nada; dados em `.postgres-data/` |
| Banco do site publicado | Railway (sem configuração no repositório) | [Neon](https://neon.tech), projeto easytrip, região São Paulo |
| Publicação | Não existia | [Render](https://render.com) via `render.yaml`: cada push no GitHub publica sozinho |
| Migrações | Manuais | Rodam a cada início do servidor, pela conexão direta do Neon; o app usa a conexão com pooling |

No plano gratuito, o site dorme depois de 15 minutos sem visitas e leva cerca de 1 minuto para acordar. A cada início, o usuário de demonstração (`demo` / `demo1234`) é recriado e o histórico dele volta ao padrão.

O README ganhou as instruções de rodar sem Docker e de publicar no Render com o Neon.

### Testes e qualidade

O número de testes que passam subiu de 138 para 242, e o build de produção, que falhava, agora passa.

| Verificação | Antes | Depois |
| --- | --- | --- |
| Testes unitários do backend (Jest) | 138 passando | 171 passando |
| Testes do frontend (Vitest) | 0 (os 11 arquivos falhavam ao carregar) | 48 passando em 15 arquivos |
| Testes de ponta a ponta (API + banco) | 0 (os 5 arquivos falhavam ao carregar) | 23 passando |
| Erros de tipo (TypeScript) | Erros no frontend e nos testes do backend | Nenhum |
| `npm run build` | Falhava no frontend | Passa nos 3 pacotes |
| Alertas de segurança (`npm audit`) | 37 (6 críticos) | 28 (2 críticos), todos em ferramentas de teste ou no mapa do frontend |

Além dos testes automáticos, cada funcionalidade foi testada no navegador, no computador e no site publicado.

### Histórico de commits

As mudanças foram feitas em 16 commits no repositório [paulahaas/EasyTrip](https://github.com/paulahaas/EasyTrip), do mais recente para o mais antigo.

| Data | Commit | O que fez |
| --- | --- | --- |
| 21/10/2026 | `33f59a3` | Capitais em português e busca por oceanos e ilhas |
| 20/10/2026 | `28947ef` | Linha do tempo, conquistas, comparar com amigo e correção do continente das Américas |
| 20/10/2026 | `dce12bc` | Página do país completa: português, hora local, DDI, comidas, regras e câmbio sem chave |
| 15/10/2026 | `f40edef` | População real e nome da moeda em português |
| 15/10/2026 | `a525246` | Nome de usuário |
| 15/10/2026 | `d5b355b` | Gera o Prisma Client no build (corrigiu o primeiro deploy no Render) |
| 15/10/2026 | `37ed5c0` | Banco Neon no deploy |
| 15/10/2026 | `4c94141` | Deploy no Render e correção do erro 404 em produção |
| 15/10/2026 | `0188d7b` | Correção de vulnerabilidades de segurança |
| 15/10/2026 | `74dbf9d` | `npm run db:local`: banco portátil sem Docker |
| 15/10/2026 | `a1d02a4` | README: como rodar sem Docker |
| 15/10/2026 | `11e07be` | Build de produção e erros de tipo |
| 15/10/2026 | `9a32fa9` | Instalação no Windows e Linux |
| 15/10/2026 | `b174678` | Busca por idioma, nomes em português e página do país sem chaves |
| 15/10/2026 | `da496f1` | Import do pacote compartilhado no backend |
| 15/10/2026 | `aae19e4` | Cópia inicial do repositório do grupo |

## Limitações e próximos passos

O projeto está funcional e publicado; os itens abaixo são o que ainda falta ou merece revisão.

- **Revisar o conteúdo escrito à mão:** as comidas típicas e as regras para turistas não vêm de fonte oficial. Ficam em `apps/backend/src/countries/content/` (`foods.ts` e `rules.ts`), onde também se acrescentam países.
- **Clima:** só aparece com a chave gratuita da OpenWeather configurada no Render (`OPENWEATHER_API_KEY`).
- **Ainda em inglês:** 22 idiomas raros sem tradução.
- **Bandeiras no Windows:** aparecem como letras ("JP"), porque o Windows não desenha bandeiras em emoji.
- **Alertas de segurança restantes:** exigem atualizar o Vitest da versão 2 para a 5, uma mudança grande nas ferramentas de teste.
- **Repositório do grupo:** as correções não foram levadas para o repositório da Marcella, que continua com os problemas da Parte 1.
