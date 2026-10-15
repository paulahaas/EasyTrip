import { Injectable } from '@nestjs/common';
import {
  CONTINENT_KEYS,
  CONTINENT_TOTALS,
  ContinentKey,
  StatsPerContinent,
  StatsResponse,
  isContinentKey,
} from '@easytrip/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async continents(userId: string): Promise<StatsResponse> {
    const grouped = await this.prisma.visitedCountry.groupBy({
      by: ['continent'],
      where: { userId },
      _count: { _all: true },
    });

    const countByContinent = new Map<ContinentKey, number>();
    let totalVisited = 0;
    for (const row of grouped) {
      const n = row._count._all;
      totalVisited += n;
      if (isContinentKey(row.continent)) {
        countByContinent.set(row.continent, n);
      }
    }

    const perContinent: StatsPerContinent[] = CONTINENT_KEYS.map((c) => {
      const visited = countByContinent.get(c) ?? 0;
      const total = CONTINENT_TOTALS[c];
      const percent = Math.round((visited / total) * 1000) / 10;
      return { continent: c, visited, total, percent };
    });

    return {
      totalVisited,
      perContinent,
      updatedAt: new Date().toISOString(),
    };
  }
}
