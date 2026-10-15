import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 'cmoc0cudr0000aql4hyofnthb' })
  id!: string;

  @ApiProperty({ example: 'maria@easytrip.com' })
  email!: string;

  @ApiProperty({ enum: ['USER', 'ADMIN'], example: 'USER' })
  role!: 'USER' | 'ADMIN';

  @ApiProperty({ example: '2026-04-23T21:42:59.535Z' })
  createdAt!: string;
}

export class AuthTokensDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbW9jMGN1ZHIwMDAwYXFsNGh5b2ZudGhiIn0.signature',
  })
  accessToken!: string;
}

export class AuthResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user!: UserResponseDto;

  @ApiProperty({ type: AuthTokensDto })
  tokens!: AuthTokensDto;
}

export class SearchHistoryEntryDto {
  @ApiProperty({ example: 'cmoc0cudr0001aql4hyofnthb' })
  id!: string;

  @ApiProperty({ example: 'cmoc0cudr0000aql4hyofnthb' })
  userId!: string;

  @ApiProperty({ example: 'spain' })
  query!: string;

  @ApiProperty({ example: 'Spain' })
  countryName!: string;

  @ApiProperty({ example: 'ES' })
  cca2!: string;

  @ApiProperty({ example: '2026-04-23T21:42:59.535Z' })
  createdAt!: string;
}

export class WishlistItemDto {
  @ApiProperty({ example: 'cmoc0cudr0002aql4hyofnthb' })
  id!: string;

  @ApiProperty({ example: 'cmoc0cudr0000aql4hyofnthb' })
  userId!: string;

  @ApiProperty({ example: 'JP' })
  cca2!: string;

  @ApiProperty({ example: 'Japan' })
  countryName!: string;

  @ApiProperty({ example: 'Asia' })
  continent!: string;

  @ApiProperty({ example: '2026-04-23T21:42:59.535Z' })
  createdAt!: string;
}

export class VisitedCountryDto extends WishlistItemDto {}

export class RecommendationItemDto {
  @ApiProperty({ example: 'PT' })
  cca2!: string;

  @ApiProperty({ example: 'PRT' })
  cca3!: string;

  @ApiProperty({ example: 'Portugal' })
  countryName!: string;

  @ApiProperty({ example: 'Europe' })
  continent!: string;

  @ApiProperty({ enum: ['border', 'subregion'], example: 'border' })
  reason!: 'border' | 'subregion';

  @ApiProperty({ example: 3 })
  score!: number;
}

export class StatsPerContinentDto {
  @ApiProperty({
    enum: [
      'Africa',
      'Antarctica',
      'Asia',
      'Europe',
      'North America',
      'Oceania',
      'South America',
    ],
    example: 'Europe',
  })
  continent!: string;

  @ApiProperty({ example: 10 })
  visited!: number;

  @ApiProperty({ example: 53 })
  total!: number;

  @ApiProperty({ example: 18.9, description: 'Percentual com 1 casa decimal' })
  percent!: number;
}

export class StatsResponseDto {
  @ApiProperty({ example: 12 })
  totalVisited!: number;

  @ApiProperty({ type: [StatsPerContinentDto] })
  perContinent!: StatsPerContinentDto[];

  @ApiProperty({ example: '2026-04-23T21:42:59.535Z' })
  updatedAt!: string;
}

export class PublicProfileDto {
  @ApiProperty({ example: 'cmoc0cudr0000aql4hyofnthb' })
  id!: string;

  @ApiProperty({ example: 'maria@easytrip.com' })
  email!: string;

  @ApiProperty({ example: '2026-04-23T21:42:59.535Z' })
  createdAt!: string;

  @ApiProperty({ example: 12 })
  totalVisited!: number;

  @ApiProperty({ example: 5 })
  totalWishlist!: number;

  @ApiProperty({ type: [StatsPerContinentDto] })
  perContinent!: StatsPerContinentDto[];

  @ApiProperty({ type: [WishlistItemDto] })
  wishlist!: WishlistItemDto[];

  @ApiProperty({ type: [VisitedCountryDto] })
  visited!: VisitedCountryDto[];
}

export class OkResponseDto {
  @ApiProperty({ example: true })
  ok!: boolean;
}

export class ErrorResponseDto {
  @ApiProperty({ example: 401 })
  statusCode!: number;

  @ApiProperty({ example: 'Credenciais inválidas' })
  message!: string;

  @ApiProperty({ example: 'Unauthorized' })
  error!: string;
}
