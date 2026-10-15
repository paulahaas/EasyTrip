import type { StatsPerContinent } from './stats';
import type { WishlistItem } from './wishlist';
import type { VisitedCountry } from './visited';

export interface PublicProfile {
  id: string;
  email: string;
  createdAt: string;
  totalVisited: number;
  totalWishlist: number;
  perContinent: StatsPerContinent[];
  wishlist: WishlistItem[];
  visited: VisitedCountry[];
}
