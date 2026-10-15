import type { ContinentKey } from './continents';

export interface StatsPerContinent {
  continent: ContinentKey;
  visited: number;
  total: number;
  percent: number;
}

export interface StatsResponse {
  totalVisited: number;
  perContinent: StatsPerContinent[];
  updatedAt: string;
}
