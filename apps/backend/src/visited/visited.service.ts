import { ConflictException, Injectable } from '@nestjs/common';
import { VisitedCountry as SharedVisitedCountry } from '@easytrip/shared';
import { VisitedCountry } from '@prisma/client';
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
          continent: dto.continent,
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
      createdAt: row.createdAt.toISOString(),
    };
  }
}
