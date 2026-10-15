import { ConflictException, Injectable } from '@nestjs/common';
import { WishlistItem } from '@easytrip/shared';
import { Wishlist } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AddWishlistDto } from './dto/add-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string): Promise<WishlistItem[]> {
    const rows = await this.prisma.wishlist.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => this.toDTO(r));
  }

  async add(userId: string, dto: AddWishlistDto): Promise<WishlistItem> {
    const cca2 = dto.cca2.toUpperCase();
    try {
      const created = await this.prisma.wishlist.create({
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
        throw new ConflictException('Já está na wishlist');
      }
      throw err;
    }
  }

  async remove(userId: string, cca2: string): Promise<void> {
    await this.prisma.wishlist.deleteMany({
      where: { userId, cca2: cca2.toUpperCase() },
    });
  }

  private toDTO(row: Wishlist): WishlistItem {
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
