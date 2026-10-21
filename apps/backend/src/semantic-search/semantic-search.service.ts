import { Injectable, Logger } from '@nestjs/common';
import type { SemanticSearchResult } from '@easytrip/shared';
import { CountryMeta, CountriesService } from '../countries/countries.service';
import { keywordMap } from './keyword-map';
import { FullTextSearchService } from './full-text-search.service';
import { continentNamePt } from '../countries/country-extras';

function normalize(text: string): string {
  return ` ${text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()} `;
}

export type { SemanticSearchResult };

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

    // 2. Only keyword-map entries mentioned in the query count towards the
    // score; otherwise countries with many tags (e.g. many languages) win
    // every search regardless of what was asked.
    const normalizedQuery = normalize(query);
    const queryEntries = keywordMap.filter((e) =>
      e.keywords.some((k) => normalizedQuery.includes(normalize(k))),
    );

    // 3. Countries that match at least one of the asked characteristics. When
    // the query names several ("ilhas no Pacífico", "país frio na Europa"),
    // keep only the countries that match all of them — unless the query says
    // "ou"/"or", or no country matches all.
    const byCca2 = new Map(all.map((c) => [c.cca2, c]));
    let candidates = ftsHits.flatMap(({ cca2, bm25 }) => {
      const country = byCca2.get(cca2);
      if (!country) return [];
      const matched = queryEntries.filter((e) => e.filter(country));
      if (queryEntries.length > 0 && matched.length === 0) return [];
      return [{ country, bm25, matched }];
    });
    const wantsAll =
      queryEntries.length > 1 && !/ (ou|or) /.test(normalizedQuery);
    if (
      wantsAll &&
      candidates.some((c) => c.matched.length === queryEntries.length)
    ) {
      candidates = candidates.filter(
        (c) => c.matched.length === queryEntries.length,
      );
    }

    // 4. Combine BM25 score with keyword-map tag scores, then sort desc
    const results: SemanticSearchResult[] = [];

    for (const { country, bm25, matched: matchedQueryEntries } of candidates) {
      const tagScore = matchedQueryEntries.reduce((sum, e) => sum + e.score, 0);
      const matchedTags = keywordMap
        .filter((e) => e.filter(country))
        .map((e) => e.tag);

      results.push({
        cca2: country.cca2,
        cca3: country.cca3,
        name: country.name,
        namePt: country.namePt,
        regionPt: continentNamePt(country.continent, country.subregion),
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
        namePt: c.namePt,
        regionPt: continentNamePt(c.continent, c.subregion),
        flag: c.flag,
        continent: c.continent,
        subregion: c.subregion,
        matchedTags: [],
        score: 1,
      }))
      .slice(0, 10);
  }
}
