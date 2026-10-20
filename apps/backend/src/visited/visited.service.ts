import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { VisitedCountry as SharedVisitedCountry } from '@easytrip/shared';
import { VisitedCountry } from '@prisma/client';
import { continentKeyFor } from '../countries/country-extras';
import { PrismaService } from '../prisma/prisma.service';
import { AddVisitedDto } from './dto/add-visited.dto';

@Injectable()
export class VisitedService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string): Promise<SharedVisitedCountry[]> {
    const rows = await this.prisma.visitedCountry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => this.toDTO(r));
  }

  async add(userId: string, dto: AddVisitedDto): Promise<SharedVisitedCountry> {
    const cca2 = dto.cca2.toUpperCase();
    try {
      const created = await this.prisma.visitedCountry.create({
        data: {
          userId,
          cca2,
          countryName: dto.countryName,
          // O continente vem do código do país, não do cliente.
          continent: continentKeyFor(cca2, dto.continent) ?? dto.continent,
          visitedAt: dto.visitedAt ? new Date(dto.visitedAt) : null,
        },
      });
      return this.toDTO(created);
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as { code: string }).code === 'P2002'
      ) {
        throw new ConflictException('Já marcado como visitado');
      }
      throw err;
    }
  }

  async setVisitedAt(
    userId: string,
    cca2: string,
    visitedAt: string | null,
  ): Promise<SharedVisitedCountry> {
    const { count } = await this.prisma.visitedCountry.updateMany({
      where: { userId, cca2: cca2.toUpperCase() },
      data: { visitedAt: visitedAt ? new Date(visitedAt) : null },
    });
    if (count === 0) {
      throw new NotFoundException('País não está entre os visitados');
    }
    const row = await this.prisma.visitedCountry.findUniqueOrThrow({
      where: { userId_cca2: { userId, cca2: cca2.toUpperCase() } },
    });
    return this.toDTO(row);
  }

  async remove(userId: string, cca2: string): Promise<void> {
    await this.prisma.visitedCountry.deleteMany({
      where: { userId, cca2: cca2.toUpperCase() },
    });
  }

  private toDTO(row: VisitedCountry): SharedVisitedCountry {
    return {
      id: row.id,
      userId: row.userId,
      cca2: row.cca2,
      countryName: row.countryName,
      continent: row.continent,
      visitedAt: row.visitedAt ? row.visitedAt.toISOString().slice(0, 10) : null,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
