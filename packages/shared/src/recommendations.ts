export type RecommendationReason = 'border' | 'subregion';

export interface RecommendationItem {
  cca2: string;
  cca3: string;
  countryName: string;
  continent: string;
  reason: RecommendationReason;
  score: number;
}
