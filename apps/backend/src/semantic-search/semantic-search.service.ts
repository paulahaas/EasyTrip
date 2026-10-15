import { Injectable, Logger } from '@nestjs/common';
import { CountryMeta, CountriesService } from '../countries/countries.service';
import { keywordMap } from './keyword-map';
import { FullTextSearchService } from './full-text-search.service';

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

@Injectable()
export class SemanticSearchService {
  private readonly logger = new Logger(SemanticSearchService.name);

  constructor(
    private readonly countries: CountriesService,
    private readonly fts: FullTextSearchService,
  ) {}

  async search(query: string): Promise<SemanticSearchResult[]> {
    await this.countries.loadAll();
    const all = this.countries.getAll();

    if (all.length === 0) {
      this.logger.warn('getAll() retornou vazio — loadAll() pode ter falhado');
    }

    // 1. Full-text search → ranked by BM25 (lazy rebuild if needed)
    const ftsHits = await this.fts.search(query);

    if (ftsHits.length === 0) {
      this.logger.debug(
        `Sem resultados FTS para "${query}", usando fallback por nome`,
      );
      return this.fallbackNameSearch(all, query.toLowerCase().trim());
    }

    // 2. Combine BM25 score with keyword-map tag scores, then sort desc
    const byCca2 = new Map(all.map((c) => [c.cca2, c]));
    const results: SemanticSearchResult[] = [];

    for (const { cca2, bm25 } of ftsHits) {
      const country = byCca2.get(cca2);
      if (!country) continue;

      const matchedEntries = keywordMap.filter((e) => e.filter(country));
      const tagScore = matchedEntries.reduce((sum, e) => sum + e.score, 0);
      const matchedTags = matchedEntries.map((e) => e.tag);

      results.push({
        cca2: country.cca2,
        cca3: country.cca3,
        name: country.name,
        flag: country.flag,
        continent: country.continent,
        subregion: country.subregion,
        matchedTags: [...new Set(matchedTags)],
        score: bm25 + tagScore,
      });
    }

    return results.sort((a, b) => b.score - a.score).slice(0, 15);
  }

  private fallbackNameSearch(
    all: CountryMeta[],
    query: string,
  ): SemanticSearchResult[] {
    const normalized = query
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

    const matches = all.filter((c) => {
      const name = c.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      return (
        name.includes(normalized) ||
        c.cca2.toLowerCase() === normalized ||
        c.cca3.toLowerCase() === normalized
      );
    });

    return matches
      .map<SemanticSearchResult>((c) => ({
        cca2: c.cca2,
        cca3: c.cca3,
        name: c.name,
        flag: c.flag,
        continent: c.continent,
        subregion: c.subregion,
        matchedTags: [],
        score: 1,
      }))
      .slice(0, 10);
  }
}
