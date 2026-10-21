export interface TypicalFood {
  nome: string;
  descricao: string;
}

export type RuleKind = 'proibido' | 'obrigatorio' | 'atencao';

export interface CountryRule {
  tipo: RuleKind;
  titulo: string;
  descricao: string;
}

export interface TimezoneInfo {
  /** Fuso IANA da capital, usado para mostrar a hora local (ex.: "Asia/Tokyo"). */
  fusoPrincipal: string;
  /** "UTC+09:00" ou uma faixa, como "UTC−02:00 a UTC−05:00". */
  fusos: string;
  quantidade: number;
}

export interface CountryInfo {
  /** Capital em inglês, usada para buscar o clima e o fuso — não traduzir. */
  capital: string;
  /** Capital em português, para exibição (ex.: "Tóquio"). */
  capitalNome: string;
  idioma: string;
  moeda: string;
  codigoMoeda: string;
  populacao: string;
  /** Chave em inglês usada por favoritos, visitados e estatísticas — não traduzir. */
  continente: string;
  cca2: string;
  cca3: string;
  /** Nome do país em português, para exibição. */
  nome: string;
  /** Continente em português, para exibição (nas Américas, a sub-região). */
  continenteNome: string;
  idiomas: string[];
  fuso: TimezoneInfo | null;
  ddi: string | null;
  maoDirecao: 'esquerda' | 'direita';
  comidas: TypicalFood[];
  regras: CountryRule[];
}

export interface WeatherInfo {
  descricao: string;
  temperatura: string;
  sensacao: string;
  umidade: string;
}

export interface ExchangeInfo {
  moedaOrigem: string;
  /** "US$ 1,00 = R$ 5,00" */
  cotacaoEmBRL: string;
  /** "R$ 1,00 = US$ 0,20" */
  umRealEm: string;
  /** ISO 8601 da última atualização da cotação. */
  atualizadoEm: string;
}

export interface DestinationResponse {
  destino: string;
  informacoesDoPais: CountryInfo;
  clima: WeatherInfo | null;
  cambio: ExchangeInfo | null;
  geradoEm: string;
}

export interface SemanticSearchResult {
  cca2: string;
  cca3: string;
  /** Nome em inglês, usado para abrir o país. */
  name: string;
  /** Nome em português, para exibição. */
  namePt: string;
  /** Continente/sub-região em português, para exibição. */
  regionPt: string;
  flag: string;
  continent: string;
  subregion: string;
  matchedTags: string[];
  score: number;
}
