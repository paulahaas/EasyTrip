import { Module } from '@nestjs/common';
import { StatsModule } from '../stats/stats.module';
import { VisitedModule } from '../visited/visited.module';
import { WishlistModule } from '../wishlist/wishlist.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [WishlistModule, VisitedModule, StatsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
