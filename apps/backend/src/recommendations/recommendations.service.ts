import { Injectable } from '@nestjs/common';
import { RecommendationItem, RecommendationReason } from '@easytrip/shared';
import { CountriesService, CountryMeta } from '../countries/countries.service';
import { PrismaService } from '../prisma/prisma.service';

const RECENT_SEARCHES = 5;
const MAX_RESULTS = 8;
const WEIGHT_SUBREGION = 1;

interface Tally {
  meta: CountryMeta;
  score: number;
}

@Injectable()
export class RecommendationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly countries: CountriesService,
  ) {}

  async forUser(userId: string): Promise<RecommendationItem[]> {
    const recent = await this.prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: RECENT_SEARCHES,
    });
    if (recent.length === 0) return [];

    const excluded = await this.buildExclusionSet(
      userId,
      recent.map((r) => r.cca2),
    );
    const tally = new Map<string, Tally>();

    for (const entry of recent) {
      const origin = this.countries.getByCca2(entry.cca2);
      if (!origin?.subregion) continue;

      const siblings = this.countries.getBySubregion(origin.subregion);
      for (const sib of siblings) {
        if (sib.cca2 === origin.cca2 || excluded.has(sib.cca2)) continue;
        this.bump(tally, sib, WEIGHT_SUBREGION);
      }
    }

    return [...tally.values()]
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_RESULTS)
      .map<RecommendationItem>((t) => ({
        cca2: t.meta.cca2,
        cca3: t.meta.cca3,
        countryName: t.meta.name,
        continent: t.meta.continent,
        reason: 'subregion' as RecommendationReason,
        score: t.score,
      }));
  }

  private async buildExclusionSet(
    userId: string,
    recentCca2s: string[],
  ): Promise<Set<string>> {
    const [wishlist, visited] = await Promise.all([
      this.prisma.wishlist.findMany({
        where: { userId },
        select: { cca2: true },
      }),
      this.prisma.visitedCountry.findMany({
        where: { userId },
        select: { cca2: true },
      }),
    ]);
    const out = new Set<string>();
    for (const c of recentCca2s) out.add(c.toUpperCase());
    for (const { cca2 } of wishlist) out.add(cca2.toUpperCase());
    for (const { cca2 } of visited) out.add(cca2.toUpperCase());
    return out;
  }

  private bump(tally: Map<string, Tally>, meta: CountryMeta, weight: number) {
    const cur = tally.get(meta.cca2);
    if (cur) {
      cur.score += weight;
    } else {
      tally.set(meta.cca2, { meta, score: weight });
    }
  }
}
