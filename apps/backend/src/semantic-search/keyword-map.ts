// Dicionário de palavras-chave e frases (PT e EN) para filtros semânticos
// Cada entrada mapeia uma lista de sinônimos/frases para um filtro aplicável

export type FilterFn = (meta: {
  latlng: [number, number];
  landlocked: boolean;
  languages: string[];
  currencies: string[];
  continent: string;
  subregion: string;
  name: string;
  cca2: string;
  cca3: string;
}) => boolean;

interface KeywordEntry {
  keywords: string[]; // palavras/frases em PT e EN
  filter: FilterFn;
  tag: string; // tag exibida ao usuário
  score: number; // peso da relevância
}

// ---------- Helpers ----------
const lat = (m: { latlng: [number, number] }) => m.latlng[0];
// Países sem dado geográfico são mapeados para [0,0] — excluir de filtros lat-based
const hasCoords = (m: { latlng: [number, number] }) =>
  !(m.latlng[0] === 0 && m.latlng[1] === 0);
const isSouthernHemisphere = (m: { latlng: [number, number] }) =>
  hasCoords(m) && lat(m) < 0;
const isNorthernHemisphere = (m: { latlng: [number, number] }) =>
  hasCoords(m) && lat(m) > 0;

// ---------- Keyword Map ----------
export const keywordMap: KeywordEntry[] = [
  // --- Clima (heurística por latitude) ---
  {
    keywords: [
      'frio',
      'cold',
      'gelado',
      'freezing',
      'frio extremo',
      'pais frio',
      'país frio',
      'paises frios',
      'países frios',
      'cold country',
      'cold countries',
    ],
    filter: (m) => hasCoords(m) && Math.abs(lat(m)) > 50,
    tag: 'Frio',
    score: 10,
  },
  {
    keywords: [
      'fresco',
      'cool',
      'temperado',
      'temperate',
      'clima ameno',
      'mild climate',
      'moderado',
      'moderate',
    ],
    filter: (m) => {
      const a = Math.abs(lat(m));
      return hasCoords(m) && a >= 35 && a <= 50;
    },
    tag: 'Clima ameno',
    score: 10,
  },
  {
    keywords: [
      'quente',
      'hot',
      'warm',
      'calor',
      'caloroso',
      'warm country',
      'pais quente',
      'país quente',
      'paises quentes',
      'países quentes',
    ],
    filter: (m) => hasCoords(m) && Math.abs(lat(m)) < 25,
    tag: 'Quente',
    score: 10,
  },
  {
    keywords: [
      'tropical',
      'tropico',
      'trópico',
      'tropical country',
      'tropical countries',
    ],
    filter: (m) => hasCoords(m) && Math.abs(lat(m)) <= 23.5,
    tag: 'Tropical',
    score: 12,
  },
  {
    keywords: [
      'polar',
      'arctic',
      'antarctic',
      'polar region',
      'regiao polar',
      'região polar',
      'polo norte',
      'polo sul',
      'north pole',
      'south pole',
    ],
    filter: (m) => hasCoords(m) && Math.abs(lat(m)) >= 66.5,
    tag: 'Polar',
    score: 15,
  },

  // --- Hemisfério / Estações ---
  {
    keywords: [
      'inverno no meio do ano',
      'inverno julho',
      'winter in july',
      'winter in the middle of the year',
      'inverno acontece no meio do ano',
      'verao no final do ano',
      'verão no final do ano',
      'verão dezembro',
      'summer in december',
      'summer at the end of the year',
      'estacoes invertidas',
      'estações invertidas',
      'seasons reversed',
      'hemisferio sul',
      'hemisfério sul',
      'southern hemisphere',
    ],
    filter: isSouthernHemisphere,
    tag: 'Hemisfério Sul',
    score: 15,
  },
  {
    keywords: [
      'inverno no final do ano',
      'winter in december',
      'verao no meio do ano',
      'verão no meio do ano',
      'summer in july',
      'estacoes normais',
      'estações normais',
      'normal seasons',
      'hemisferio norte',
      'hemisfério norte',
      'northern hemisphere',
    ],
    filter: isNorthernHemisphere,
    tag: 'Hemisfério Norte',
    score: 15,
  },

  // --- Continente ---
  {
    keywords: ['europa', 'europe', 'european', 'europeu', 'europeia'],
    filter: (m) => m.continent.toLowerCase() === 'europe',
    tag: 'Europa',
    score: 10,
  },
  {
    keywords: ['asia', 'asian', 'asiatico', 'asiático', 'asiatica', 'asiática'],
    filter: (m) => m.continent.toLowerCase() === 'asia',
    tag: 'Ásia',
    score: 10,
  },
  {
    keywords: ['africa', 'áfrica', 'african', 'africano', 'africana'],
    filter: (m) => m.continent.toLowerCase() === 'africa',
    tag: 'África',
    score: 10,
  },
  {
    keywords: ['america', 'américa', 'american', 'americano', 'americana'],
    filter: (m) => m.continent.toLowerCase() === 'americas',
    tag: 'Américas',
    score: 10,
  },
  {
    keywords: ['oceania', 'oceanian', 'oceanico', 'oceânico'],
    filter: (m) => m.continent.toLowerCase() === 'oceania',
    tag: 'Oceania',
    score: 10,
  },
  {
    keywords: ['antartida', 'antártida', 'antarctica', 'antarctic'],
    filter: (m) => m.continent.toLowerCase() === 'antarctica',
    tag: 'Antártida',
    score: 10,
  },

  // --- Sub-região ---
  {
    keywords: [
      'america do sul',
      'américa do sul',
      'south america',
      'south american',
      'sul americano',
      'sul-americano',
    ],
    filter: (m) => m.subregion.toLowerCase().includes('south america'),
    tag: 'América do Sul',
    score: 12,
  },
  {
    keywords: [
      'america do norte',
      'américa do norte',
      'north america',
      'north american',
      'norte americano',
      'norte-americano',
    ],
    filter: (m) => m.subregion.toLowerCase().includes('north america'),
    tag: 'América do Norte',
    score: 12,
  },
  {
    keywords: [
      'america central',
      'américa central',
      'central america',
      'centro americano',
      'centro-americano',
    ],
    filter: (m) => m.subregion.toLowerCase().includes('central america'),
    tag: 'América Central',
    score: 12,
  },
  {
    keywords: ['caribe', 'caribbean', 'caribenho', 'caribenha'],
    filter: (m) => m.subregion.toLowerCase().includes('caribbean'),
    tag: 'Caribe',
    score: 12,
  },
  {
    keywords: [
      'europa ocidental',
      'western europe',
      'western european',
      'europeu ocidental',
    ],
    filter: (m) => m.subregion.toLowerCase().includes('western europe'),
    tag: 'Europa Ocidental',
    score: 12,
  },
  {
    keywords: [
      'europa oriental',
      'eastern europe',
      'eastern european',
      'europeu oriental',
    ],
    filter: (m) => m.subregion.toLowerCase().includes('eastern europe'),
    tag: 'Europa Oriental',
    score: 12,
  },
  {
    keywords: [
      'europa do norte',
      'northern europe',
      'nordic',
      'nordico',
      'nórdico',
      'escandinavia',
      'scandinavia',
      'scandinavian',
      'escandinavo',
      'paises nordicos',
      'países nórdicos',
      'nordic countries',
    ],
    filter: (m) =>
      m.subregion.toLowerCase().includes('northern europe') ||
      m.subregion.toLowerCase().includes('nordic'),
    tag: 'Europa do Norte',
    score: 12,
  },
  {
    keywords: [
      'europa do sul',
      'southern europe',
      'southern european',
      'mediterraneo',
      'mediterrâneo',
      'mediterranean',
    ],
    filter: (m) => m.subregion.toLowerCase().includes('southern europe'),
    tag: 'Europa do Sul',
    score: 12,
  },
  {
    keywords: [
      'sudeste asiatico',
      'sudeste asiático',
      'southeast asia',
      'southeast asian',
      'sudeste asiática',
    ],
    filter: (m) => m.subregion.toLowerCase().includes('south-eastern asia'),
    tag: 'Sudeste Asiático',
    score: 12,
  },
  {
    keywords: [
      'oriente medio',
      'oriente médio',
      'middle east',
      'middle eastern',
      'levante',
      'levant',
    ],
    filter: (m) => m.subregion.toLowerCase().includes('western asia'),
    tag: 'Oriente Médio',
    score: 12,
  },
  {
    keywords: [
      'asia central',
      'central asia',
      'central asian',
      'estaoes da asia central',
    ],
    filter: (m) => m.subregion.toLowerCase().includes('central asia'),
    tag: 'Ásia Central',
    score: 12,
  },
  {
    keywords: [
      'asia oriental',
      'east asia',
      'east asian',
      'oriental asia',
      'leste asiatico',
      'leste asiático',
    ],
    filter: (m) => m.subregion.toLowerCase().includes('eastern asia'),
    tag: 'Ásia Oriental',
    score: 12,
  },
  {
    keywords: [
      'africa do norte',
      'áfrica do norte',
      'north africa',
      'norte africano',
      'norte da africa',
      'norte da áfrica',
    ],
    filter: (m) => m.subregion.toLowerCase().includes('northern africa'),
    tag: 'África do Norte',
    score: 12,
  },
  {
    keywords: [
      'africa subsariana',
      'áfrica subsariana',
      'sub-saharan africa',
      'sub saharan africa',
      'subsaariano',
    ],
    filter: (m) =>
      m.continent.toLowerCase() === 'africa' &&
      !m.subregion.toLowerCase().includes('northern africa'),
    tag: 'África Subsaariana',
    score: 12,
  },

  // --- Idioma ---
  {
    keywords: [
      'portugues',
      'português',
      'portuguese',
      'fala portugues',
      'fala português',
      'falam portugues',
      'falam português',
      'speak portuguese',
    ],
    filter: (m) =>
      m.languages.some((l) => l.toLowerCase().includes('portuguese')),
    tag: 'Português',
    score: 13,
  },
  {
    keywords: [
      'ingles',
      'inglês',
      'english',
      'fala ingles',
      'fala inglês',
      'falam ingles',
      'falam inglês',
      'speak english',
    ],
    filter: (m) => m.languages.some((l) => l.toLowerCase().includes('english')),
    tag: 'Inglês',
    score: 13,
  },
  {
    keywords: [
      'espanhol',
      'spanish',
      'castelhano',
      'castilian',
      'fala espanhol',
      'falam espanhol',
      'speak spanish',
    ],
    filter: (m) => m.languages.some((l) => l.toLowerCase().includes('spanish')),
    tag: 'Espanhol',
    score: 13,
  },
  {
    keywords: [
      'frances',
      'francês',
      'french',
      'fala frances',
      'fala francês',
      'falam frances',
      'falam francês',
      'speak french',
    ],
    filter: (m) => m.languages.some((l) => l.toLowerCase().includes('french')),
    tag: 'Francês',
    score: 13,
  },
  {
    keywords: [
      'alemao',
      'alemão',
      'german',
      'deutsch',
      'fala alemao',
      'fala alemão',
      'falam alemao',
      'falam alemão',
      'speak german',
    ],
    filter: (m) => m.languages.some((l) => l.toLowerCase().includes('german')),
    tag: 'Alemão',
    score: 13,
  },
  {
    keywords: [
      'arabe',
      'árabe',
      'arabic',
      'fala arabe',
      'fala árabe',
      'falam arabe',
      'falam árabe',
      'speak arabic',
    ],
    filter: (m) => m.languages.some((l) => l.toLowerCase().includes('arabic')),
    tag: 'Árabe',
    score: 13,
  },
  {
    keywords: [
      'mandarim',
      'chines',
      'chinês',
      'chinese',
      'mandarin',
      'fala chines',
      'fala chinês',
      'falam chines',
      'falam chinês',
      'speak chinese',
      'speak mandarin',
    ],
    filter: (m) =>
      m.languages.some(
        (l) =>
          l.toLowerCase().includes('chinese') ||
          l.toLowerCase().includes('mandarin'),
      ),
    tag: 'Chinês',
    score: 13,
  },
  {
    keywords: [
      'russo',
      'russian',
      'fala russo',
      'falam russo',
      'speak russian',
    ],
    filter: (m) => m.languages.some((l) => l.toLowerCase().includes('russian')),
    tag: 'Russo',
    score: 13,
  },
  {
    keywords: [
      'japones',
      'japonês',
      'japanese',
      'fala japones',
      'fala japonês',
      'falam japones',
      'falam japonês',
      'speak japanese',
    ],
    filter: (m) =>
      m.languages.some((l) => l.toLowerCase().includes('japanese')),
    tag: 'Japonês',
    score: 13,
  },
  {
    keywords: [
      'italiano',
      'italian',
      'fala italiano',
      'falam italiano',
      'speak italian',
    ],
    filter: (m) => m.languages.some((l) => l.toLowerCase().includes('italian')),
    tag: 'Italiano',
    score: 13,
  },

  // --- Moeda ---
  {
    keywords: [
      'euro',
      'euros',
      'eur',
      'usa euro',
      'usam euro',
      'use euro',
      'uses euro',
    ],
    filter: (m) => m.currencies.includes('EUR'),
    tag: 'Euro',
    score: 13,
  },
  {
    keywords: [
      'dolar',
      'dólar',
      'dollar',
      'usd',
      'usa dolar',
      'usa dólar',
      'usam dolar',
      'usam dólar',
      'use dollar',
      'uses dollar',
    ],
    filter: (m) => m.currencies.includes('USD'),
    tag: 'Dólar',
    score: 13,
  },
  {
    keywords: [
      'libra',
      'pound',
      'gbp',
      'sterling',
      'usa libra',
      'usam libra',
      'use pound',
      'uses pound',
    ],
    filter: (m) => m.currencies.includes('GBP'),
    tag: 'Libra',
    score: 13,
  },
  {
    keywords: [
      'real',
      'brl',
      'brazilian real',
      'usa real',
      'usam real',
      'use real',
      'uses real',
    ],
    filter: (m) => m.currencies.includes('BRL'),
    tag: 'Real',
    score: 13,
  },
  {
    keywords: [
      'iene',
      'yen',
      'jpy',
      'usa iene',
      'usam iene',
      'use yen',
      'uses yen',
    ],
    filter: (m) => m.currencies.includes('JPY'),
    tag: 'Iene',
    score: 13,
  },

  // --- Geografia ---
  {
    keywords: [
      'ilha',
      'ilhas',
      'island',
      'islands',
      'island country',
      'island nation',
      'pais ilha',
      'país ilha',
      'paises ilha',
      'países ilha',
    ],
    filter: (m) => !m.landlocked && m.name.toLowerCase().includes('island'),
    tag: 'Ilha',
    score: 12,
  },
  {
    keywords: [
      'sem litoral',
      'landlocked',
      'sem costa',
      'interior',
      'pais sem litoral',
      'país sem litoral',
      'paises sem litoral',
      'países sem litoral',
      'enclavado',
      'enclaved',
    ],
    filter: (m) => m.landlocked,
    tag: 'Sem litoral',
    score: 12,
  },
  {
    keywords: [
      'com litoral',
      'coastal',
      'costeiro',
      'litoraneo',
      'litorâneo',
      'tem litoral',
      'tem costa',
      'tem praia',
      'pais com litoral',
      'país com litoral',
      'paises com litoral',
      'países com litoral',
    ],
    filter: (m) => !m.landlocked,
    tag: 'Com litoral',
    score: 8,
  },
  // --- Brasil (easter egg útil) ---
  {
    keywords: ['brasil', 'brazil', 'brasileiro', 'brasileira'],
    filter: (m) => m.cca2 === 'BR',
    tag: 'Brasil',
    score: 20,
  },
];

// Normaliza texto: remove acentos, lowercase, trim
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// Stopwords comuns em PT e EN
const STOPWORDS = new Set([
  'o',
  'a',
  'os',
  'as',
  'um',
  'uma',
  'uns',
  'umas',
  'de',
  'do',
  'da',
  'dos',
  'das',
  'em',
  'no',
  'na',
  'nos',
  'nas',
  'por',
  'para',
  'com',
  'sem',
  'sobre',
  'entre',
  'ate',
  'até',
  'que',
  'quem',
  'qual',
  'quais',
  'onde',
  'quando',
  'como',
  'porque',
  'the',
  'a',
  'an',
  'and',
  'or',
  'but',
  'in',
  'on',
  'at',
  'to',
  'for',
  'of',
  'with',
  'by',
  'from',
  'as',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'have',
  'has',
  'had',
  'do',
  'does',
  'did',
  'will',
  'would',
  'could',
  'should',
  'may',
  'might',
  'must',
  'shall',
  'can',
  'need',
  'dare',
  'ought',
  'used',
  'paises',
  'países',
  'pais',
  'país',
  'country',
  'countries',
  'nation',
  'nations',
  'place',
  'places',
]);

export function removeStopwords(text: string): string[] {
  return normalizeText(text)
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}
