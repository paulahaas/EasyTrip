import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CountriesModule } from './countries/countries.module';
import { DestinationModule } from './destination/destination.module';
import { HistoryModule } from './history/history.module';
import { PrismaModule } from './prisma/prisma.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { StatsModule } from './stats/stats.module';
import { UsersModule } from './users/users.module';
import { VisitedModule } from './visited/visited.module';
import { WishlistModule } from './wishlist/wishlist.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    CountriesModule,
    HistoryModule,
    WishlistModule,
    VisitedModule,
    RecommendationsModule,
    StatsModule,
    DestinationModule,
  ],
})
export class AppModule {}
