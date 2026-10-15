export interface CountryInfo {
  capital: string;
  idioma: string;
  moeda: string;
  codigoMoeda: string;
  populacao: string;
  continente: string;
  cca2: string;
  cca3: string;
}

export interface WeatherInfo {
  descricao: string;
  temperatura: string;
  sensacao: string;
  umidade: string;
}

export interface ExchangeInfo {
  moedaOrigem: string;
  cotacaoEmBRL: string;
}

export interface DestinationResponse {
  destino: string;
  informacoesDoPais: CountryInfo;
  clima: WeatherInfo | null;
  cambio: ExchangeInfo;
  geradoEm: string;
}

export interface SemanticSearchResult {
  cca2: string;
  cca3: string;
  name: string;
  flag: string;
  continent: string;
  subregion: string;
  matchedTags: string[];
  score: number;
}
