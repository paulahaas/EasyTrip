import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import MiniSearch from 'minisearch';
import { PorterStemmerPt } from 'natural';
import { CountriesService } from '../countries/countries.service';
import { buildProfile } from './country-profile';

const DIACRITICS_RE = /[\u0300-\u036f]/g;

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(DIACRITICS_RE, '');
}

@Injectable()
export class FullTextSearchService implements OnModuleInit {
  private readonly logger = new Logger(FullTextSearchService.name);
  private index: MiniSearch<{ id: string; profile: string }>;
  private indexed = false;

  constructor(private readonly countries: CountriesService) {
    this.index = new MiniSearch({
      fields: ['profile'],
      storeFields: ['id'],
      tokenize: (text) =>
        normalize(text)
          .split(/[\s,.\-/()]+/)
          .filter(Boolean),
      processTerm: (term) => PorterStemmerPt.stem(term),
    });
  }

  async onModuleInit() {
    await this.buildIndex();
  }

  async buildIndex(): Promise<void> {
    if (this.indexed) return;
    await this.countries.loadAll();
    const all = this.countries.getAll();

    if (all.length === 0) {
      this.logger.warn(
        'buildIndex: no countries available, will retry on first search',
      );
      return;
    }

    const docs = all.map((c) => ({
      id: c.cca2,
      profile: buildProfile(c),
    }));

    this.index.addAll(docs);
    this.indexed = true;
    this.logger.log(`index built: ${docs.length} countries`);
  }

  async search(query: string): Promise<{ cca2: string; bm25: number }[]> {
    if (!this.indexed) {
      await this.buildIndex();
    }

    const results = this.index.search(normalize(query), {
      prefix: true,
      fuzzy: (term) => (term.length > 5 ? 0.2 : 0),
      boost: { profile: 1 },
      combineWith: 'OR',
    });

    return results.map((r) => ({ cca2: r.id as string, bm25: r.score }));
  }
}
