import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SearchHistoryEntry } from '@easytrip/shared';
import { SearchHistory } from '@prisma/client';
import { CountriesService } from '../countries/countries.service';
import { PrismaService } from '../prisma/prisma.service';

const MAX_HISTORY_PER_USER = 8;

@Injectable()
export class HistoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly countries: CountriesService,
  ) {}

  async list(userId: string): Promise<SearchHistoryEntry[]> {
    const rows = await this.prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: MAX_HISTORY_PER_USER,
    });
    return rows.map((r) => this.toDTO(r));
  }

  async addFromQuery(
    userId: string,
    query: string,
  ): Promise<SearchHistoryEntry> {
    const country = this.countries.getByName(query);
    await this.prisma.searchHistory.deleteMany({
      where: { userId, cca2: country.cca2 },
    });
    const created = await this.prisma.searchHistory.create({
      data: {
        userId,
        query: query.trim(),
        countryName: country.name,
        cca2: country.cca2,
      },
    });
    await this.trim(userId);
    return this.toDTO(created);
  }

  async addBulk(
    userId: string,
    queries: string[],
  ): Promise<SearchHistoryEntry[]> {
    const created: SearchHistoryEntry[] = [];
    const seen = new Set<string>();
    for (const raw of queries) {
      const q = raw.trim();
      if (!q) continue;
      const key = q.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      try {
        const entry = await this.addFromQuery(userId, q);
        created.push(entry);
      } catch {
        // best effort — ignora país não encontrado
      }
    }
    return created;
  }

  async deleteAll(userId: string): Promise<void> {
    await this.prisma.searchHistory.deleteMany({ where: { userId } });
  }

  async deleteById(userId: string, id: string): Promise<void> {
    const row = await this.prisma.searchHistory.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Entrada não encontrada');
    if (row.userId !== userId) throw new ForbiddenException();
    await this.prisma.searchHistory.delete({ where: { id } });
  }

  private async trim(userId: string): Promise<void> {
    const rows = await this.prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    });
    const stale = rows.slice(MAX_HISTORY_PER_USER).map((r) => r.id);
    if (stale.length > 0) {
      await this.prisma.searchHistory.deleteMany({
        where: { id: { in: stale } },
      });
    }
  }

  private toDTO(row: SearchHistory): SearchHistoryEntry {
    return {
      id: row.id,
      userId: row.userId,
      query: row.query,
      countryName: row.countryName,
      cca2: row.cca2,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
