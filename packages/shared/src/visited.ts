export interface VisitedCountry {
  id: string;
  userId: string;
  cca2: string;
  countryName: string;
  continent: string;
  /** Data da viagem (AAAA-MM-DD), quando informada. */
  visitedAt: string | null;
  createdAt: string;
}
